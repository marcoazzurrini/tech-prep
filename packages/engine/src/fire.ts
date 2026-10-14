// Fractional implicit repetition over the encompassing graph.
// Credit flows down to encompassed concepts; penalties flow up to encompassing ones.
// See docs/learning-model.md.

import { Rating } from "ts-fsrs";
import type { Grade } from "ts-fsrs";

import { concepts } from "./content.ts";
import { conceptRow, lastExplicitReview } from "./db.ts";
import { cardOf, implicitReview, pullForward } from "./memory.ts";

/** Credit below this is too small to matter and stops propagating. */
const MIN_CREDIT = 0.15;

let downCache: Map<string, { id: string; w: number }[]> | undefined;
let upCache: Map<string, { id: string; w: number }[]> | undefined;

function edges() {
  if (!downCache || !upCache) {
    downCache = new Map();
    upCache = new Map();

    for (const c of concepts()) {
      for (const e of c.encompasses ?? []) {
        if (e.w <= 0) {
          continue;
        }
        downCache.set(c.id, [...(downCache.get(c.id) ?? []), e]);
        upCache.set(e.id, [...(upCache.get(e.id) ?? []), { id: c.id, w: e.w }]);
      }
    }
  }

  return { down: downCache, up: upCache };
}

/** Best path product from `start` along `next` edges, for every reachable concept above MIN_CREDIT. */
function reach(
  start: string,
  next: Map<string, { id: string; w: number }[]>
): Map<string, number> {
  const best = new Map<string, number>();
  const stack: [string, number][] = [[start, 1]];

  while (stack.length) {
    const [id, credit] = stack.pop()!;

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
}

/** How much practising `conceptId` practises each concept it encompasses (directly or not). */
export function creditBelow(conceptId: string): Map<string, number> {
  return reach(conceptId, edges().down);
}

/** Concepts that encompass `conceptId`, with the path weight. */
export function encompassedBy(conceptId: string): Map<string, number> {
  return reach(conceptId, edges().up);
}

/** How much a problem tagged with `tags` practises `target`: 1 if tagged, else the best implicit credit. */
export function problemCredit(tags: string[], target: string): number {
  if (tags.includes(target)) {
    return 1;
  }
  return Math.max(0, ...tags.map((t) => creditBelow(t).get(target) ?? 0));
}

/** A concept the learner struggles with must be reviewed explicitly (Math Academy's "speed < 1" rule). */
export function isWeak(conceptId: string): boolean {
  const card = cardOf(conceptId);

  if (card && card.lapses >= 2) {
    return true;
  }
  return lastExplicitReview(conceptId)?.rating === Rating.Again;
}

const isPassed = (id: string) =>
  ["passed", "mastered"].includes(conceptRow(id).stage);

export interface Propagation {
  credited: { concept: string; credit: number; next_review: string }[];
  pulled_forward: { concept: string; weight: number; next_review: string }[];
}

/**
 * Apply FIRe after an attempt's explicit reviews. `grades` holds the explicit grade of each
 * reviewed concept; concepts reviewed explicitly in this attempt get no implicit credit.
 */
export function propagate(
  attemptId: number,
  grades: Map<string, Grade>,
  now = new Date()
): Propagation {
  const result: Propagation = { credited: [], pulled_forward: [] };

  // Credit down from passing grades: Hard counts half.
  const incoming = new Map<string, { credit: number; source: string }>();

  for (const [source, grade] of grades) {
    if (grade === Rating.Again) {
      continue;
    }
    const scale = grade === Rating.Hard ? 0.5 : 1;

    for (const [target, credit] of creditBelow(source)) {
      const value = credit * scale;

      if (value >= MIN_CREDIT && value > (incoming.get(target)?.credit ?? 0)) {
        incoming.set(target, { credit: value, source });
      }
    }
  }

  for (const [target, { credit, source }] of incoming) {
    if (grades.has(target) || !isPassed(target) || isWeak(target)) {
      continue;
    }
    const card = implicitReview(target, attemptId, credit, source, now);

    if (card) {
      result.credited.push({
        concept: target,
        credit: round(credit),
        next_review: card.due.toISOString(),
      });
    }
  }

  // Penalties up from failures.
  const pulled = new Map<string, number>();

  for (const [source, grade] of grades) {
    if (grade !== Rating.Again) {
      continue;
    }
    for (const [above, weight] of encompassedBy(source)) {
      pulled.set(above, Math.max(pulled.get(above) ?? 0, weight));
    }
  }

  for (const [above, weight] of pulled) {
    if (grades.has(above) || !isPassed(above)) {
      continue;
    }
    const card = pullForward(above, weight, now);

    if (card) {
      result.pulled_forward.push({
        concept: above,
        weight: round(weight),
        next_review: card.due.toISOString(),
      });
    }
  }

  return result;
}

function round(n: number): number {
  return Math.round(n * 100) / 100;
}
