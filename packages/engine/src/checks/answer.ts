// The answer check: an open question, answered in the learner's own words. The engine
// cannot read prose, so the tutor grades it against a rubric written up front.

import { z } from "zod";

import type { Built, Checker } from "./types.ts";

/** The key points a passing answer makes about one concept. */
const RubricItem = z.object({
  concept_id: z.string(),
  points: z.array(z.string()),
});

// oxlint-disable-next-line sort-keys -- stored and shown to the tutor in this order
export const answerCheck = z.object({
  type: z.literal("answer"),
  rubric: z.array(RubricItem),
  /** A complete answer, shown to the learner after grading. */
  model_answer: z.string(),
});

export type AnswerCheck = z.infer<typeof answerCheck>;

const build = (check: AnswerCheck, concepts: string[]): Built<AnswerCheck> => {
  const covered = new Set(check.rubric.map((r) => r.concept_id));

  if (
    covered.size !== concepts.length ||
    !concepts.every((id) => covered.has(id)) ||
    check.rubric.some((r) => r.points.length === 0)
  ) {
    return {
      check,
      errors: [
        "An answer exercise needs `rubric`: the key points for each concept in concept_ids, and no others.",
      ],
    };
  }

  if (!check.model_answer.trim()) {
    return { check, errors: ["An answer exercise needs `model_answer`."] };
  }

  return {
    check: { ...check, model_answer: check.model_answer.trim() },
    errors: [],
  };
};

export const answerChecker: Checker<AnswerCheck> = {
  build: (check, { concepts }) => build(check, concepts),
  grader: "tutor",
  inCourse: false,
  key: (check) => check.model_answer,
  language: () => "text",
  minutes: { easy: 3, hard: 8, medium: 5 },
  ready: () => true,
  retakeFromStart: true,
  run: () => {
    throw new Error(
      "An open answer is graded by the tutor, not by the engine."
    );
  },
  start: () => "",
  tutor: (check) => ({
    answer_is: "an answer in their own words. Grade it against the rubric.",
    model_answer: check.model_answer,
    rubric: check.rubric,
  }),
  view: () => ({ type: "answer" }),
};
