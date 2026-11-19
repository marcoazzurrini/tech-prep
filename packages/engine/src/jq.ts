// Runs jq tasks. The learner types a whole jq command, as in a terminal. It runs on each
// test input, and what it prints is compared with what the reference command printed.

import { spawnSync } from "node:child_process";
import { mkdtempSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import path from "node:path";

import type { JqSpec, JqTest, Problem } from "./content.ts";
import type { CaseResult, RunResult } from "./runner.ts";

const TIMEOUT_MS = 5000;

/**
 * Split a command line into arguments the way a shell does: spaces separate, single quotes
 * keep everything, double quotes and backslashes escape. Throws on a quote left open.
 */
export const splitArgs = (text: string): string[] => {
  const args: string[] = [];
  let current = "";
  let started = false;
  let quote: "'" | '"' | null = null;

  for (let i = 0; i < text.length; i += 1) {
    const ch = text.charAt(i);

    if (quote === "'") {
      if (ch === "'") {
        quote = null;
      } else {
        current += ch;
      }
    } else if (quote === '"') {
      if (ch === '"') {
        quote = null;
      } else if (ch === "\\" && '"\\$`'.includes(text.charAt(i + 1))) {
        i += 1;
        current += text.charAt(i);
      } else {
        current += ch;
      }
    } else if (ch === "'" || ch === '"') {
      quote = ch;
      started = true;
    } else if (ch === "\\" && i + 1 < text.length) {
      i += 1;
      current += text.charAt(i);
      started = true;
    } else if (/\s/u.test(ch)) {
      if (started) {
        args.push(current);
        current = "";
        started = false;
      }
    } else {
      current += ch;
      started = true;
    }
  }

  if (quote) {
    throw new Error(`A ${quote} quote is not closed.`);
  }

  if (started) {
    args.push(current);
  }

  return args;
};

const NO_INPUT_FLAGS = new Set(["-n", "--null-input"]);

/**
 * The arguments jq gets for the command the learner typed. The command is written as in a
 * terminal: `jq`, flags, the filter in quotes, then the file to read.
 */
const argsFor = (spec: JqSpec, text: string): string[] => {
  const args = splitArgs(text.trim());

  if (!args.length) {
    throw new Error("The command is empty. Start with `jq`.");
  }

  if (args.shift() !== "jq") {
    throw new Error(
      `Start the command with \`jq\`, as in a terminal. For example: jq '.' ${spec.file}`
    );
  }

  const noInput = args.some((a) => NO_INPUT_FLAGS.has(a));

  if (!noInput && !args.includes(spec.file)) {
    throw new Error(
      `jq needs a file to read. Add \`${spec.file}\` at the end of the command.`
    );
  }

  if (args.every((a) => a === spec.file || a.startsWith("-"))) {
    throw new Error(
      `The filter is missing. Put it in single quotes after \`jq\`: jq '.' ${spec.file}`
    );
  }

  return args;
};

/** Longest line a value may take before it is spread over several lines. */
const WIDTH = 48;

/**
 * JSON as a person would write it: a short array or object stays on one line, and a long
 * one gets a line per item. Easier to read than one key per line.
 */
// oxlint-disable-next-line anti-slop/no-unknown-parameters -- prints any JSON value
export const showJson = (value: unknown, indent = ""): string => {
  const flat = JSON.stringify(value, null, 1)
    ?.replaceAll(/\n\s*/gu, " ")
    .replaceAll(/(?<open>[[{]) /gu, "$<open>")
    .replaceAll(/ (?<close>[\]}])/gu, "$<close>");

  if (
    flat === undefined ||
    !(value instanceof Object) ||
    indent.length + flat.length <= WIDTH
  ) {
    return flat ?? "null";
  }

  const inner = `${indent}  `;

  const items = Array.isArray(value)
    ? value.map((item) => showJson(item, inner))
    : Object.entries(value).map(
        ([key, item]) => `${JSON.stringify(key)}: ${showJson(item, inner)}`
      );

  const [open, close] = Array.isArray(value) ? "[]" : "{}";

  return `${open}\n${items.map((item) => inner + item).join(",\n")}\n${indent}${close}`;
};

/** The text jq reads for a test. */
export const inputText = (test: JqTest): string =>
  test.input_text ?? `${JSON.stringify(test.input, null, 2)}\n`;

interface Ran {
  /** What jq printed, without trailing blank space. */
  output: string;
  /** jq's own error text, or null when it ran cleanly. */
  error: string | null;
}

/** An empty folder to run jq in, so a file name in a command finds nothing by accident. */
let scratch: string | undefined;

const scratchDir = (): string => {
  scratch ??= mkdtempSync(path.join(tmpdir(), "tech-prep-jq-"));

  return scratch;
};

process.on("exit", () => {
  if (scratch) {
    rmSync(scratch, { force: true, recursive: true });
  }
});

/**
 * Run jq in the scratch folder. With a `file`, the input is written there under that name
 * for the command to read, as it would be in a terminal. Otherwise it goes to standard input.
 */
const spawnJq = (args: string[], input: string, file?: string): Ran => {
  if (file) {
    writeFileSync(path.join(scratchDir(), file), input);
  }

  const proc = spawnSync("jq", args, {
    cwd: scratchDir(),
    encoding: "utf-8",
    input: file ? "" : input,
    maxBuffer: 8 * 1024 * 1024,
    timeout: TIMEOUT_MS,
  });

  if (proc.error) {
    const missing = "code" in proc.error && proc.error.code === "ENOENT";

    return {
      error: missing
        ? "jq is not installed. Install it, for example with `brew install jq`, then restart the app."
        : `jq did not finish: ${proc.error.message}`,
      output: "",
    };
  }

  // "(at data.json:17)" counts lines of the file as jq was fed it, one key per line, which
  // is not how the app shows the input. The lessons leave it out too.
  const stderr = proc.stderr.trim().replaceAll(/ \(at [^)\s]+:\d+\)/gu, "");

  return {
    error: proc.status === 0 && !stderr ? null : stderr || "jq failed.",
    output: proc.stdout.trimEnd(),
  };
};

/** Run the learner's text on one test input. */
export const runOnce = (spec: JqSpec, text: string, test: JqTest): Ran => {
  try {
    return spawnJq(argsFor(spec, text), inputText(test), spec.file);
  } catch (error) {
    return {
      error: error instanceof Error ? error.message : String(error),
      output: "",
    };
  }
};

/** One compact value per line with sorted keys, or null when the text is not JSON. */
const asValues = (text: string): string | null => {
  const ran = spawnJq(["-cS", "."], text);

  return ran.error ? null : ran.output;
};

/**
 * True when two outputs say the same thing. In a filter task with plain JSON output, values
 * are compared, so key order and spacing do not matter. Wherever formatting is the point
 * (a command task, or flags such as `-r`), the text must match.
 */
export const sameOutput = (
  spec: JqSpec,
  got: string,
  want: string
): boolean => {
  if (got.trimEnd() === want.trimEnd()) {
    return true;
  }

  if (spec.exact) {
    return false;
  }

  const [a, b] = [asValues(got), asValues(want)];

  return a !== null && a === b;
};

/**
 * Check a predict task: the learner typed the value they think comes out. It is compared
 * with the real output as JSON values, so spacing does not matter.
 */
const predicted = (spec: JqSpec, text: string): RunResult => {
  const [shown] = spec.tests;
  const expected = shown?.expected ?? "";
  const typed = asValues(text);
  let error: string | undefined;

  if (!text.trim()) {
    error = "Type the value you think comes out.";
  } else if (typed === null) {
    error =
      'This is not valid JSON. Text needs double quotes, like "Oslo". Check the brackets and commas too.';
  }

  const ok = !error && typed === asValues(expected);

  return {
    cases: [
      {
        actual: text.trim(),
        args: [shown?.input_text ?? shown?.input],
        error,
        expected,
        index: 0,
        ok,
      },
    ],
    passed: ok ? 1 : 0,
    total: 1,
  };
};

/** Run the learner's text on every test of a jq task. */
export const runJq = (problem: Problem, text: string): RunResult => {
  const spec = problem.jq;

  if (!spec) {
    throw new Error(`'${problem.slug}' is not a jq task.`);
  }

  if (spec.predict) {
    return predicted(spec, text);
  }

  const cases = spec.tests.map((test, index): CaseResult => {
    const ran = runOnce(spec, text, test);
    const expected = test.expected ?? "";

    return {
      actual: ran.output,
      args: [test.input_text ?? test.input],
      error: ran.error ?? undefined,
      expected,
      index,
      ok: !ran.error && sameOutput(spec, ran.output, expected),
    };
  });

  return {
    cases,
    passed: cases.filter((c) => c.ok).length,
    total: cases.length,
  };
};

/** What the learner's text prints on the shown input, for the live output panel. */
export const previewJq = (problem: Problem, text: string) => {
  const spec = problem.jq;
  const [shown] = spec?.tests ?? [];

  if (!spec || !shown) {
    throw new Error(`'${problem.slug}' is not a jq task.`);
  }

  // Nothing typed yet is not an error, and a predict task shows no output at all.
  if (!text.trim() || spec.predict) {
    return { error: null, matches: false, output: "" };
  }

  const ran = runOnce(spec, text, shown);

  return {
    error: ran.error,
    matches: !ran.error && sameOutput(spec, ran.output, shown.expected ?? ""),
    output: ran.output,
  };
};
