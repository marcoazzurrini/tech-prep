// The code task type: a function or a class in TypeScript or Python, checked by test cases.

import { existsSync, readFileSync } from "node:fs";
import path from "node:path";

import {
  DEFAULT_LANGUAGE,
  EXTENSIONS,
  guidedConcept,
  guidedNumber,
  lessonsDir,
  problemsDir,
  readJson,
} from "./content.ts";
import type { Course, Language, ProblemInfo } from "./content.ts";
import { ensureDataStructures, runCode } from "./runner.ts";
import type { Problem, TaskType } from "./tasks.ts";

/**
 * How a returned value is compared with the expected one.
 * - exact: deep equality.
 * - unordered: the top-level array may be in any order.
 * - deep-unordered: every nested array may be in any order (e.g. lists of groups).
 * - one-of: `expected` is a list of acceptable answers.
 */
export type CompareMode = "exact" | "unordered" | "deep-unordered" | "one-of";

export interface TestCase {
  args: unknown[];
  /** Method names for design problems; the first entry is the constructor. */
  ops?: string[];
  expected?: unknown;
}

/** How the harness calls a solution. See server/src/harness/*_harness.* for the semantics. */
export interface CallSpec {
  kind?: "function" | "design" | "roundtrip";
  function?: Record<Language, string>;
  class?: string;
  encode?: string;
  decode?: string;
  /** Roundtrip value type. */
  type?: string;
  /** Argument types: "json" (default), "ListNode", "ListNode[]", "CycleList", "TreeNode", "TreeNodeRef", "GraphNode", "RandomList". */
  params?: string[];
  /** Return type: "json" (default), "ListNode", "TreeNode", "TreeNodeVal", "GraphNode", "RandomList", "void". */
  returns?: string;
  /** "arg0" when the function changes its first argument in place and returns nothing. */
  output?: "return" | "arg0";
}

/** A code problem: how the harness calls the solution, and the cases it is checked on. */
export interface CodeProblem extends Problem, CallSpec {
  compare: CompareMode;
  tests: TestCase[];
}

/**
 * The folder holding a problem's statement, spec and reference solutions. A lesson's first
 * guided problem sits in the lesson's folder, and a later one in `task-2`, `task-3` inside it.
 */
export const problemDir = (course: Course, slug: string): string => {
  const conceptId = guidedConcept(slug);

  if (!conceptId) {
    return path.join(problemsDir(course), slug);
  }

  const n = guidedNumber(slug);
  const lesson = path.join(lessonsDir(course), conceptId);

  return n === 1 ? lesson : path.join(lesson, `task-${n}`);
};

const specFile = (course: Course, slug: string): string =>
  path.join(problemDir(course, slug), "spec.json");

const statementFile = (course: Course, slug: string): string =>
  path.join(problemDir(course, slug), "problem.md");

/** Every code problem read so far, per course. */
const loaded = new WeakMap<Course, Map<string, CodeProblem>>();

const load = (course: Course, info: ProblemInfo): CodeProblem => {
  const cached = loaded.get(course)?.get(info.slug);

  if (cached) {
    return cached;
  }

  // SAFETY: spec.json is authored to this shape, and `build-problem` checks it in CI.
  const spec = readJson<Omit<CodeProblem, keyof ProblemInfo | "statement">>(
    specFile(course, info.slug)
  );

  const read: CodeProblem = {
    ...spec,
    ...info,
    statement: readFileSync(statementFile(course, info.slug), "utf-8"),
  };

  loaded.set(course, (loaded.get(course) ?? new Map()).set(info.slug, read));

  return read;
};

export const codeTasks: TaskType = {
  appView: () => ({ kind: "code" }),
  isAuthored: (course, slug) =>
    existsSync(specFile(course, slug)) &&
    existsSync(statementFile(course, slug)),
  language: DEFAULT_LANGUAGE,
  load,
  minutes: { easy: 8, hard: 25, medium: 15 },
  noun: "problems",
  prepare: ensureDataStructures,
  reference: (course, slug, language) => {
    const file = path.join(
      problemDir(course, slug),
      `reference.${EXTENSIONS[language]}`
    );

    return existsSync(file) ? readFileSync(file, "utf-8") : null;
  },
  retakeFromStub: false,
  run: (course, info, language, file) =>
    runCode(load(course, info), language, file),
  runsExerciseCode: true,
  // Only a guided problem's spec holds a title. A curriculum problem's is in the index.
  title: (course, slug) =>
    guidedConcept(slug) && existsSync(specFile(course, slug))
      ? readJson<{ title?: string }>(specFile(course, slug)).title
      : undefined,
  tutorView: () => null,
};
