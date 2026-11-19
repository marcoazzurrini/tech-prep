// Fractional implicit repetition over the encompassing graph.
// Credit flows down to encompassed concepts; penalties flow up to encompassing ones.
// See docs/learning-model.md.

import { Rating } from "ts-fsrs";
import type { Grade } from "ts-fsrs";

import { concepts } from "./content.ts";
import type { Course } from "./content.ts";
import { conceptRow, lastExplicitReview } from "./db.ts";
import { cardOf, implicitReview, pullForward } from "./memory.ts";
import type { Source } from "./memory.ts";

/** Credit below this is too small to matter and stops propagating. */
const MIN_CREDIT = 0.15;

type Edges = Map<string, { id: string; w: number }[]>;

/** Each course's encompassing edges, built once: from a concept down, and from a concept up. */
const edgeCache = new WeakMap<Course, { down: Edges; up: Edges }>();

const edges = (course: Course) => {
  const cached = edgeCache.get(course);

  if (cached) {
    return cached;
  }

  const down: Edges = new Map();
  const up: Edges = new Map();

  for (const c of concepts(course)) {
    for (const e of c.encompasses ?? []) {
      if (e.w <= 0) {
        continue;
      }

      down.set(c.id, [...(down.get(c.id) ?? []), e]);
      up.set(e.id, [...(up.get(e.id) ?? []), { id: c.id, w: e.w }]);
    }
  }

  edgeCache.set(course, { down, up });

  return { down, up };
};

/** Best path product from `start` along `next` edges, for every reachable concept above MIN_CREDIT. */
const reach = (
  start: string,
  next: Map<string, { id: string; w: number }[]>
): Map<string, number> => {
  const best = new Map<string, number>();
  const stack: [string, number][] = [[start, 1]];

  for (let top = stack.pop(); top; top = stack.pop()) {
    const [id, credit] = top;

    for (const e of next.get(id) ?? []) {
      const value = credit * e.w;

      if (value < MIN_CREDIT || value <= (best.get(e.id) ?? 0)) {
        continue;
      }

      best.set(e.id, value);
      stack.push([e.id, value]);
    }
  }

  return best;
};

/** How much practising `conceptId` practises each concept it encompasses (directly or not). */
export const creditBelow = (
  course: Course,
  conceptId: string
): Map<string, number> => reach(conceptId, edges(course).down);

/** Concepts that encompass `conceptId`, with the path weight. */
export const encompassedBy = (
  course: Course,
  conceptId: string
): Map<string, number> => reach(conceptId, edges(course).up);

/** How much a problem tagged with `tags` practises `target`: 1 if tagged, else the best implicit credit. */
export const problemCredit = (
  course: Course,
  tags: string[],
  target: string
): number => {
  if (tags.includes(target)) {
    return 1;
  }

  return Math.max(
    0,
    ...tags.map((t) => creditBelow(course, t).get(target) ?? 0)
  );
};

/** A concept the learner struggles with must be reviewed explicitly (Math Academy's "speed < 1" rule). */
export const isWeak = (course: Course, conceptId: string): boolean => {
  const card = cardOf(course, conceptId);

  if (card && card.lapses >= 2) {
    return true;
  }

  return lastExplicitReview(course, conceptId)?.rating === Rating.Again;
};

const isPassed = (course: Course, id: string) =>
  ["passed", "mastered"].includes(conceptRow(course, id).stage);

const round = (n: number): number => Math.round(n * 100) / 100;

export interface Propagation {
  credited: { concept: string; credit: number; next_review: string }[];
  pulled_forward: { concept: string; weight: number; next_review: string }[];
}

/** Credit down from passes. */
const creditDown = (
  course: Course,
  from: Source,
  grades: Map<string, Grade>,
  now: Date
): Propagation["credited"] => {
  const credited: Propagation["credited"] = [];
  const incoming = new Map<string, { credit: number; source: string }>();

  for (const [source, grade] of grades) {
    if (grade === Rating.Again) {
      continue;
    }

    for (const [target, credit] of creditBelow(course, source)) {
      if (credit > (incoming.get(target)?.credit ?? 0)) {
        incoming.set(target, { credit, source });
      }
    }
  }

  for (const [target, { credit, source }] of incoming) {
    if (
      grades.has(target) ||
      !isPassed(course, target) ||
      isWeak(course, target)
    ) {
      continue;
    }

    const card = implicitReview(course, target, from, credit, source, now);

    if (card) {
      credited.push({
        concept: target,
        credit: round(credit),
        next_review: card.due.toISOString(),
      });
    }
  }

  return credited;
};

/** Penalties up from failures. */
const penaltiesUp = (
  course: Course,
  grades: Map<string, Grade>,
  now: Date
): Propagation["pulled_forward"] => {
  const pulledForward: Propagation["pulled_forward"] = [];
  const pulled = new Map<string, number>();

  for (const [source, grade] of grades) {
    if (grade !== Rating.Again) {
      continue;
    }

    for (const [above, weight] of encompassedBy(course, source)) {
      pulled.set(above, Math.max(pulled.get(above) ?? 0, weight));
    }
  }

  for (const [above, weight] of pulled) {
    if (grades.has(above) || !isPassed(course, above)) {
      continue;
    }

    const card = pullForward(course, above, weight, now);

    if (card) {
      // oxlint-disable-next-line sort-keys -- shown to the model as-is; mirrors `credited` (concept, amount, next_review)
      pulledForward.push({
        concept: above,
        weight: round(weight),
        next_review: card.due.toISOString(),
      });
    }
  }

  return pulledForward;
};

/**
 * Apply FIRe after explicit reviews. `grades` holds the explicit grade of each reviewed
 * concept; concepts reviewed explicitly at the same time get no implicit credit.
 */
export const propagate = (
  course: Course,
  from: Source,
  grades: Map<string, Grade>,
  now = new Date()
): Propagation => {
  const credited = creditDown(course, from, grades, now);

  return { credited, pulled_forward: penaltiesUp(course, grades, now) };
};
