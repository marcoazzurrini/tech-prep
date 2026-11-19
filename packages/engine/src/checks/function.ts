// The function check: the learner writes a function or a class, and test cases call it.

import {
  existsSync,
  mkdtempSync,
  readFileSync,
  rmSync,
  writeFileSync,
} from "node:fs";
import { tmpdir } from "node:os";
import path from "node:path";

import { z } from "zod";

import { extension } from "../content.ts";
import type { Language } from "../content.ts";
import { DEFAULT_LANGUAGE } from "../program.ts";
import { ensureDataStructures, formatRun, runCode } from "../runner.ts";
import type { RunResult } from "../runner.ts";
import { unsaved } from "./types.ts";
import type { Built, Checker } from "./types.ts";

const MIN_TESTS = 3;

/**
 * How a returned value is compared with the expected one.
 * - exact: deep equality.
 * - unordered: the top-level array may be in any order.
 * - deep-unordered: every nested array may be in any order (e.g. lists of groups).
 * - one-of: `expected` is a list of acceptable answers.
 */
const Compare = z.enum(["exact", "unordered", "deep-unordered", "one-of"]);

export type CompareMode = z.infer<typeof Compare>;

// oxlint-disable-next-line sort-keys -- written back to the exercise's file in this order
const Test = z.object({
  args: z.array(z.unknown()),
  /** Method names for a design exercise. The first entry is the constructor. */
  ops: z.array(z.string()).optional(),
  expected: z.unknown().optional(),
});

type TestCase = z.infer<typeof Test>;

/** How the harness calls a solution. See `harness/` for what each field means. */
// oxlint-disable-next-line sort-keys -- written back to the exercise's file in this order
export const functionCheck = z.object({
  type: z.literal("function"),
  /** What the tests call: one function, a class driven by `ops`, or an encode and decode pair. */
  calls: z.enum(["function", "design", "roundtrip"]).optional(),
  /** The function's name in each language. */
  function: z.record(z.string(), z.string()).optional(),
  class: z.string().optional(),
  encode: z.string().optional(),
  decode: z.string().optional(),
  /** The type of the value a roundtrip encodes. */
  value_type: z.string().optional(),
  /** Argument types: "json" (the default), "ListNode", "TreeNode" and so on. */
  params: z.array(z.string()).optional(),
  /** Return type: "json" (the default), "ListNode", "TreeNode", "void" and so on. */
  returns: z.string().optional(),
  /** "arg0" when the function changes its first argument in place and returns nothing. */
  output: z.enum(["return", "arg0"]).optional(),
  compare: Compare.default("exact"),
  /** What the editor starts with, for each language the exercise can be solved in. */
  stubs: z.record(z.string(), z.string()),
  tests: z.array(Test),
});

export type FunctionCheck = z.infer<typeof functionCheck>;

const languages = (check: FunctionCheck): Language[] =>
  Object.keys(check.stubs);

const referenceFile = (dir: string, language: Language): string =>
  path.join(dir, `reference.${extension(language)}`);

/** Run source text as the solution, from a file of its own in `dir`. */
const runSource = (
  check: FunctionCheck,
  language: Language,
  source: string,
  dir: string
): RunResult => {
  const file = path.join(
    dir,
    `solution-${Math.random().toString(36).slice(2)}.${extension(language)}`
  );

  writeFileSync(file, source);

  return runCode(check, language, file);
};

/** The fields every function check needs. */
const fieldErrors = (check: FunctionCheck): string[] => {
  const errors: string[] = [];

  if (!languages(check).length) {
    errors.push("missing stubs");
  }

  for (const language of languages(check)) {
    if (
      (check.calls ?? "function") === "function" &&
      !check.function?.[language]
    ) {
      errors.push(`missing function.${language}`);
    }
  }

  if (check.tests.length < MIN_TESTS) {
    errors.push(`needs at least ${MIN_TESTS} tests`);
  }

  return errors;
};

/** Fill the tests that have no `expected` from the first language's reference. */
const fillExpected = (
  check: FunctionCheck,
  dir: string,
  scratch: string
): Built<FunctionCheck> => {
  const missing = check.tests.flatMap((t, i) =>
    t.expected === undefined ? [i] : []
  );

  // Python comes first when the exercise has it: its values print as plain JSON.
  const language = languages(check).includes("python")
    ? "python"
    : languages(check)[0];

  if (!missing.length || !language) {
    return { check, errors: [] };
  }

  const name = path.basename(referenceFile(dir, language));

  const run = runSource(
    check,
    language,
    readFileSync(referenceFile(dir, language), "utf-8"),
    scratch
  );

  if (run.fatal) {
    return { check, errors: [`${name} failed to load:\n${run.fatal}`] };
  }

  const errors: string[] = [];

  const tests = check.tests.map((test, i): TestCase => {
    const result = run.cases[i];

    if (test.expected !== undefined || !result) {
      return test;
    }

    if (result.error) {
      errors.push(`${name} crashed on test ${i + 1}:\n${result.error}`);

      return test;
    }

    return { ...test, expected: result.actual };
  });

  return { check: errors.length ? check : { ...check, tests }, errors };
};

/**
 * Build a function check:
 * 1. Tests without an `expected` value get it from the reference.
 * 2. The reference in each language must pass every test.
 * 3. Each stub must load (a crash per case is fine; a load error is not).
 */
const build = (
  check: FunctionCheck,
  dir: string | null
): Built<FunctionCheck> => {
  if (!dir) {
    return {
      check,
      errors: ["a function check needs a folder with its reference solutions"],
    };
  }

  const errors = [
    ...fieldErrors(check),
    ...languages(check)
      .filter((language) => !existsSync(referenceFile(dir, language)))
      .map((language) => `missing reference.${extension(language)}`),
  ];

  if (errors.length) {
    return { check, errors };
  }

  const scratch = mkdtempSync(path.join(tmpdir(), "tp-build-"));

  try {
    const filled = fillExpected(check, dir, scratch);

    if (filled.errors.length) {
      return filled;
    }

    for (const language of languages(check)) {
      const reference = runSource(
        filled.check,
        language,
        readFileSync(referenceFile(dir, language), "utf-8"),
        scratch
      );

      if (reference.fatal || reference.passed !== reference.total) {
        errors.push(
          `reference.${extension(language)}: ${formatRun(reference)}`
        );
      }

      const stub = runSource(
        filled.check,
        language,
        check.stubs[language] ?? "",
        scratch
      );

      if (stub.fatal) {
        errors.push(`stub (${language}) does not load: ${stub.fatal}`);
      }
    }

    return { check: filled.check, errors };
  } finally {
    rmSync(scratch, { force: true, recursive: true });
  }
};

export const functionChecker: Checker<FunctionCheck> = {
  build: (check, { dir }) => build(check, dir),
  grader: "engine",
  inCourse: true,
  key: (_check, language, dir) => {
    const file = dir && referenceFile(dir, language);

    return file && existsSync(file) ? readFileSync(file, "utf-8") : null;
  },
  // The learner's usual language when the exercise has it, else the first it can be solved in.
  language: (check) =>
    languages(check).find((language) => language === DEFAULT_LANGUAGE) ??
    languages(check)[0] ??
    DEFAULT_LANGUAGE,
  minutes: { easy: 8, hard: 25, medium: 15 },
  prepare: ensureDataStructures,
  ready: () => true,
  retakeFromStart: false,
  run: (check, answer) =>
    answer.text === null
      ? unsaved(answer, check.tests.length)
      : runCode(check, answer.language, answer.file),
  start: (check, language) => check.stubs[language] ?? "",
  tutor: () => null,
  view: () => ({ type: "function" }),
};
