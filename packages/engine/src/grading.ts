// Pass or fail per concept. See docs/learning-model.md, "Grading".

import type { Result } from "./db.ts";

/** The strongest hint that still counts as working alone: a guiding question. */
export const INDEPENDENT_HINT_LEVEL = 1;

export interface Evidence {
  /** The concepts the exercise targets. */
  targets: string[];
  /** The answer was right: tests passed, or the output or order matched. */
  correct: boolean;
  /** The strongest hint the learner got on this exercise, 0 for none. */
  maxHintLevel: number;
  /** Open answers only: the tutor's pass or fail for each target. */
  verdicts?: Map<string, { result: Result; reason?: string }>;
}

export interface ConceptResult {
  concept: string;
  result: Result;
  reason: string;
}

/**
 * Every target shares one result, because a test run or a matched output cannot say which
 * concept broke. Open answers are the exception: the tutor reads the answer and grades each
 * concept on its own.
 */
export const grade = (e: Evidence): ConceptResult[] => {
  const helped = e.maxHintLevel > INDEPENDENT_HINT_LEVEL;

  return e.targets.map((concept) => {
    if (helped) {
      return {
        concept,
        reason: `needed a level ${e.maxHintLevel} hint`,
        result: "fail",
      };
    }

    const verdict = e.verdicts?.get(concept);

    if (verdict) {
      return {
        concept,
        reason:
          verdict.reason ??
          (verdict.result === "pass" ? "covered in the answer" : "missed"),
        result: verdict.result,
      };
    }

    return e.correct
      ? { concept, reason: "right, without help", result: "pass" }
      : { concept, reason: "the answer was not right", result: "fail" };
  });
};
