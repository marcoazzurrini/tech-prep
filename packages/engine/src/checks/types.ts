// What a checker is. A checker is one way of deciding whether an answer is right: calling a
// function with test inputs, running a command and reading what it prints, and so on. Every
// exercise names one in its `check`, so a course mixes them freely, and the rest of the
// engine works with any of them through this interface.

import type { Difficulty, Language } from "../content.ts";
import type { RunResult } from "../runner.ts";

/** What the learner's text does on the shown input, while they type. */
export interface Preview {
  output: string;
  error: string | null;
  matches: boolean;
}

/** One thing an exercise shows the learner to work from, such as its input file. */
export interface Shown {
  label: string;
  /** The file the text is in, when the learner's answer names it. */
  file?: string;
  text: string;
}

/** What the app shows for a check, with the answer left out. Each type has its own workbench. */
export type CheckView =
  | { type: "function" }
  | {
      type: "command";
      program: string;
      /** The file the input is in. The learner's command names it. */
      file: string;
      input: string;
      wanted: string;
      /** How many inputs Submit checks beyond the one shown. */
      hidden: number;
    }
  | { type: "value"; shown: Shown[] }
  | { type: "arrange"; lines: string[] }
  | { type: "answer" }
  | { type: "read"; code: string };

/** The learner's answer, as it is saved. */
export interface Answer {
  /** Null when nothing was saved yet. */
  text: string | null;
  /** Where it is saved. A function is loaded from here. */
  file: string;
  language: Language;
}

/** What a check is built with: where its files are, and what the exercise is about. */
export interface BuildContext {
  /** The exercise's folder. Null for an exercise the tutor wrote on the spot. */
  dir: string | null;
  /** The concepts the exercise targets. */
  concepts: string[];
}

/** A check with its answers filled in, and what is wrong with it. */
export interface Built<C> {
  check: C;
  errors: string[];
}

/** Who decides that an answer is right. Nobody does for something that is only read. */
export type Grader = "engine" | "tutor" | "nobody";

/** One way of checking an answer. `C` is the check as an exercise's file holds it. */
export interface Checker<C> {
  grader: Grader;
  /**
   * True when a course can hold an exercise checked this way: the engine grades it alone,
   * and the app has a workbench for it. The others are shown by the tutor only.
   */
  inCourse: boolean;
  /**
   * True when an exercise taken again starts from its starting text. With short answers,
   * the old one would give the new attempt away.
   */
  retakeFromStart: boolean;
  /** A rough time to solve one, for the review estimate. */
  minutes: Record<Difficulty, number>;
  /** True when every answer the check needs is filled in, so the exercise can be practised. */
  ready: (check: C) => boolean;
  /** What the answer is written in. */
  language: (check: C) => Language;
  /** What the editor starts with. */
  start: (check: C, language: Language) => string;
  /** What the app shows, with the answer left out. */
  view: (check: C) => CheckView;
  /** Check an answer. */
  run: (check: C, answer: Answer) => RunResult;
  /** What the learner's text does on the shown input, for a check that shows it live. */
  preview?: (check: C, text: string) => Preview;
  /** The answer key, shown after the learner gives up. Null when there is none. */
  key: (check: C, language: Language, dir: string | null) => string | null;
  /** What the tutor is told about the check: the facts, and what never to give away. */
  tutor: (check: C) => object | null;
  /** Put the files an answer needs beside it in `dir`. */
  prepare?: (dir: string, language: Language) => void;
  /** Fill in the answers from the reference, and say what is wrong with the check. */
  build: (check: C, context: BuildContext) => Built<C>;
}

/** The result of an answer that was never saved. */
export const unsaved = (answer: Answer, total: number): RunResult => ({
  cases: [],
  fatal: `Solution file not found: ${answer.file}`,
  passed: 0,
  total,
});
