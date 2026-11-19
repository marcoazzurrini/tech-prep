// Concept stages, lessons, and choosing the next lesson and the next review.
// See docs/learning-model.md, "Phases" and "Choosing the next task".

import { createEmptyCard, Rating } from "ts-fsrs";

import {
  concept,
  concepts,
  problemIndex,
  soloSlugs,
  topics,
} from "./content.ts";
import type { Course, ProblemInfo } from "./content.ts";
import { attemptsFor, conceptRow, saveConceptRow } from "./db.ts";
import type { AttemptRow, Stage } from "./db.ts";
import { hasLesson, isAuthored } from "./exercises.ts";
import { problemCredit } from "./fire.ts";
import { cardOf, explicitReview, isDue, retrievability } from "./memory.ts";
import type { Source } from "./memory.ts";

const DAY_MS = 86_400_000;

/** Unseen problems are preferred for reviews, so the learner recalls the concept, not one answer. */
const UNSEEN_BONUS = 1.25;

/** One exercise reviews at most this many concepts. */
export const MAX_TARGETS = 3;

/** A review counts as mastery evidence only this long after the concept was first passed. */
const MASTERY_GAP_DAYS = 3;

export type DisplayStage =
  | "locked"
  | "available"
  | "learning"
  | "passed"
  | "mastered";

const isPassedStage = (s: Stage) => s === "passed" || s === "mastered";

export const isPassed = (course: Course, id: string) =>
  isPassedStage(conceptRow(course, id).stage);

/** Locked and available are derived: a concept unlocks when all its prerequisites are passed. */
export const displayStage = (course: Course, id: string): DisplayStage => {
  const { stage } = conceptRow(course, id);

  if (stage !== "unseen") {
    return stage;
  }

  return concept(course, id).prereqs.every((p) => isPassed(course, p))
    ? "available"
    : "locked";
};

/** First independent success: the concept starts its FSRS schedule and its dependents may unlock. */
export const pass = (
  course: Course,
  conceptId: string,
  source: Source,
  now = new Date()
): void => {
  saveConceptRow(course, {
    ...conceptRow(course, conceptId),
    card: JSON.stringify(createEmptyCard(now)),
    fail_count: 0,
    passed_at: now.toISOString(),
    stage: "passed",
  });
  explicitReview(course, conceptId, source, Rating.Good, now);
};

/** Mark a concept as taught: its lesson's first step is done, and its solo problem comes next. */
export const completeLesson = (
  course: Course,
  conceptId: string,
  now = new Date()
): DisplayStage => {
  const row = conceptRow(course, conceptId);

  if (row.stage === "unseen") {
    saveConceptRow(course, {
      ...row,
      fail_count: 0,
      introduced_at: now.toISOString(),
      stage: "learning",
    });
  }

  return displayStage(course, conceptId);
};

export const recordStruggle = (course: Course, conceptId: string): number => {
  const row = conceptRow(course, conceptId);
  saveConceptRow(course, { ...row, fail_count: row.fail_count + 1 });

  return row.fail_count + 1;
};

/** Mastered after a later, unaided success on an unlabelled review; a lapse drops it back to passed. */
export const updateMastery = (
  course: Course,
  conceptId: string,
  passed: boolean,
  recognitionOk: boolean,
  now = new Date()
): void => {
  const row = conceptRow(course, conceptId);

  if (row.stage === "passed" && passed && recognitionOk && row.passed_at) {
    if (
      now.getTime() - new Date(row.passed_at).getTime() >=
      MASTERY_GAP_DAYS * DAY_MS
    ) {
      saveConceptRow(course, {
        ...row,
        mastered_at: now.toISOString(),
        stage: "mastered",
      });
    }
  } else if (row.stage === "mastered" && !passed) {
    saveConceptRow(course, { ...row, mastered_at: null, stage: "passed" });
  }
};

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

export const problemStatus = (course: Course, slug: string): ProblemStatus => {
  const attempts = attemptsFor(course, { slug });

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
};

/** After a struggle, a problem waits at least a day before it is served again. */
const waitingForRetry = (course: Course, slug: string, now: Date): boolean => {
  const last = attemptsFor(course, { slug }).at(-1);

  if (!last?.finished_at || last.outcome === "paused" || solvedAlone(last)) {
    return false;
  }

  return now.getTime() - new Date(last.finished_at).getTime() < DAY_MS;
};

const attemptedRecently = (
  course: Course,
  slug: string,
  now: Date
): boolean => {
  const last = attemptsFor(course, { slug }).at(-1);

  return Boolean(
    last && now.getTime() - new Date(last.started_at).getTime() < DAY_MS
  );
};

// ── Lessons ──────────────────────────────────────────────────────────────

/** Where a lesson stands, for the lessons column. */
export type LessonStatus = "locked" | "todo" | "started" | "partial" | "done";

/** A lesson opens when every prerequisite of its concept is passed. */
export const isOpen = (course: Course, id: string): boolean =>
  conceptRow(course, id).stage !== "unseen" ||
  concept(course, id).prereqs.every((p) => isPassed(course, p));

export const lessonStatus = (course: Course, id: string): LessonStatus => {
  const { stage } = conceptRow(course, id);

  if (isPassedStage(stage)) {
    return "done";
  }

  if (stage === "learning") {
    return soloSlugs(course, id).some(
      (s) => problemStatus(course, s) === "solved_with_help"
    )
      ? "partial"
      : "started";
  }

  return isOpen(course, id) ? "todo" : "locked";
};

/** Step 1 is the guided problem beside the lesson. Step 2 is the solo problem, alone. */
export const lessonStep = (course: Course, id: string): 1 | 2 =>
  conceptRow(course, id).stage === "unseen" ? 1 : 2;

/** When the solo problem may be tried again after a struggle, or null when it is free now. */
export const soloWait = (
  course: Course,
  id: string,
  now = new Date()
): string | null => {
  if (isPassed(course, id)) {
    return null;
  }

  // Any solo task of the lesson that waits holds the lesson back.
  const waits = soloSlugs(course, id).flatMap((solo) => {
    const last = attemptsFor(course, { slug: solo }).at(-1);

    return last?.finished_at && waitingForRetry(course, solo, now)
      ? [new Date(last.finished_at).getTime() + DAY_MS]
      : [];
  });

  return waits.length ? new Date(Math.max(...waits)).toISOString() : null;
};

/** The next lesson: the first concept, in course order, that is open, written and not waiting. */
export const nextLesson = (course: Course, now = new Date()): string | null =>
  concepts(course).find(
    (c) =>
      !isPassed(course, c.id) &&
      isOpen(course, c.id) &&
      hasLesson(course, c.id) &&
      soloWait(course, c.id, now) === null
  )?.id ?? null;

// ── Reviews ──────────────────────────────────────────────────────────────

interface DueConcept {
  id: string;
  weight: number;
}

const dueConcepts = (course: Course, now: Date): DueConcept[] =>
  concepts(course)
    .filter((c) => isPassed(course, c.id) && isDue(course, c.id, now))
    .map((c) => {
      const card = cardOf(course, c.id);

      if (!card) {
        throw new Error(`Concept '${c.id}' is due but has no card.`);
      }

      const overdueDays = (now.getTime() - card.due.getTime()) / DAY_MS;

      return {
        id: c.id,
        weight: 1 + overdueDays / Math.max(1, card.scheduled_days),
      };
    });

/** How many passed concepts are due for review. */
export const dueCount = (course: Course, now = new Date()): number =>
  dueConcepts(course, now).length;

/** Repetition compression: how much of the due set one problem would knock out. */
const coverage = (course: Course, p: ProblemInfo, due: DueConcept[]) => {
  let score = 0;
  const covers: string[] = [];

  for (const d of due) {
    const credit = Math.min(1, problemCredit(course, p.concepts, d.id));

    if (credit > 0) {
      score += credit * d.weight;
      covers.push(d.id);
    }
  }

  return { covers, score };
};

export interface Review {
  problem: ProblemInfo;
  /** The due concepts this problem reviews. */
  covers: string[];
}

/**
 * The problem that knocks out the most of the due set. Every concept of the problem must be
 * passed, so nothing in it is new. Problems the learner has not tried are preferred: a new
 * problem makes them recall the concept, not one answer.
 */
const bestReview = (
  course: Course,
  due: DueConcept[],
  now: Date,
  skip: Set<string>
): Review | null => {
  let best: (Review & { score: number }) | null = null;

  for (const p of problemIndex(course)) {
    if (
      skip.has(p.slug) ||
      !isAuthored(course, p.slug) ||
      !p.concepts.every((id) => isPassed(course, id)) ||
      attemptedRecently(course, p.slug, now)
    ) {
      continue;
    }

    const { score, covers } = coverage(course, p, due);

    const bonus =
      problemStatus(course, p.slug) === "unattempted" ? UNSEEN_BONUS : 1;

    if (score > 0 && (!best || score * bonus > best.score)) {
      best = { covers, problem: p, score: score * bonus };
    }
  }

  return best && { covers: best.covers, problem: best.problem };
};

/** The review to do now, or null when nothing due can be reviewed. */
export const nextReview = (course: Course, now = new Date()): Review | null =>
  bestReview(course, dueConcepts(course, now), now, new Set());

/** The reviews that would clear what is due today, best first. */
export const reviewPlan = (course: Course, now = new Date()): Review[] => {
  let due = dueConcepts(course, now);
  const plan: Review[] = [];
  const used = new Set<string>();

  while (due.length) {
    const next = bestReview(course, due, now, used);

    if (!next) {
      break;
    }

    plan.push(next);
    used.add(next.problem.slug);
    due = due.filter((d) => !next.covers.includes(d.id));
  }

  return plan;
};

/** When the next review falls due, among the concepts not due yet. */
export const nextDue = (course: Course, now = new Date()): string | null =>
  concepts(course)
    .filter((c) => isPassed(course, c.id) && !isDue(course, c.id, now))
    .map((c) => cardOf(course, c.id)?.due.toISOString())
    .filter((d): d is string => Boolean(d))
    .toSorted()
    .at(0) ?? null;

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

const round = (n: number): number => Math.round(n * 100) / 100;

export const conceptStatus = (
  course: Course,
  id: string,
  now = new Date()
): ConceptStatus => {
  const c = concept(course, id);
  const card = cardOf(course, id);
  const scheduled = isPassed(course, id) && card;

  return {
    due: scheduled ? card.due.toISOString() : null,
    id,
    lapses: card?.lapses ?? 0,
    name: c.name,
    reps: card?.reps ?? 0,
    retrievability: scheduled ? round(retrievability(card, now)) : null,
    stability_days: scheduled ? round(card.stability) : null,
    stage: displayStage(course, id),
    topic: c.topic,
  };
};

export const conceptStatuses = (
  course: Course,
  now = new Date()
): ConceptStatus[] =>
  concepts(course).map((c) => conceptStatus(course, c.id, now));

/** Roadmap progress: per topic, solved problems and concept stages. */
export const topicProgress = (course: Course) => {
  const statuses = conceptStatuses(course);

  return topics(course).map((t) => {
    const ps = problemIndex(course).filter((p) => p.topic === t.id);

    return {
      concepts: statuses
        .filter((s) => s.topic === t.id)
        // oxlint-disable-next-line sort-keys -- shown to the model as-is; keep the id first
        .map((s) => ({
          id: s.id,
          stage: s.stage,
          recall: s.retrievability,
          due: s.due,
        })),
      id: t.id,
      name: t.name,
      prereqs: t.prereqs,
      solved: ps.filter((p) => problemStatus(course, p.slug) === "solved")
        .length,
      total: ps.length,
    };
  });
};
