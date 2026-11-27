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

import type { Course } from "./content.ts";
import { conceptRow, insertReview, saveConceptRow } from "./db.ts";

// No same-day relearning steps: repeating an item within a day adds little to long-term memory.
const scheduler = fsrs(
  generatorParameters({
    enable_fuzz: true,
    enable_short_term: false,
    request_retention: 0.9,
  })
);

const DAY_MS = 86_400_000;

/** The start of a date's day, on the learner's clock. */
export const startOfDay = (date: Date): Date =>
  new Date(date.getFullYear(), date.getMonth(), date.getDate());

export const parseCard = (json: string): Card => {
  const raw = JSON.parse(json);

  return {
    ...raw,
    due: new Date(raw.due),
    last_review: raw.last_review ? new Date(raw.last_review) : undefined,
  };
};

export const cardOf = (course: Course, conceptId: string): Card | null => {
  const row = conceptRow(course, conceptId);

  return row.card ? parseCard(row.card) : null;
};

/** True while a concept has been learned but not recalled yet: its card has no rating. */
export const awaitsFirstRecall = (card: Card): boolean =>
  card.state === State.New;

export const retrievability = (card: Card, now = new Date()): number => {
  if (awaitsFirstRecall(card)) {
    return 0;
  }

  return scheduler.get_retrievability(card, now, false);
};

/** What a review came from: a problem attempt or an extra exercise from the tutor. */
export interface Source {
  attemptId?: number;
  extraId?: number;
}

const log = (
  course: Course,
  conceptId: string,
  source: Source,
  rating: number,
  card: Card,
  now: Date,
  credit: number | null,
  sourceConcept: string | null
) => {
  insertReview(
    course,
    {
      attempt_id: source.attemptId ?? 0,
      concept_id: conceptId,
      difficulty: card.difficulty,
      due: card.due.toISOString(),
      extra_id: source.extraId ?? null,
      implicit_credit: credit,
      rating,
      source_concept: sourceConcept,
      stability: card.stability,
    },
    now
  );
};

const save = (course: Course, conceptId: string, card: Card): void => {
  saveConceptRow(course, {
    ...conceptRow(course, conceptId),
    card: JSON.stringify(card),
  });
};

/**
 * A concept that was just learned gets a card with no rating, due the next day. The tasks at
 * the end of a lesson are solved while the idea is still in mind, so they are not a recall.
 */
export const scheduleFirstRecall = (
  course: Course,
  conceptId: string,
  now = new Date()
): Card => {
  const due = startOfDay(now);
  due.setDate(due.getDate() + 1);

  const card: Card = { ...createEmptyCard<Card>(now), due };
  save(course, conceptId, card);

  return card;
};

/** A full review of a concept with an FSRS grade. Creates the card if needed. */
export const explicitReview = (
  course: Course,
  conceptId: string,
  source: Source,
  rating: Grade,
  now = new Date()
): Card => {
  const card: Card = cardOf(course, conceptId) ?? createEmptyCard<Card>(now);
  const next = scheduler.next(card, now, rating).card;
  save(course, conceptId, next);
  log(course, conceptId, source, rating, next, now, null, null);

  return next;
};

/**
 * Partial credit from practising a concept that encompasses this one. Stability moves
 * a fraction `credit` of the way (in log space) toward what a full Good review would give.
 * FSRS gives smaller gains while recall is still high, so early credit is discounted.
 */
export const implicitReview = (
  course: Course,
  conceptId: string,
  source: Source,
  credit: number,
  sourceConcept: string,
  now = new Date()
): Card | null => {
  const card = cardOf(course, conceptId);

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

  save(course, conceptId, next);
  log(course, conceptId, source, Rating.Good, next, now, credit, sourceConcept);

  return next;
};

/** A failure below pulls this concept's review forward by a fraction `weight`; stability is unchanged. */
export const pullForward = (
  course: Course,
  conceptId: string,
  weight: number,
  now = new Date()
): Card | null => {
  const card = cardOf(course, conceptId);

  // A first recall keeps its day: there is no memory to have weakened yet.
  if (!card || awaitsFirstRecall(card) || card.due.getTime() <= now.getTime()) {
    return null;
  }

  const due = new Date(
    now.getTime() + (card.due.getTime() - now.getTime()) * (1 - weight)
  );

  const next = { ...card, due };
  save(course, conceptId, next);

  return next;
};

/**
 * A concept is due for the whole of its due day. Counting from the hour would make a concept
 * learned late in the evening impossible to review before that hour.
 */
export const isDue = (
  course: Course,
  conceptId: string,
  now = new Date()
): boolean => {
  const card = cardOf(course, conceptId);

  return Boolean(card && startOfDay(card.due).getTime() <= now.getTime());
};
