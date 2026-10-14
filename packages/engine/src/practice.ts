import { existsSync, mkdirSync, writeFileSync } from "node:fs";
import {
  DEFAULT_LANGUAGE,
  WORKSPACE_DIR,
  problem as getProblem,
  solutionPath,
  type Language,
  type Problem,
  wrap,
} from "./content.ts";
import {
  addHint,
  attempt,
  hintsFor,
  open,
  openAttempt,
  saveConceptOutcome,
  type AttemptRow,
  type Outcome,
  type Phase,
  type Recognition,
} from "./db.ts";
import { propagate } from "./fire.ts";
import { gradeAttempt, type Verdict } from "./grading.ts";
import { RATING_NAMES, explicitReview } from "./memory.ts";
import { ensureDataStructures, runTests } from "./runner.ts";
import { isPassed, pass, recordStruggle, updateMastery } from "./scheduler.ts";
import type { Grade } from "ts-fsrs";

function banner(comment: string, title: string): string {
  const rule = `${comment} ${"═".repeat(59)}`;
  return `${rule}\n${comment} ${title}\n${rule}`;
}

function stub(p: Problem, language: Language): string {
  const comment = language === "python" ? "#" : "//";
  const statement = p.statement
    .trim()
    .split("\n")
    .slice(1) // the title goes in the banner
    .join("\n")
    .trim()
    .split("\n")
    .flatMap((line) => wrap(line, 80))
    .map((line) => `${comment} ${line}`.trimEnd())
    .join("\n");
  const body = p.stubs[language];
  return [
    banner(comment, `PROBLEM · ${p.title} (${p.difficulty})`),
    statement,
    "",
    banner(comment, "YOUR SOLUTION · write it below"),
    "",
    body,
  ].join("\n");
}

/** Create the solution file if needed and open (or resume) an attempt. */
export function startProblem(slug: string, language: Language = DEFAULT_LANGUAGE) {
  const p = getProblem(slug);
  mkdirSync(WORKSPACE_DIR, { recursive: true });
  ensureDataStructures(WORKSPACE_DIR, language);
  const file = solutionPath(slug, language);
  const created = !existsSync(file);
  if (created) writeFileSync(file, stub(p, language));

  let current = openAttempt(slug, language);
  const resumed = Boolean(current);
  if (!current) {
    const phase: Phase = p.concepts.every(isPassed) ? "review" : "learning";
    const id = open()
      .query("INSERT INTO attempts (slug, concept_id, language, started_at, phase) VALUES (?, ?, ?, ?, ?)")
      .run(slug, p.concepts[0]!, language, new Date().toISOString(), phase).lastInsertRowid;
    current = attempt(Number(id));
  }
  return {
    attempt_id: current.id,
    resumed,
    file,
    file_created: created,
    phase: current.phase,
    title: p.title,
    difficulty: p.difficulty,
    concepts: p.concepts,
  };
}

/** Run the tests and, when an attempt is open, record the result on it. */
export function testSolution(slug: string, language: Language = DEFAULT_LANGUAGE, file = solutionPath(slug, language)) {
  const run = runTests(getProblem(slug), language, file);
  const current = openAttempt(slug, language);
  if (current) {
    open()
      .query("UPDATE attempts SET test_runs = test_runs + 1, last_passed = ?, last_total = ? WHERE id = ?")
      .run(run.passed, run.total, current.id);
  }
  return { run, attempt_id: current?.id ?? null };
}

/** Record a hint before it is given. Tie it to the concept it is about whenever possible. */
export function logHint(attemptId: number, level: number, conceptId: string | null = null): AttemptRow {
  const current = attempt(attemptId);
  if (current.finished_at) throw new Error(`Attempt ${attemptId} is already finished.`);
  if (conceptId && !getProblem(current.slug).concepts.includes(conceptId)) {
    throw new Error(`'${conceptId}' is not one of this problem's concepts: ${getProblem(current.slug).concepts.join(", ")}`);
  }
  addHint(attemptId, conceptId, level);
  return attempt(attemptId);
}

export interface FinishInput {
  attemptId: number;
  /** Set when the tests do not pass: the learner gave up, or stopped for outside reasons (no grade). */
  stopped?: "gave_up" | "paused";
  explanationScore: number;
  recognition?: Recognition;
  diagnosis?: { concept_id: string; verdict: Verdict; reason?: string }[];
  learnerSelfRating?: 1 | 2 | 3 | 4;
  notes?: string;
}

/**
 * Close an attempt. Learning-phase concepts pass on an independent solve or count a struggle;
 * review-phase concepts get per-concept FSRS grades, then credit flows through the
 * encompassing graph. See docs/learning-model.md.
 */
export function finishAttempt(input: FinishInput) {
  const current = attempt(input.attemptId);
  if (current.finished_at) throw new Error(`Attempt ${input.attemptId} is already finished.`);
  const p = getProblem(current.slug);
  const now = new Date();

  if (input.stopped === "paused") {
    open()
      .query("UPDATE attempts SET finished_at = ?, outcome = 'paused', notes = ? WHERE id = ?")
      .run(now.toISOString(), input.notes ?? null, current.id);
    return { outcome: "paused", note: "No grade recorded. The problem can be started again at any time." };
  }

  // Re-run so the grade reflects the file as it is now, not the last manual test run.
  const { run } = testSolution(current.slug, current.language as Language);
  const solved = !run.fatal && run.passed === run.total && input.stopped !== "gave_up";
  const minutes = (now.getTime() - new Date(current.started_at).getTime()) / 60_000;
  const diagnosis = new Map<string, Verdict>();
  for (const d of input.diagnosis ?? []) {
    if (!p.concepts.includes(d.concept_id)) throw new Error(`'${d.concept_id}' is not one of this problem's concepts.`);
    diagnosis.set(d.concept_id, d.verdict);
    saveConceptOutcome(current.id, d.concept_id, d.verdict, d.reason ?? null);
  }
  const recognition = input.recognition ?? "skipped";

  const grades = gradeAttempt({
    concepts: p.concepts,
    solved,
    gaveUp: input.stopped === "gave_up",
    hints: hintsFor(current.id),
    explanationScore: input.explanationScore,
    recognition,
    minutes,
    difficulty: p.difficulty,
    diagnosis,
    selfRating: input.learnerSelfRating as Grade | undefined,
  });

  const learning: { concept: string; result: string }[] = [];
  const reviewed = new Map<string, Grade>();
  const scheduled: { concept: string; grade: string; reasons: string[]; next_review: string }[] = [];
  for (const g of grades) {
    if (!isPassed(g.concept)) {
      // Learning phase: instruction, not assessment. FSRS starts at the first independent solve.
      if (g.independent) {
        pass(g.concept, current.id, now);
        learning.push({ concept: g.concept, result: "passed: solved independently, reviews start now" });
      } else {
        const count = recordStruggle(g.concept);
        learning.push({ concept: g.concept, result: `still learning (needed help ${count} time(s))` });
      }
      continue;
    }
    const card = explicitReview(g.concept, current.id, g.grade, now);
    updateMastery(g.concept, g.grade, recognition === "correct", now);
    reviewed.set(g.concept, g.grade);
    scheduled.push({ concept: g.concept, grade: RATING_NAMES[g.grade]!, reasons: g.reasons, next_review: card.due.toISOString() });
  }
  const implicit = propagate(current.id, reviewed, now);

  const helped = grades.some((g) => !g.independent);
  const outcome: Outcome = !solved ? "gave_up" : helped ? "solved_with_help" : "solved";
  const phase: Phase = reviewed.size ? "review" : "learning";
  const worst = Math.min(...grades.map((g) => g.grade));
  open()
    .query(
      `UPDATE attempts SET finished_at = ?, phase = ?, outcome = ?, recognition = ?, gave_up = ?,
         explanation_score = ?, rating = ?, notes = ? WHERE id = ?`,
    )
    .run(
      now.toISOString(),
      phase,
      outcome,
      recognition,
      outcome === "gave_up" ? 1 : 0,
      input.explanationScore,
      worst,
      input.notes ?? null,
      current.id,
    );

  return {
    outcome,
    tests: `${run.passed}/${run.total}`,
    minutes: Math.round(minutes),
    learning,
    reviews: scheduled,
    implicit_credit: implicit.credited,
    pulled_forward: implicit.pulled_forward,
  };
}
