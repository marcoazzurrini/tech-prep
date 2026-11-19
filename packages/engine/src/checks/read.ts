// The read check: solved code the learner reads while the tutor explains it. There is
// nothing to answer, so it checks nothing: it only makes sure the code runs.

import { z } from "zod";

import { execute } from "../program.ts";
import type { Built, Checker } from "./types.ts";

// oxlint-disable-next-line sort-keys -- stored and shown to the tutor in this order
export const readCheck = z.object({
  type: z.literal("read"),
  language: z.string(),
  code: z.string(),
});

export type ReadCheck = z.infer<typeof readCheck>;

const build = (check: ReadCheck): Built<ReadCheck> => {
  const code = check.code.trim();

  try {
    const ran = execute(code, check.language);

    return ran.ok
      ? { check: { ...check, code }, errors: [] }
      : { check, errors: [`The example does not run:\n${ran.stderr}`] };
  } catch (error) {
    return {
      check,
      errors: [error instanceof Error ? error.message : String(error)],
    };
  }
};

export const readChecker: Checker<ReadCheck> = {
  build,
  grader: "nobody",
  inCourse: false,
  key: () => null,
  language: (check) => check.language,
  minutes: { easy: 2, hard: 5, medium: 3 },
  ready: () => true,
  retakeFromStart: false,
  run: () => {
    throw new Error("An example has nothing to submit.");
  },
  start: () => "",
  tutor: () => null,
  view: (check) => ({ code: check.code, type: "read" }),
};
