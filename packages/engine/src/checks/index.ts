// Every checker the engine has, and one way to reach the right one for a check. A new way
// of checking an answer is one more file here, one more line in `Check` and one more case
// in `checkerFor`.

import { z } from "zod";

import type { Difficulty, Language } from "../content.ts";
import type { RunResult } from "../runner.ts";
import { answerCheck, answerChecker } from "./answer.ts";
import { arrangeCheck, arrangeChecker } from "./arrange.ts";
import { commandCheck, commandChecker } from "./command.ts";
import { functionCheck, functionChecker } from "./function.ts";
import { readCheck, readChecker } from "./read.ts";
import type {
  Answer,
  BuildContext,
  CheckView,
  Checker,
  Grader,
  Preview,
} from "./types.ts";
import { valueCheck, valueChecker } from "./value.ts";

/** How an exercise is checked, as its file holds it. `type` names the checker. */
export const anyCheck = z.discriminatedUnion("type", [
  functionCheck,
  commandCheck,
  valueCheck,
  arrangeCheck,
  answerCheck,
  readCheck,
]);

export type Check = z.infer<typeof anyCheck>;

/** A check together with its checker: what the rest of the engine asks. */
export interface Checking {
  check: Check;
  grader: Grader;
  inCourse: boolean;
  retakeFromStart: boolean;
  minutes: Record<Difficulty, number>;
  ready: () => boolean;
  language: () => Language;
  start: (language: Language) => string;
  view: () => CheckView;
  run: (answer: Answer) => RunResult;
  /** Null for a check that shows nothing while the learner types. */
  preview: ((text: string) => Preview) | null;
  key: (language: Language, dir: string | null) => string | null;
  tutor: () => object | null;
  prepare: (dir: string, language: Language) => void;
  /** The check with its answers filled in, and what is wrong with it. */
  build: (context: BuildContext) => { check: Check; errors: string[] };
}

const bind = <C extends Check>(checker: Checker<C>, check: C): Checking => {
  const { preview } = checker;

  return {
    build: (context) => checker.build(check, context),
    check,
    grader: checker.grader,
    inCourse: checker.inCourse,
    key: (language, dir) => checker.key(check, language, dir),
    language: () => checker.language(check),
    minutes: checker.minutes,
    prepare: (dir, language) => checker.prepare?.(dir, language),
    preview: preview ? (text) => preview(check, text) : null,
    ready: () => checker.ready(check),
    retakeFromStart: checker.retakeFromStart,
    run: (answer) => checker.run(check, answer),
    start: (language) => checker.start(check, language),
    tutor: () => checker.tutor(check),
    view: () => checker.view(check),
  };
};

/** The checker for a check, with the check already handed to it. */
export const checkerFor = (check: Check): Checking => {
  switch (check.type) {
    case "function": {
      return bind(functionChecker, check);
    }

    case "command": {
      return bind(commandChecker, check);
    }

    case "value": {
      return bind(valueChecker, check);
    }

    case "arrange": {
      return bind(arrangeChecker, check);
    }

    case "answer": {
      return bind(answerChecker, check);
    }

    default: {
      return bind(readChecker, check);
    }
  }
};

export type {
  Answer,
  BuildContext,
  CheckView,
  Grader,
  Preview,
  Shown,
} from "./types.ts";
