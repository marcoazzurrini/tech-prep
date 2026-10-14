// Concept stages, unlocking, and choosing the next task.
// See docs/learning-model.md, "Phases" and "Choosing the next task".

import { createEmptyCard, Rating } from "ts-fsrs";

import {
  concept,
  concepts,
  isAuthored,
  problemIndex,
  problemInfo,
  problemsUsing,
  topics,
  withPrereqs,
} from "./content.ts";
import type { ProblemInfo } from "./content.ts";
import { attemptsFor, conceptRow, saveConceptRow } from "./db.ts";
import type { AttemptRow, Stage } from "./db.ts";
import { problemCredit } from "./fire.ts";
import { cardOf, explicitReview, isDue, retrievability } from "./memory.ts";

const DAY_MS = 86_400_000;

/** After this many reviews in a row, new material is served even if reviews are still due. */
const REVIEWS_BEFORE_NEW = 3;

/** Learning-phase struggles before the concept is re-taught. */
const RETEACH_AFTER = 2;

/** Unseen problems are preferred for reviews, so the learner recalls the concept, not one answer. */
const UNSEEN_BONUS = 1.25;

/** A review counts as mastery evidence only this long after the concept was first passed. */
const MASTERY_GAP_DAYS = 3;

export type DisplayStage =
  | "locked"
  | "available"
  | "learning"
  | "passed"
  | "mastered";

const isPassedStage = (s: Stage) => s === "passed" || s === "mastered";
export const isPassed = (id: string) => isPassedStage(conceptRow(id).stage);

/** Locked and available are derived: a concept unlocks when all its prerequisites are passed. */
export function displayStage(id: string): DisplayStage {
  const { stage } = conceptRow(id);

  if (stage !== "unseen") {
    return stage;
  }
  return concept(id).prereqs.every(isPassed) ? "available" : "locked";
}

/** Concepts that no problem practises directly are passed by their lesson alone. */
const hasOwnProblems = (id: string) => problemsUsing(id).length > 0;

/** Mark concepts as taught. Re-teaching resets the struggle count. */
export function completeLesson(
  conceptId: string,
  now = new Date()
): DisplayStage {
  const row = conceptRow(conceptId);

  if (row.stage === "unseen") {
    saveConceptRow({
      ...row,
      fail_count: 0,
      introduced_at: now.toISOString(),
      stage: "learning",
    });
  } else if (row.stage === "learning") {
    saveConceptRow({ ...row, fail_count: 0 });
  }

  if (
    !hasOwnProblems(conceptId) &&
    conceptRow(conceptId).stage === "learning"
  ) {
    pass(conceptId, 0, now);
  }
  return displayStage(conceptId);
}

/** First independent success: the concept starts its FSRS schedule and its dependents may unlock. */
export function pass(
  conceptId: string,
  attemptId: number,
  now = new Date()
): void {
  saveConceptRow({
    ...conceptRow(conceptId),
    card: JSON.stringify(createEmptyCard(now)),
    fail_count: 0,
    passed_at: now.toISOString(),
    stage: "passed",
  });
  explicitReview(conceptId, attemptId, Rating.Good, now);
}

export function recordStruggle(conceptId: string): number {
  const row = conceptRow(conceptId);
  saveConceptRow({ ...row, fail_count: row.fail_count + 1 });

  return row.fail_count + 1;
}

/** Mastered after a later, unaided success on an unlabelled review; a lapse drops it back to passed. */
export function updateMastery(
  conceptId: string,
  grade: number,
  recognitionOk: boolean,
  now = new Date()
): void {
  const row = conceptRow(conceptId);

  if (
    row.stage === "passed" &&
    grade >= Rating.Good &&
    recognitionOk &&
    row.passed_at
  ) {
    if (
      now.getTime() - new Date(row.passed_at).getTime() >=
      MASTERY_GAP_DAYS * DAY_MS
    ) {
      saveConceptRow({
        ...row,
        mastered_at: now.toISOString(),
        stage: "mastered",
      });
    }
  } else if (row.stage === "mastered" && grade === Rating.Again) {
    saveConceptRow({ ...row, mastered_at: null, stage: "passed" });
  }
}

// ── Problem status ───────────────────────────────────────────────────────

export type ProblemStatus =
  | "unattempted"
  | "in_progress"
  | "attempted"
  | "solved_with_help"
  | "solved";

/** Legacy attempts (before outcomes existed) count as solved when graded Hard or better. */
const solvedAlone = (a: AttemptRow) =>
  a.outcome === "solved" ||
  (a.outcome === null && (a.rating ?? 0) >= Rating.Hard);

export function problemStatus(slug: string): ProblemStatus {
  const attempts = attemptsFor({ slug });

  if (attempts.some(solvedAlone)) {
    return "solved";
  }
  if (attempts.some((a) => !a.finished_at)) {
    return "in_progress";
  }
  if (attempts.some((a) => a.outcome === "solved_with_help")) {
    return "solved_with_help";
  }
  return attempts.some((a) => a.outcome !== "paused")
    ? "attempted"
    : "unattempted";
}

/** After a struggle, a problem waits at least a day before it is served again. */
function waitingForRetry(slug: string, now: Date): boolean {
  const last = attemptsFor({ slug }).at(-1);

  if (!last?.finished_at || last.outcome === "paused" || solvedAlone(last)) {
    return false;
  }
  return now.getTime() - new Date(last.finished_at).getTime() < DAY_MS;
}

function attemptedRecently(slug: string, now: Date): boolean {
  const last = attemptsFor({ slug }).at(-1);

  return Boolean(
    last && now.getTime() - new Date(last.started_at).getTime() < DAY_MS
  );
}

/** Concepts (with prerequisites) the learner has not been taught yet, prerequisites first. */
export function newConceptsFor(slug: string): string[] {
  return withPrereqs(problemInfo(slug).concepts).filter(
    (id) => conceptRow(id).stage === "unseen"
  );
}

/**
 * A problem is open when every prerequisite of its concepts is passed, or is an untaught
 * concept with no problems of its own (its lesson passes it). A prerequisite that is still
 * being learned blocks the problem until the learner passes it on its own problems.
 */
export function isUnlocked(p: ProblemInfo): boolean {
  return withPrereqs(p.concepts)
    .filter((id) => !p.concepts.includes(id))
    .every(
      (id) =>
        isPassed(id) ||
        (conceptRow(id).stage === "unseen" && !hasOwnProblems(id))
    );
}

// ── Choosing the next task ───────────────────────────────────────────────

export type NextAction =
  | { action: "resume"; problem: string; attempt_id: number; why: string }
  | {
      action: "reteach";
      concept: string;
      prerequisites: { id: string; stage: DisplayStage }[];
      why: string;
    }
  | { action: "review"; problem: string; covers: string[]; why: string }
  | { action: "learn"; problem: string; new_concepts: string[]; why: string }
  | { action: "practice"; problem: string; why: string }
  | { action: "done_for_now"; next_due: string | null; why: string };

function dueConcepts(now: Date): { id: string; weight: number }[] {
  return concepts()
    .filter((c) => isPassed(c.id) && isDue(c.id, now))
    .map((c) => {
      const card = cardOf(c.id)!;
      const overdueDays = (now.getTime() - card.due.getTime()) / DAY_MS;

      return {
        id: c.id,
        weight: 1 + overdueDays / Math.max(1, card.scheduled_days),
      };
    });
}

/** Repetition compression: how much of the due set one problem would knock out. */
function coverage(
  p: ProblemInfo,
  due: { id: string; weight: number }[]
): { score: number; covers: string[] } {
  let score = 0;
  const covers: string[] = [];

  for (const d of due) {
    const credit = Math.min(1, problemCredit(p.concepts, d.id));

    if (credit > 0) {
      score += credit * d.weight;
      covers.push(d.id);
    }
  }

  return { covers, score };
}

function nextNewProblem(now: Date): ProblemInfo | null {
  return (
    problemIndex().find(
      (p) =>
        isAuthored(p.slug) &&
        problemStatus(p.slug) !== "solved" &&
        !waitingForRetry(p.slug, now) &&
        isUnlocked(p)
    ) ?? null
  );
}

function newAction(p: ProblemInfo, why: string): NextAction {
  const fresh = newConceptsFor(p.slug);

  return fresh.length
    ? { action: "learn", new_concepts: fresh, problem: p.slug, why }
    : { action: "practice", problem: p.slug, why };
}

function reviewsInARow(): number {
  let n = 0;

  for (const a of [...attemptsFor({})].reverse()) {
    if (!a.finished_at || a.outcome === "paused") {
      continue;
    }
    if (a.phase !== "review") {
      break;
    }
    n++;
  }

  return n;
}

export function nextUp(now = new Date()): NextAction {
  const open = attemptsFor({})
    .filter((a) => !a.finished_at)
    .at(-1);

  if (open) {
    return {
      action: "resume",
      problem: open.slug,
      attempt_id: open.id,
      why: "An attempt is still open.",
    };
  }

  const struggling = concepts().find((c) => {
    const row = conceptRow(c.id);

    return row.stage === "learning" && row.fail_count >= RETEACH_AFTER;
  });

  if (struggling) {
    return {
      action: "reteach",
      concept: struggling.id,
      prerequisites: struggling.prereqs.map((id) => ({
        id,
        stage: displayStage(id),
      })),
      why: `'${struggling.name}' needed help ${conceptRow(struggling.id).fail_count} times; teach it again from a different angle.`,
    };
  }

  const fresh = nextNewProblem(now);
  const due = dueConcepts(now);

  if (due.length && !(fresh && reviewsInARow() >= REVIEWS_BEFORE_NEW)) {
    let best: { p: ProblemInfo; score: number; covers: string[] } | null = null;

    for (const p of problemIndex()) {
      if (
        !isAuthored(p.slug) ||
        !p.concepts.every(isPassed) ||
        attemptedRecently(p.slug, now)
      ) {
        continue;
      }
      const { score, covers } = coverage(p, due);
      const bonus = problemStatus(p.slug) === "unattempted" ? UNSEEN_BONUS : 1;

      if (score > 0 && (!best || score * bonus > best.score)) {
        best = { p, score: score * bonus, covers };
      }
    }

    // New material that knocks out the same reviews is better than a pure review.
    if (fresh) {
      const { score, covers } = coverage(fresh, due);

      if (score > 0 && (!best || score >= best.score)) {
        return newAction(
          fresh,
          `Next on the roadmap, and it also reviews ${covers.length} due concept(s).`
        );
      }
    }

    if (best) {
      return {
        action: "review",
        covers: best.covers,
        problem: best.p.slug,
        why: `${due.length} concept(s) due; this problem reviews ${best.covers.length} of them.`,
      };
    }
  }

  if (fresh) {
    const paced = due.length && reviewsInARow() >= REVIEWS_BEFORE_NEW;

    return newAction(
      fresh,
      paced
        ? "New material after several reviews in a row."
        : `Next on the roadmap: '${fresh.title}'.`
    );
  }

  const nextDue = concepts()
    .filter((c) => isPassed(c.id))
    .map((c) => cardOf(c.id)?.due.toISOString())
    .filter((d): d is string => Boolean(d))
    .sort()[0];

  return {
    action: "done_for_now",
    next_due: nextDue ?? null,
    why: "Nothing is due and nothing new is open right now.",
  };
}

// ── Reporting ────────────────────────────────────────────────────────────

export interface ConceptStatus {
  id: string;
  name: string;
  topic: string;
  stage: DisplayStage;
  due: string | null;
  retrievability: number | null;
  stability_days: number | null;
  reps: number;
  lapses: number;
}

export function conceptStatus(id: string, now = new Date()): ConceptStatus {
  const c = concept(id);
  const card = cardOf(id);
  const scheduled = isPassed(id) && card;

  return {
    due: scheduled ? card.due.toISOString() : null,
    id,
    lapses: card?.lapses ?? 0,
    name: c.name,
    reps: card?.reps ?? 0,
    retrievability: scheduled ? round(retrievability(card, now)) : null,
    stability_days: scheduled ? round(card.stability) : null,
    stage: displayStage(id),
    topic: c.topic,
  };
}

export function conceptStatuses(now = new Date()): ConceptStatus[] {
  return concepts().map((c) => conceptStatus(c.id, now));
}

/** Roadmap progress: per topic, solved problems and concept stages. */
export function topicProgress() {
  const statuses = conceptStatuses();

  return topics().map((t) => {
    const ps = problemIndex().filter((p) => p.topic === t.id);

    return {
      concepts: statuses
        .filter((s) => s.topic === t.id)
        .map((s) => ({
          id: s.id,
          stage: s.stage,
          recall: s.retrievability,
          due: s.due,
        })),
      id: t.id,
      name: t.name,
      prereqs: t.prereqs,
      solved: ps.filter((p) => problemStatus(p.slug) === "solved").length,
      total: ps.length,
    };
  });
}

function round(n: number): number {
  return Math.round(n * 100) / 100;
}
