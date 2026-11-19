import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";

import {
  courseLanguage,
  guidedConcept,
  guidedSlugs,
  problem as getProblem,
  problemInfo,
  referenceSolution,
  soloConcept,
  soloSlugs,
  solutionPath,
  solutionsDir,
} from "./content.ts";
import type { Course, Language } from "./content.ts";
import {
  addHint,
  attempt,
  attemptsFor,
  closeExercises,
  open,
  openAttempt,
  openExercise,
} from "./db.ts";
import type { AttemptRow, Mode, Outcome, Phase, Recognition } from "./db.ts";
import { INDEPENDENT_HINT_LEVEL, grade } from "./grading.ts";
import { applyResults } from "./outcomes.ts";
import { ensureDataStructures, runTests } from "./runner.ts";
import { completeLesson, isPassed, problemStatus } from "./scheduler.ts";

/**
 * Solution files once began with the problem statement as a comment banner. The app shows
 * the statement itself, so the banner only pushed the code down.
 */
const BANNER =
  /^(?<mark>\/\/|#) [═=]{10,}\n\k<mark> PROBLEM · [\s\S]*?\n\k<mark> YOUR SOLUTION ·[^\n]*\n\k<mark> [═=]{10,}\n+/u;

/** A solution file's text without the old banner. */
export const withoutBanner = (text: string): string => text.replace(BANNER, "");

/** Set aside every other open attempt, with no grade, so one problem is open at a time. */
const pauseOthers = (course: Course, slug: string): void => {
  open(course)
    .query(
      "UPDATE attempts SET finished_at = ?, outcome = 'paused' WHERE finished_at IS NULL AND slug != ?"
    )
    .run(new Date().toISOString(), slug);
};

/** True when a guided task was solved, with or without help. */
const isSolved = (course: Course, slug: string): boolean =>
  ["solved", "solved_with_help"].includes(problemStatus(course, slug));

/** True when the lesson this solo task belongs to has other solo tasks not yet solved alone. */
const soloTasksLeft = (course: Course, slug: string): boolean => {
  const lesson = soloConcept(course, slug);

  return Boolean(
    lesson &&
    soloSlugs(course, lesson).some(
      (s) => s !== slug && problemStatus(course, s) !== "solved"
    )
  );
};

/**
 * Create the solution file if needed and open (or resume) an attempt. A review starts from
 * the empty stub, even on a problem solved before: recalling the approach is the review.
 */
export const startProblem = (
  course: Course,
  slug: string,
  language: Language = courseLanguage(course),
  mode: Mode | null = null
) => {
  const p = getProblem(course, slug);
  mkdirSync(solutionsDir(course), { recursive: true });

  if (language !== "jq") {
    ensureDataStructures(solutionsDir(course), language);
  }

  const file = solutionPath(course, slug, language);
  let current = openAttempt(course, slug, language);
  const resumed = Boolean(current);
  const stub = `${p.stubs[language].trimEnd()}\n`;

  // A review starts from the stub. So does a task that is taken again after it was solved:
  // with short tasks, the old answer would give the new attempt away.
  const fresh =
    !resumed && (mode === "review" || (language === "jq" && mode !== null));

  const created = !existsSync(file) || fresh;

  if (created) {
    writeFileSync(file, stub);
  } else {
    const text = readFileSync(file, "utf-8");
    const clean = withoutBanner(text);

    if (clean !== text) {
      writeFileSync(file, clean);
    }
  }

  pauseOthers(course, slug);

  if (!current) {
    const [mainConcept] = p.concepts;

    if (!mainConcept) {
      throw new Error(`Problem '${slug}' has no concepts.`);
    }

    const phase: Phase = p.concepts.every((id) => isPassed(course, id))
      ? "review"
      : "learning";

    closeExercises(course);

    const id = open(course)
      .query(
        "INSERT INTO attempts (slug, concept_id, language, started_at, phase, mode) VALUES (?, ?, ?, ?, ?, ?)"
      )
      .run(
        slug,
        mainConcept,
        language,
        new Date().toISOString(),
        phase,
        mode
      ).lastInsertRowid;

    current = attempt(course, Number(id));
  }

  return {
    attempt_id: current.id,
    concepts: p.concepts,
    difficulty: p.difficulty,
    file,
    file_created: created,
    mode: current.mode,
    phase: current.phase,
    resumed,
    title: p.title,
  };
};

/** Run the tests and, when an attempt is open, record the result on it. */
export const testSolution = (
  course: Course,
  slug: string,
  language: Language = courseLanguage(course),
  file = solutionPath(course, slug, language)
) => {
  const run = runTests(getProblem(course, slug), language, file);
  const current = openAttempt(course, slug, language);

  if (current) {
    open(course)
      .query(
        "UPDATE attempts SET test_runs = test_runs + 1, last_passed = ?, last_total = ? WHERE id = ?"
      )
      .run(run.passed, run.total, current.id);
  }

  return { attempt_id: current?.id ?? null, run };
};

/**
 * Set aside open attempts on problems the course no longer has, for example after its
 * lessons were rewritten. Such an attempt has nothing to show, so it must not be resumed.
 */
export const pauseUnknownAttempts = (course: Course): void => {
  for (const a of attemptsFor(course, {}).filter((row) => !row.finished_at)) {
    try {
      problemInfo(course, a.slug);
    } catch {
      open(course)
        .query(
          "UPDATE attempts SET finished_at = ?, outcome = 'paused' WHERE id = ?"
        )
        .run(new Date().toISOString(), a.id);
    }
  }
};

/** The attempt the learner is working on, if any. Only one is open at a time. */
export const currentAttempt = (course: Course) =>
  attemptsFor(course, {}).findLast((a) => !a.finished_at) ?? null;

/** The open attempt on a problem. Throws when the learner is not working on that problem. */
export const attemptOn = (course: Course, slug: string): AttemptRow => {
  const current = currentAttempt(course);

  if (current?.slug !== slug) {
    throw new Error(`No attempt is open for '${slug}'.`);
  }

  return current;
};

/** The learner's code for a problem, as the in-app editor shows it. */
export const readSolution = (
  course: Course,
  slug: string,
  language: Language
): string => {
  const file = solutionPath(course, slug, language);

  return existsSync(file) ? readFileSync(file, "utf-8") : "";
};

/** Save the editor's text to an open attempt's file. */
export const saveSolution = (
  course: Course,
  current: AttemptRow,
  text: string
): void =>
  writeFileSync(solutionPath(course, current.slug, current.language), text);

/**
 * Record a hint before it is given. It counts for whatever is on screen: the open
 * exercise, else the open problem attempt.
 */
export const logHint = (course: Course, level: number) => {
  const exercise = openExercise(course);

  if (exercise && !exercise.graded_at && exercise.kind !== "example") {
    open(course)
      .query(
        "UPDATE exercises SET max_hint_level = MAX(max_hint_level, ?) WHERE id = ?"
      )
      .run(level, exercise.id);

    return {
      on: `exercise ${exercise.id}`,
      still_counts_as_alone: level <= INDEPENDENT_HINT_LEVEL,
    };
  }

  const current = currentAttempt(course);

  if (!current) {
    throw new Error("Nothing is open, so there is nothing to hint on.");
  }

  addHint(course, current.id, null, level);

  return {
    on: `problem ${current.slug}`,
    still_counts_as_alone:
      Math.max(level, current.max_hint_level) <= INDEPENDENT_HINT_LEVEL,
  };
};

/** Close an attempt with an outcome and no verdict on any concept. */
const closeUngraded = (
  course: Course,
  id: number,
  outcome: Outcome,
  notes: string | null,
  now: Date
): void => {
  open(course)
    .query(
      "UPDATE attempts SET finished_at = ?, outcome = ?, gave_up = ?, rating = ?, notes = ? WHERE id = ?"
    )
    .run(
      now.toISOString(),
      outcome,
      outcome === "gave_up" ? 1 : 0,
      outcome === "solved" ? 3 : null,
      notes,
      id
    );
};

/**
 * Close an attempt that teaches but is not evidence yet, and return its outcome. Null when
 * the attempt is evidence and must be graded.
 *
 * A guided problem is solved with the lesson beside it: solving it marks the concept as
 * taught once every guided task of the lesson is solved. In a lesson with several solo
 * tasks, an unaided solve before the last one is recorded with no verdict: the lesson is
 * learned when all of them are solved alone.
 */
const finishTeaching = (
  course: Course,
  current: AttemptRow,
  solved: boolean,
  notes: string | null,
  now: Date
): Outcome | null => {
  const helped = current.max_hint_level > INDEPENDENT_HINT_LEVEL;
  const guided = guidedConcept(current.slug);

  if (guided) {
    let outcome: Outcome = "gave_up";

    if (solved) {
      outcome = helped ? "solved_with_help" : "solved";

      const othersDone = guidedSlugs(course, guided).every(
        (s) => s === current.slug || isSolved(course, s)
      );

      if (othersDone) {
        completeLesson(course, guided, now);
      }
    }

    closeUngraded(course, current.id, outcome, notes, now);

    return outcome;
  }

  if (
    solved &&
    !helped &&
    current.mode === "solo" &&
    soloTasksLeft(course, current.slug)
  ) {
    closeUngraded(course, current.id, "solved", notes, now);

    return "solved";
  }

  return null;
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
export const finishAttempt = (course: Course, input: FinishInput) => {
  const current = attempt(course, input.attemptId);

  if (current.finished_at) {
    throw new Error(`Attempt ${input.attemptId} is already finished.`);
  }

  const p = getProblem(course, current.slug);
  const now = new Date();

  if (input.stopped === "paused") {
    open(course)
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
  const { run } = testSolution(course, current.slug, current.language);

  const solved =
    !run.fatal && run.passed === run.total && input.stopped !== "gave_up";

  if (!solved && input.stopped !== "gave_up") {
    throw new Error(
      `The tests do not pass (${run.passed}/${run.total}). Let the learner keep going, or set stopped to 'gave_up' or 'paused'.`
    );
  }

  const early = finishTeaching(
    course,
    current,
    solved,
    input.notes ?? null,
    now
  );

  if (early) {
    return {
      concepts: [],
      implicit_credit: [],
      minutes: Math.round(
        (now.getTime() - new Date(current.started_at).getTime()) / 60_000
      ),
      outcome: early,
      pulled_forward: [],
      tests: `${run.passed}/${run.total}`,
    };
  }

  const results = grade({
    correct: solved,
    maxHintLevel: current.max_hint_level,
    targets: p.concepts,
  });

  const recognition = input.recognition ?? "skipped";

  const applied = applyResults(course, {
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

  open(course)
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

/** What handing in a problem did, as the app shows it. */
export interface Handed {
  /** False when the tests do not pass yet: the learner keeps going. */
  finished: boolean;
  run: ReturnType<typeof testSolution>["run"];
  result: ReturnType<typeof finishAttempt> | null;
}

/**
 * The learner pressed Submit. The tests run; if they pass, the attempt closes and is graded.
 * In a review the learner chose the approach unprompted, so an unaided solve counts as
 * recognising it.
 */
export const submitProblem = (course: Course, current: AttemptRow): Handed => {
  const { run } = testSolution(course, current.slug, current.language);

  if (run.fatal || run.passed !== run.total) {
    return { finished: false, result: null, run };
  }

  const alone = current.max_hint_level <= INDEPENDENT_HINT_LEVEL;

  const result = finishAttempt(course, {
    attemptId: current.id,
    recognition: current.mode === "review" && alone ? "correct" : "skipped",
  });

  return { finished: true, result, run };
};

/** The learner gave up: the attempt closes as a struggle, and a worked solution is shown. */
export const giveUp = (course: Course, current: AttemptRow) => {
  const result = finishAttempt(course, {
    attemptId: current.id,
    stopped: "gave_up",
  });

  return {
    result,
    solution: referenceSolution(course, current.slug, current.language),
  };
};

/** Set the open attempt aside with no grade, for example when the learner ends a review session. */
export const pauseAttempt = (course: Course, current: AttemptRow): void => {
  finishAttempt(course, { attemptId: current.id, stopped: "paused" });
};
