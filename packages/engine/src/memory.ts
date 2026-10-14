// FSRS memory per concept: explicit reviews, partial (implicit) reviews and penalties.
// See docs/learning-model.md, "Fractional implicit repetition".

import {
  createEmptyCard,
  fsrs,
  generatorParameters,
  Rating,
  State,
} from "ts-fsrs";
import type { Card, Grade } from "ts-fsrs";

import { conceptRow, open, saveConceptRow } from "./db.ts";

// No same-day relearning steps: repeating an item within a day adds little to long-term memory.
const scheduler = fsrs(
  generatorParameters({
    enable_fuzz: true,
    enable_short_term: false,
    request_retention: 0.9,
  })
);

const DAY_MS = 86_400_000;

export const RATING_NAMES: Record<number, string> = {
  [Rating.Again]: "Again",
  [Rating.Hard]: "Hard",
  [Rating.Good]: "Good",
  [Rating.Easy]: "Easy",
};

export function parseCard(json: string): Card {
  const raw = JSON.parse(json);

  return {
    ...raw,
    due: new Date(raw.due),
    last_review: raw.last_review ? new Date(raw.last_review) : undefined,
  };
}

export function cardOf(conceptId: string): Card | null {
  const row = conceptRow(conceptId);

  return row.card ? parseCard(row.card) : null;
}

export function retrievability(card: Card, now = new Date()): number {
  if (card.state === State.New) {
    return 0;
  }
  return scheduler.get_retrievability(card, now, false);
}

function log(
  conceptId: string,
  attemptId: number,
  rating: number,
  card: Card,
  now: Date,
  credit: number | null,
  source: string | null
) {
  open()
    .query(
      `INSERT INTO reviews (concept_id, attempt_id, rating, reviewed_at, due, stability, difficulty, implicit_credit, source_concept)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`
    )
    .run(
      conceptId,
      attemptId,
      rating,
      now.toISOString(),
      card.due.toISOString(),
      card.stability,
      card.difficulty,
      credit,
      source
    );
}

function save(conceptId: string, card: Card): void {
  saveConceptRow({ ...conceptRow(conceptId), card: JSON.stringify(card) });
}

/** A full review of a concept with an FSRS grade. Creates the card if needed. */
export function explicitReview(
  conceptId: string,
  attemptId: number,
  rating: Grade,
  now = new Date()
): Card {
  const card: Card = cardOf(conceptId) ?? createEmptyCard<Card>(now);
  const next = scheduler.next(card, now, rating).card;
  save(conceptId, next);
  log(conceptId, attemptId, rating, next, now, null, null);

  return next;
}

/**
 * Partial credit from practising a concept that encompasses this one. Stability moves
 * a fraction `credit` of the way (in log space) toward what a full Good review would give.
 * FSRS gives smaller gains while recall is still high, so early credit is discounted.
 */
export function implicitReview(
  conceptId: string,
  attemptId: number,
  credit: number,
  source: string,
  now = new Date()
): Card | null {
  const card = cardOf(conceptId);

  if (!card || card.state === State.New) {
    return null;
  }
  const good = scheduler.next(card, now, Rating.Good).card;
  let next: Card;

  if (credit >= 0.9) {
    next = good;
  } else {
    const stability =
      card.stability * (good.stability / card.stability) ** credit;
    const days = scheduler.next_interval(stability, 0);
    next = {
      ...card,
      due: new Date(now.getTime() + days * DAY_MS),
      last_review: now,
      scheduled_days: days,
      stability,
    };
  }

  save(conceptId, next);
  log(conceptId, attemptId, Rating.Good, next, now, credit, source);

  return next;
}

/** A failure below pulls this concept's review forward by a fraction `weight`; stability is unchanged. */
export function pullForward(
  conceptId: string,
  weight: number,
  now = new Date()
): Card | null {
  const card = cardOf(conceptId);

  if (!card || card.due.getTime() <= now.getTime()) {
    return null;
  }
  const due = new Date(
    now.getTime() + (card.due.getTime() - now.getTime()) * (1 - weight)
  );
  const next = { ...card, due };
  save(conceptId, next);

  return next;
}

export function isDue(conceptId: string, now = new Date()): boolean {
  const card = cardOf(conceptId);

  return Boolean(
    card && card.state !== State.New && card.due.getTime() <= now.getTime()
  );
}
