// What a graded exercise does to each concept: start it, review it, or count a struggle.
// See docs/learning-model.md, "Phases".

import { Rating } from "ts-fsrs";
import type { Grade } from "ts-fsrs";

import { concept, withPrereqs } from "./content.ts";
import { conceptRow, lastExplicitReview } from "./db.ts";
import type { Result } from "./db.ts";
import { propagate } from "./fire.ts";
import type { ConceptResult } from "./grading.ts";
import { explicitReview } from "./memory.ts";
import type { Source } from "./memory.ts";
import {
  completeLesson,
  isPassed,
  pass,
  recordStruggle,
  updateMastery,
} from "./scheduler.ts";

/** A concept is reviewed at most once in this window, so a same-day retry is practice only. */
const REVIEW_GAP_MS = 12 * 3_600_000;

export interface Applied {
  concept: string;
  name: string;
  result: Result;
  reason: string;
  /** What changed for this concept, in words for the tutor to pass on. */
  effect: string;
  next_review?: string;
}

interface ApplyInput {
  source: Source;
  results: ConceptResult[];
  /** A curriculum problem, solved from a blank file: only this passes a concept that has problems. */
  fromProblem: boolean;
  /** The learner named the right approach before starting; needed for mastery. */
  recognitionOk: boolean;
  now: Date;
}

const reviewedRecently = (conceptId: string, now: Date): boolean => {
  const last = lastExplicitReview(conceptId);

  return Boolean(
    last && now.getTime() - new Date(last.reviewed_at).getTime() < REVIEW_GAP_MS
  );
};

/** A concept not passed yet: practice here is teaching, so it never touches the schedule. */
const applyLearning = (r: ConceptResult, input: ApplyInput): string => {
  if (r.result === "fail") {
    if (!input.fromProblem) {
      return "not there yet: teach it, then retry with a new exercise";
    }

    return `still learning (needed help ${recordStruggle(r.concept)} time(s))`;
  }

  if (input.fromProblem) {
    pass(r.concept, input.source, input.now);

    return "passed: solved without help, reviews start now";
  }

  // Knowing a concept implies its prerequisites, so a right answer skips their lessons too.
  for (const id of withPrereqs([r.concept])) {
    if (conceptRow(id).stage === "unseen" || id === r.concept) {
      completeLesson(id, input.now);
    }
  }

  return isPassed(r.concept)
    ? "passed: reviews start now"
    : "known: no lesson needed, a problem comes next";
};

/** Apply pass or fail per concept, then let credit and penalties flow through the encompassing graph. */
export const applyResults = (input: ApplyInput) => {
  const reviewed = new Map<string, Grade>();

  const concepts = input.results.map((r): Applied => {
    const base = {
      concept: r.concept,
      name: concept(r.concept).name,
      reason: r.reason,
      result: r.result,
    };

    if (!isPassed(r.concept)) {
      return { ...base, effect: applyLearning(r, input) };
    }

    if (reviewedRecently(r.concept, input.now)) {
      return {
        ...base,
        effect: "already reviewed today: this one was practice only",
      };
    }

    const rating = r.result === "pass" ? Rating.Good : Rating.Again;
    const card = explicitReview(r.concept, input.source, rating, input.now);
    updateMastery(
      r.concept,
      r.result === "pass",
      input.recognitionOk,
      input.now
    );
    reviewed.set(r.concept, rating);

    return {
      ...base,
      effect:
        r.result === "pass" ? "reviewed" : "forgotten: it comes back soon",
      next_review: card.due.toISOString(),
    };
  });

  const implicit = propagate(input.source, reviewed, input.now);

  return {
    concepts,
    implicit_credit: implicit.credited,
    pulled_forward: implicit.pulled_forward,
    reviewed: reviewed.size > 0,
  };
};
