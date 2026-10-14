#!/usr/bin/env bun
// Build and verify problems.
//
//   bun scripts/build-problem.ts <slug...>    build the given problems
//   bun scripts/build-problem.ts --all        build every authored problem
//
// For each problem in content/problems/<slug>/:
// 1. Tests without an `expected` value get it from reference.py.
// 2. reference.py and reference.ts must both pass every test.
// 3. Both stubs must load (a crash per case is fine; a load error is not).

import {
  existsSync,
  mkdtempSync,
  readFileSync,
  rmSync,
  writeFileSync,
} from "node:fs";
import { tmpdir } from "node:os";
import path from "node:path";

import {
  EXTENSIONS,
  LANGUAGES,
  PROBLEMS_DIR,
  isAuthored,
  problemIndex,
  problemInfo,
} from "../src/content.ts";
import type {
  Language,
  Problem,
  ProblemInfo,
  TestCase,
} from "../src/content.ts";
import { formatRun, runTests } from "../src/runner.ts";

/** spec.json as authored: any field may be missing until `checkSpec` passes. */
type Spec = Partial<Omit<Problem, keyof ProblemInfo | "statement">>;

const load = (slug: string) => {
  // SAFETY: every field of `Spec` is optional; `checkSpec` validates the ones the build relies on.
  const spec = JSON.parse(
    readFileSync(path.join(PROBLEMS_DIR, slug, "spec.json"), "utf-8")
  ) as Spec;

  const statement = readFileSync(
    path.join(PROBLEMS_DIR, slug, "problem.md"),
    "utf-8"
  );

  // SAFETY: the problem only runs after `checkSpec` has accepted its spec.
  const problem = { ...spec, ...problemInfo(slug), statement } as Problem;

  return { problem, spec };
};

/** Pretty JSON with one test case per line, so specs stay readable and diffable. */
const formatSpec = (spec: Spec, tests: TestCase[]): string => {
  const { tests: _tests, ...rest } = spec;
  const head = JSON.stringify(rest, null, 2).slice(0, -2);

  const lines = tests.map((t) => `    ${JSON.stringify(t)}`).join(",\n");

  return `${head},\n  "tests": [\n${lines}\n  ]\n}\n`;
};

const runFile = (
  problem: Problem,
  language: Language,
  source: string,
  dir: string
) => {
  const file = path.join(
    dir,
    `${problem.slug}-${Math.random().toString(36).slice(2)}.${EXTENSIONS[language]}`
  );

  writeFileSync(file, source);

  return runTests(problem, language, file);
};

/** Fields every spec needs: stubs, function names (for function problems) and enough tests. */
const checkSpec = (spec: Spec, tests: TestCase[]): string[] => {
  const errors: string[] = [];

  for (const language of LANGUAGES) {
    if (!spec.stubs?.[language]) {
      errors.push(`missing stubs.${language}`);
    }

    if (
      (spec.kind ?? "function") === "function" &&
      !spec.function?.[language]
    ) {
      errors.push(`missing function.${language}`);
    }
  }

  if (tests.length < 3) {
    errors.push("needs at least 3 tests");
  }

  return errors;
};

/** Step 1: fill missing expected values from the Python reference and rewrite spec.json. */
const fillExpected = (
  slug: string,
  spec: Spec,
  tests: TestCase[],
  problem: Problem,
  dir: string
): string[] => {
  const missing = tests.flatMap((t, i) =>
    t.expected === undefined ? [i] : []
  );

  if (!missing.length) {
    return [];
  }

  const reference = readFileSync(
    path.join(PROBLEMS_DIR, slug, "reference.py"),
    "utf-8"
  );

  const run = runFile(problem, "python", reference, dir);

  if (run.fatal) {
    return [`reference.py failed to load:\n${run.fatal}`];
  }

  const errors: string[] = [];

  for (const i of missing) {
    const test = tests[i];
    const result = run.cases[i];

    if (!test || !result) {
      throw new Error(
        `${slug}: reference.py returned no result for test ${i + 1}.`
      );
    }

    if (result.error) {
      errors.push(`reference.py crashed on test ${i + 1}:\n${result.error}`);
    } else {
      test.expected = result.actual;
    }
  }

  if (!errors.length) {
    writeFileSync(
      path.join(PROBLEMS_DIR, slug, "spec.json"),
      formatSpec(spec, tests)
    );
  }

  return errors;
};

const build = (slug: string): string[] => {
  const errors: string[] = [];
  const dir = mkdtempSync(path.join(tmpdir(), "tp-build-"));

  try {
    for (const name of [
      "problem.md",
      "spec.json",
      "reference.py",
      "reference.ts",
    ]) {
      if (!existsSync(path.join(PROBLEMS_DIR, slug, name))) {
        errors.push(`missing ${name}`);
      }
    }

    if (errors.length) {
      return errors;
    }

    const { spec, problem } = load(slug);
    // A spec whose tests are not a list fails the "at least 3 tests" check.
    const tests = Array.isArray(spec.tests) ? spec.tests : [];
    const specErrors = checkSpec(spec, tests);

    if (specErrors.length) {
      return specErrors;
    }

    // 1. Fill missing expected values from the Python reference.
    const fillErrors = fillExpected(slug, spec, tests, problem, dir);

    if (fillErrors.length) {
      return fillErrors;
    }

    // 2. Both references must pass everything.
    const { problem: built } = load(slug);

    for (const language of LANGUAGES) {
      const source = readFileSync(
        path.join(PROBLEMS_DIR, slug, `reference.${EXTENSIONS[language]}`),
        "utf-8"
      );

      const run = runFile(built, language, source, dir);

      if (run.fatal || run.passed !== run.total) {
        errors.push(`reference.${EXTENSIONS[language]}: ${formatRun(run)}`);
      }
    }

    // 3. Stubs must load.
    for (const language of LANGUAGES) {
      const run = runFile(built, language, built.stubs[language], dir);

      if (run.fatal) {
        errors.push(`stub (${language}) does not load: ${run.fatal}`);
      }
    }

    return errors;
  } finally {
    rmSync(dir, { force: true, recursive: true });
  }
};

const args = process.argv.slice(2);

const slugs =
  args[0] === "--all"
    ? problemIndex()
        .map((p) => p.slug)
        .filter(isAuthored)
    : args;

if (!slugs.length) {
  console.log("usage: bun scripts/build-problem.ts <slug...> | --all");
  process.exit(1);
}

let failed = 0;

for (const slug of slugs) {
  const errors = build(slug);

  if (errors.length) {
    failed += 1;
    console.log(
      `✗ ${slug}\n${errors.map((e) => `  ${e.replaceAll("\n", "\n  ")}`).join("\n")}`
    );
  } else {
    console.log(`✓ ${slug}`);
  }
}

console.log(`\n${slugs.length - failed}/${slugs.length} problems OK`);

process.exit(failed ? 1 : 0);
