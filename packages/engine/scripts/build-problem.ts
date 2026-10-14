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

import { existsSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import {
  EXTENSIONS,
  LANGUAGES,
  PROBLEMS_DIR,
  isAuthored,
  problemIndex,
  problemInfo,
  type Language,
  type Problem,
} from "../src/content.ts";
import { formatRun, runTests } from "../src/runner.ts";

function load(slug: string): { spec: Record<string, any>; problem: Problem } {
  const spec = JSON.parse(readFileSync(join(PROBLEMS_DIR, slug, "spec.json"), "utf8"));
  const statement = readFileSync(join(PROBLEMS_DIR, slug, "problem.md"), "utf8");
  return { spec, problem: { ...spec, ...problemInfo(slug), statement } };
}

/** Pretty JSON with one test case per line, so specs stay readable and diffable. */
function formatSpec(spec: Record<string, any>): string {
  const { tests, ...rest } = spec;
  const head = JSON.stringify(rest, null, 2).slice(0, -2);
  const lines = (tests as unknown[]).map((t) => `    ${JSON.stringify(t)}`).join(",\n");
  return `${head},\n  "tests": [\n${lines}\n  ]\n}\n`;
}

function runFile(problem: Problem, language: Language, source: string, dir: string) {
  const file = join(dir, `${problem.slug}-${Math.random().toString(36).slice(2)}.${EXTENSIONS[language]}`);
  writeFileSync(file, source);
  return runTests(problem, language, file);
}

function build(slug: string): string[] {
  const errors: string[] = [];
  const dir = mkdtempSync(join(tmpdir(), "tp-build-"));
  try {
    for (const name of ["problem.md", "spec.json", "reference.py", "reference.ts"]) {
      if (!existsSync(join(PROBLEMS_DIR, slug, name))) errors.push(`missing ${name}`);
    }
    if (errors.length) return errors;

    const { spec, problem } = load(slug);
    for (const language of LANGUAGES) {
      if (!spec.stubs?.[language]) errors.push(`missing stubs.${language}`);
      if ((spec.kind ?? "function") === "function" && !spec.function?.[language]) errors.push(`missing function.${language}`);
    }
    if (!Array.isArray(spec.tests) || spec.tests.length < 3) errors.push("needs at least 3 tests");
    if (errors.length) return errors;

    // 1. Fill missing expected values from the Python reference.
    const missing = spec.tests.map((t: any, i: number) => (t.expected === undefined ? i : -1)).filter((i: number) => i >= 0);
    if (missing.length) {
      const reference = readFileSync(join(PROBLEMS_DIR, slug, "reference.py"), "utf8");
      const run = runFile(problem, "python", reference, dir);
      if (run.fatal) return [`reference.py failed to load:\n${run.fatal}`];
      for (const i of missing) {
        const result = run.cases[i]!;
        if (result.error) errors.push(`reference.py crashed on test ${i + 1}:\n${result.error}`);
        else spec.tests[i].expected = result.actual;
      }
      if (errors.length) return errors;
      writeFileSync(join(PROBLEMS_DIR, slug, "spec.json"), formatSpec(spec));
    }

    // 2. Both references must pass everything.
    const { problem: built } = load(slug);
    for (const language of LANGUAGES) {
      const source = readFileSync(join(PROBLEMS_DIR, slug, `reference.${EXTENSIONS[language]}`), "utf8");
      const run = runFile(built, language, source, dir);
      if (run.fatal || run.passed !== run.total) errors.push(`reference.${EXTENSIONS[language]}: ${formatRun(run)}`);
    }

    // 3. Stubs must load.
    for (const language of LANGUAGES) {
      const run = runFile(built, language, built.stubs[language], dir);
      if (run.fatal) errors.push(`stub (${language}) does not load: ${run.fatal}`);
    }
    return errors;
  } finally {
    rmSync(dir, { recursive: true, force: true });
  }
}

const args = process.argv.slice(2);
const slugs = args[0] === "--all" ? problemIndex().map((p) => p.slug).filter(isAuthored) : args;
if (!slugs.length) {
  console.log("usage: bun scripts/build-problem.ts <slug...> | --all");
  process.exit(1);
}

let failed = 0;
for (const slug of slugs) {
  const errors = build(slug);
  if (errors.length) {
    failed++;
    console.log(`✗ ${slug}\n${errors.map((e) => `  ${e.replaceAll("\n", "\n  ")}`).join("\n")}`);
  } else {
    console.log(`✓ ${slug}`);
  }
}
console.log(`\n${slugs.length - failed}/${slugs.length} problems OK`);
process.exit(failed ? 1 : 0);
