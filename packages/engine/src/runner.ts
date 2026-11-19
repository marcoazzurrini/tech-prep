import { spawnSync } from "node:child_process";
import { existsSync, readFileSync, writeFileSync } from "node:fs";
import path from "node:path";

import type { CompareMode, FunctionCheck } from "./checks/function.ts";
import { extension } from "./content.ts";
import type { Language } from "./content.ts";

const TIMEOUT_MS = 10_000;
const HARNESS_DIR = path.join(import.meta.dir, "harness");

export interface CaseResult {
  index: number;
  ok: boolean;
  args: unknown[];
  expected: unknown;
  actual?: unknown;
  error?: string;
  stdout?: string;
  ms?: number;
}

export interface RunResult {
  passed: number;
  total: number;
  fatal?: string;
  cases: CaseResult[];
}

const command = (language: Language): [string, string[]] => {
  if (language === "python") {
    return [
      "python3",
      ["-I", "-B", path.join(HARNESS_DIR, "python_harness.py")],
    ];
  }

  return [
    process.execPath,
    ["run", path.join(HARNESS_DIR, "typescript-harness.ts")],
  ];
};

/** Solutions import ListNode/TreeNode/GraphNode from a `ds` module next to them. */
export const ensureDataStructures = (dir: string, language: Language): void => {
  const name = `ds.${extension(language)}`;
  const source = readFileSync(path.join(HARNESS_DIR, name), "utf-8");
  const target = path.join(dir, name);

  // Rewrite an older copy, so a workspace made before a structure was added still gets it.
  if (!existsSync(target) || readFileSync(target, "utf-8") !== source) {
    writeFileSync(target, source);
  }
};

const canonical = (
  // oxlint-disable-next-line anti-slop/no-unknown-parameters -- test values and results are arbitrary JSON
  value: unknown,
  mode: CompareMode,
  depth = 0
  // oxlint-disable-next-line anti-slop/no-unknown-returns -- returns the same arbitrary JSON, normalised
): unknown => {
  if (!Array.isArray(value)) {
    return value;
  }

  const deep = mode === "deep-unordered";
  const items = value.map((v) => (deep ? canonical(v, mode, depth + 1) : v));
  const shouldSort = deep || (mode === "unordered" && depth === 0);

  return shouldSort
    ? items.toSorted((a, b) =>
        JSON.stringify(a).localeCompare(JSON.stringify(b))
      )
    : items;
};

export const equal = (
  // oxlint-disable-next-line anti-slop/no-unknown-parameters -- whatever the solution returned
  actual: unknown,
  // oxlint-disable-next-line anti-slop/no-unknown-parameters -- a test's expected JSON value
  expected: unknown,
  mode: CompareMode
): boolean => {
  if (mode === "one-of") {
    return (
      Array.isArray(expected) && expected.some((e) => equal(actual, e, "exact"))
    );
  }

  return (
    JSON.stringify(canonical(actual, mode)) ===
    JSON.stringify(canonical(expected, mode))
  );
};

/** Call the solution in `file` on every test of a function check. */
export const runCode = (
  check: FunctionCheck,
  language: Language,
  file: string
): RunResult => {
  const total = check.tests.length;

  if (!existsSync(file)) {
    return {
      cases: [],
      fatal: `Solution file not found: ${file}`,
      passed: 0,
      total,
    };
  }

  ensureDataStructures(path.dirname(file), language);

  // The harness names what is called `kind`, and the roundtrip value's type `type`.
  const request = {
    cases: check.tests,
    class: check.class,
    decode: check.decode,
    encode: check.encode,
    file,
    function: check.function?.[language],
    kind: check.calls ?? "function",
    output: check.output,
    params: check.params,
    returns: check.returns,
    type: check.value_type,
  };

  const [cmd, args] = command(language);

  const proc = spawnSync(cmd, args, {
    encoding: "utf-8",
    input: JSON.stringify(request),
    maxBuffer: 32 * 1024 * 1024,
    timeout: TIMEOUT_MS,
  });

  if (proc.error || proc.signal) {
    const reason =
      proc.signal === "SIGTERM"
        ? `timed out after ${TIMEOUT_MS / 1000}s (infinite loop?)`
        : String(proc.error);

    return { cases: [], fatal: `Run failed: ${reason}`, passed: 0, total };
  }

  let output: {
    fatal?: string;
    results?: Omit<CaseResult, "index" | "ok" | "args" | "expected">[];
  };

  try {
    output = JSON.parse(proc.stdout);
  } catch {
    return {
      cases: [],
      fatal: `Harness crashed:\n${proc.stderr || proc.stdout}`,
      passed: 0,
      total,
    };
  }

  if (output.fatal || !output.results) {
    return { cases: [], fatal: output.fatal, passed: 0, total };
  }

  const cases = output.results.map((r, index): CaseResult => {
    const test = check.tests[index];

    if (!test) {
      throw new Error(
        `The harness returned a result for case ${index + 1}, but there are only ${total} tests.`
      );
    }

    const actual = "actual" in r ? r.actual : null;
    const ok = !r.error && equal(actual, test.expected, check.compare);

    return {
      args: test.args,
      expected: test.expected,
      index,
      ok,
      ...r,
      actual,
    };
  });

  return { cases, passed: cases.filter((c) => c.ok).length, total };
};

// oxlint-disable-next-line anti-slop/no-unknown-parameters -- prints any JSON value
export const short = (value: unknown, max = 300): string => {
  const text = JSON.stringify(value) ?? "undefined";

  return text.length <= max
    ? text
    : `${text.slice(0, max)}… (${text.length} chars)`;
};

const indent = (text: string, n: number): string =>
  text
    .split("\n")
    .map((l) => " ".repeat(n) + l)
    .join("\n");

/** Short human-readable report: one line per case, details only for failures. */
export const formatRun = (run: RunResult, maxFailures = 3): string => {
  if (run.fatal) {
    return `✗ ${run.fatal}`;
  }

  const lines = [`${run.passed}/${run.total} tests passed`];
  const failures = run.cases.filter((c) => !c.ok);

  for (const c of failures.slice(0, maxFailures)) {
    lines.push(
      `\n✗ case ${c.index + 1}`,
      `  input:    ${short(c.args)}`,
      `  expected: ${short(c.expected)}`
    );

    if (c.error) {
      lines.push(`  error:\n${indent(c.error.trim(), 4)}`);
    } else {
      lines.push(`  got:      ${short(c.actual)}`);
    }

    if (c.stdout?.trim()) {
      lines.push(`  stdout:\n${indent(c.stdout.trim(), 4)}`);
    }
  }

  if (failures.length > maxFailures) {
    lines.push(`\n…and ${failures.length - maxFailures} more failing case(s)`);
  }

  return lines.join("\n");
};
