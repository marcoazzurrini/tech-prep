import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";

import {
  DEFAULT_LANGUAGE,
  WORKSPACE_DIR,
  problem as getProblem,
  solutionPath,
} from "./content.ts";
import type { Language } from "./content.ts";
import {
  addHint,
  attempt,
  attemptsFor,
  closeExercises,
  open,
  openAttempt,
  openExercise,
} from "./db.ts";
import type { Outcome, Phase, Recognition } from "./db.ts";
import { INDEPENDENT_HINT_LEVEL, grade } from "./grading.ts";
import { applyResults } from "./outcomes.ts";
import { ensureDataStructures, runTests } from "./runner.ts";
import { isPassed } from "./scheduler.ts";

/**
 * Solution files once began with the problem statement as a comment banner. The app shows
 * the statement itself, so the banner only pushed the code down.
 */
const BANNER =
  /^(?<mark>\/\/|#) [═=]{10,}\n\k<mark> PROBLEM · [\s\S]*?\n\k<mark> YOUR SOLUTION ·[^\n]*\n\k<mark> [═=]{10,}\n+/u;

/** A solution file's text without the old banner. */
export const withoutBanner = (text: string): string => text.replace(BANNER, "");

/** Create the solution file if needed and open (or resume) an attempt. */
export const startProblem = (
  slug: string,
  language: Language = DEFAULT_LANGUAGE
) => {
  const p = getProblem(slug);
  mkdirSync(WORKSPACE_DIR, { recursive: true });
  ensureDataStructures(WORKSPACE_DIR, language);
  const file = solutionPath(slug, language);
  const created = !existsSync(file);

  if (created) {
    writeFileSync(file, `${p.stubs[language].trimEnd()}\n`);
  } else {
    const text = readFileSync(file, "utf-8");
    const clean = withoutBanner(text);

    if (clean !== text) {
      writeFileSync(file, clean);
    }
  }

  let current = openAttempt(slug, language);
  const resumed = Boolean(current);

  if (!current) {
    const [mainConcept] = p.concepts;

    if (!mainConcept) {
      throw new Error(`Problem '${slug}' has no concepts.`);
    }

    const phase: Phase = p.concepts.every(isPassed) ? "review" : "learning";
    closeExercises();

    const id = open()
      .query(
        "INSERT INTO attempts (slug, concept_id, language, started_at, phase) VALUES (?, ?, ?, ?, ?)"
      )
      .run(
        slug,
        mainConcept,
        language,
        new Date().toISOString(),
        phase
      ).lastInsertRowid;

    current = attempt(Number(id));
  }

  return {
    attempt_id: current.id,
    concepts: p.concepts,
    difficulty: p.difficulty,
    file,
    file_created: created,
    phase: current.phase,
    resumed,
    title: p.title,
  };
};

/** Run the tests and, when an attempt is open, record the result on it. */
export const testSolution = (
  slug: string,
  language: Language = DEFAULT_LANGUAGE,
  file = solutionPath(slug, language)
) => {
  const run = runTests(getProblem(slug), language, file);
  const current = openAttempt(slug, language);

  if (current) {
    open()
      .query(
        "UPDATE attempts SET test_runs = test_runs + 1, last_passed = ?, last_total = ? WHERE id = ?"
      )
      .run(run.passed, run.total, current.id);
  }

  return { attempt_id: current?.id ?? null, run };
};

/** The attempt the learner is working on, if any. */
export const currentAttempt = () =>
  attemptsFor({}).findLast((a) => !a.finished_at) ?? null;

/** The learner's code for a problem, as the in-app editor shows it. */
export const readSolution = (slug: string, language: Language): string => {
  const file = solutionPath(slug, language);

  return existsSync(file) ? readFileSync(file, "utf-8") : "";
};

/** Save the editor's text. Only the open attempt's file can change. */
export const saveSolution = (
  slug: string,
  language: Language,
  text: string
): void => {
  if (!openAttempt(slug, language)) {
    throw new Error(`No attempt is open for '${slug}'.`);
  }

  writeFileSync(solutionPath(slug, language), text);
};

/**
 * Record a hint before it is given. It counts for whatever is on screen: the open
 * exercise, else the open problem attempt.
 */
export const logHint = (level: number) => {
  const exercise = openExercise();

  if (exercise && !exercise.graded_at && exercise.kind !== "example") {
    open()
      .query(
        "UPDATE exercises SET max_hint_level = MAX(max_hint_level, ?) WHERE id = ?"
      )
      .run(level, exercise.id);

    return {
      on: `exercise ${exercise.id}`,
      still_counts_as_alone: level <= INDEPENDENT_HINT_LEVEL,
    };
  }

  const current = currentAttempt();

  if (!current) {
    throw new Error("Nothing is open, so there is nothing to hint on.");
  }

  addHint(current.id, null, level);

  return {
    on: `problem ${current.slug}`,
    still_counts_as_alone:
      Math.max(level, current.max_hint_level) <= INDEPENDENT_HINT_LEVEL,
  };
};

export interface FinishInput {
  attemptId: number;
  /** Set when the tests do not pass: the learner gave up, or stopped for outside reasons (no grade). */
  stopped?: "gave_up" | "paused";
  recognition?: Recognition;
  notes?: string;
}

/**
 * Close an attempt. Every target concept gets the same pass or fail: a pass needs the tests
 * to pass with no hint beyond a guiding question. See docs/learning-model.md.
 */
export const finishAttempt = (input: FinishInput) => {
  const current = attempt(input.attemptId);

  if (current.finished_at) {
    throw new Error(`Attempt ${input.attemptId} is already finished.`);
  }

  const p = getProblem(current.slug);
  const now = new Date();

  if (input.stopped === "paused") {
    open()
      .query(
        "UPDATE attempts SET finished_at = ?, outcome = 'paused', notes = ? WHERE id = ?"
      )
      .run(now.toISOString(), input.notes ?? null, current.id);

    return {
      note: "No grade recorded. The problem can be started again at any time.",
      outcome: "paused",
    };
  }

  // Re-run so the grade reflects the file as it is now, not the last manual test run.
  // SAFETY: startProblem opens attempts with a Language, and only it inserts them.
  const { run } = testSolution(current.slug, current.language as Language);

  const solved =
    !run.fatal && run.passed === run.total && input.stopped !== "gave_up";

  if (!solved && input.stopped !== "gave_up") {
    throw new Error(
      `The tests do not pass (${run.passed}/${run.total}). Let the learner keep going, or set stopped to 'gave_up' or 'paused'.`
    );
  }

  const results = grade({
    correct: solved,
    maxHintLevel: current.max_hint_level,
    targets: p.concepts,
  });

  const recognition = input.recognition ?? "skipped";

  const applied = applyResults({
    fromProblem: true,
    now,
    recognitionOk: recognition === "correct",
    results,
    source: { attemptId: current.id },
  });

  const alone = results.every((r) => r.result === "pass");
  let outcome: Outcome = "gave_up";

  if (solved) {
    outcome = alone ? "solved" : "solved_with_help";
  }

  const phase: Phase = applied.reviewed ? "review" : "learning";

  const minutes =
    (now.getTime() - new Date(current.started_at).getTime()) / 60_000;

  open()
    .query(
      `UPDATE attempts SET finished_at = ?, phase = ?, outcome = ?, recognition = ?, gave_up = ?,
         rating = ?, notes = ? WHERE id = ?`
    )
    .run(
      now.toISOString(),
      phase,
      outcome,
      recognition,
      outcome === "gave_up" ? 1 : 0,
      alone ? 3 : 1,
      input.notes ?? null,
      current.id
    );

  return {
    concepts: applied.concepts,
    implicit_credit: applied.implicit_credit,
    minutes: Math.round(minutes),
    outcome,
    pulled_forward: applied.pulled_forward,
    tests: `${run.passed}/${run.total}`,
  };
};
