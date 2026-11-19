// The command check: the learner types a whole command, as in a terminal. It runs on each
// test input, and what it prints is compared with what the reference command printed.

import { spawnSync } from "node:child_process";
import { mkdtempSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import path from "node:path";

import { z } from "zod";

import type { CaseResult } from "../runner.ts";
import { unsaved } from "./types.ts";
import type { Built, Checker, Preview } from "./types.ts";

const TIMEOUT_MS = 5000;
const MIN_TESTS = 3;

/** A command-line program the engine can run for a learner. */
interface Program {
  /** A command that always works, to show when the learner's is malformed. */
  example: (file: string) => string;
  /** How to get the program, shown when it is not installed. */
  install: string;
  /** Flags that make the program read no file. */
  noInput: string[];
  /** What to say when the command holds only flags and the file name. */
  operand: string;
  /** Make the program's own error text fit what the app shows. */
  tidyError: (text: string) => string;
}

/**
 * The programs a command may start with. A course cannot make the engine run anything else,
 * so a course from outside the app cannot run arbitrary programs.
 */
const JQ: Program = {
  example: (file) => `jq '.' ${file}`,
  install:
    "Install it, for example with `brew install jq`, then restart the app.",
  noInput: ["-n", "--null-input"],
  operand: "The filter is missing. Put it in single quotes after `jq`",
  // "(at data.json:17)" counts lines of the file as jq was fed it, one key per line, which
  // is not how the app shows the input.
  tidyError: (text) => text.replaceAll(/ \(at [^)\s]+:\d+\)/gu, ""),
};

const PROGRAMS = new Map([["jq", JQ]]);

const known = (): string => [...PROGRAMS.keys()].join(", ");

const programOf = (name: string): Program => {
  const program = PROGRAMS.get(name);

  if (!program) {
    throw new Error(`The app cannot run '${name}'. It runs: ${known()}.`);
  }

  return program;
};

/** One input a command is checked on. */
export const CommandInput = {
  /** The input as JSON. */
  input: z.unknown().optional(),
  /** The input as raw text, such as one JSON value per line. */
  input_text: z.string().optional(),
};

const Test = z.object({
  ...CommandInput,
  /** What the reference command prints. The build fills it in. */
  expected: z.string().optional(),
});

type CommandTest = z.infer<typeof Test>;

// oxlint-disable-next-line sort-keys -- written back to the exercise's file in this order
export const commandCheck = z.object({
  type: z.literal("command"),
  /** The program the command starts with, such as "jq". */
  program: z.string(),
  /**
   * "json": outputs are compared as JSON values, so key order and spacing do not matter.
   * "text": the output text must match, for commands whose formatting is the point.
   */
  compare: z.enum(["json", "text"]),
  /** The file the input is in. The learner's command names it. */
  file: z.string(),
  /** A command to change or fix. Left out, the editor starts empty. */
  start: z.string().optional(),
  /** The answer key: a whole command. */
  reference: z.string(),
  /** True when the output cannot depend on the input, so every test prints the same. */
  constant: z.boolean().optional(),
  /** The first test is the one shown to the learner. The others are hidden. */
  tests: z.array(Test),
});

export type CommandCheck = z.infer<typeof commandCheck>;

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

/**
 * The arguments the program gets for the command the learner typed. The command is written
 * as in a terminal: the program, its flags and operands, then the file to read.
 */
const argsFor = (name: string, file: string, text: string): string[] => {
  const program = programOf(name);
  const args = splitArgs(text.trim());

  if (!args.length) {
    throw new Error(`The command is empty. Start with \`${name}\`.`);
  }

  if (args.shift() !== name) {
    throw new Error(
      `Start the command with \`${name}\`, as in a terminal. For example: ${program.example(file)}`
    );
  }

  const noInput = args.some((a) => program.noInput.includes(a));

  if (!noInput && !args.includes(file)) {
    throw new Error(
      `${name} needs a file to read. Add \`${file}\` at the end of the command.`
    );
  }

  if (args.every((a) => a === file || a.startsWith("-"))) {
    throw new Error(`${program.operand}: ${program.example(file)}`);
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

/** The text a program reads for an input. */
export const inputText = (test: CommandTest): string =>
  test.input_text ?? `${JSON.stringify(test.input, null, 2)}\n`;

/** An input as the app shows it. */
export const shownInput = (test: CommandTest | undefined): string =>
  test?.input_text?.trimEnd() ?? showJson(test?.input);

interface Ran {
  /** What the program printed, without trailing blank space. */
  output: string;
  /** The program's own error text, or null when it ran cleanly. */
  error: string | null;
}

/** An empty folder to run commands in, so a file name in a command finds nothing by accident. */
let scratch: string | undefined;

const scratchDir = (): string => {
  scratch ??= mkdtempSync(path.join(tmpdir(), "tech-prep-command-"));

  return scratch;
};

process.on("exit", () => {
  if (scratch) {
    rmSync(scratch, { force: true, recursive: true });
  }
});

/**
 * Run a program in the scratch folder. With a `file`, the input is written there under that
 * name for the command to read, as it would be in a terminal. Otherwise it goes to standard
 * input.
 */
const spawn = (
  name: string,
  args: string[],
  input: string,
  file?: string
): Ran => {
  const program = programOf(name);

  if (file) {
    writeFileSync(path.join(scratchDir(), file), input);
  }

  const proc = spawnSync(name, args, {
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
        ? `${name} is not installed. ${program.install}`
        : `${name} did not finish: ${proc.error.message}`,
      output: "",
    };
  }

  const stderr = program.tidyError(proc.stderr.trim());

  return {
    error: proc.status === 0 && !stderr ? null : stderr || `${name} failed.`,
    output: proc.stdout.trimEnd(),
  };
};

/** Where a command runs: the program it must start with and the file it reads. */
interface Setting {
  program: string;
  file: string;
}

/** Run a typed command on one input. */
export const runCommand = (
  { program, file }: Setting,
  text: string,
  test: CommandTest
): Ran => {
  try {
    return spawn(program, argsFor(program, file, text), inputText(test), file);
  } catch (error) {
    return {
      error: error instanceof Error ? error.message : String(error),
      output: "",
    };
  }
};

/**
 * One compact JSON value per line with sorted keys, or null when the text is not JSON. jq
 * does the reading, so text that jq printed is read exactly as jq wrote it.
 */
export const jsonValues = (text: string): string | null => {
  const ran = spawn("jq", ["-cS", "."], text);

  return ran.error ? null : ran.output;
};

/** True when two outputs say the same thing, by the check's way of comparing. */
const sameOutput = (
  compare: CommandCheck["compare"],
  got: string,
  want: string
): boolean => {
  if (got.trimEnd() === want.trimEnd()) {
    return true;
  }

  if (compare === "text") {
    return false;
  }

  const [a, b] = [jsonValues(got), jsonValues(want)];

  return a !== null && a === b;
};

/** What the learner's text prints on the shown input, for the live output panel. */
const preview = (check: CommandCheck, text: string): Preview => {
  const [shown] = check.tests;

  // Nothing typed yet is not an error.
  if (!shown || !text.trim()) {
    return { error: null, matches: false, output: "" };
  }

  const ran = runCommand(check, text, shown);

  return {
    error: ran.error,
    matches:
      !ran.error && sameOutput(check.compare, ran.output, shown.expected ?? ""),
    output: ran.output,
  };
};

/**
 * Build a command check:
 * 1. The reference runs on every test input. What it prints becomes `expected`.
 * 2. The starting text must not already solve the exercise.
 * 3. The inputs must not all give the same output, so a fixed answer cannot pass.
 */
const build = (check: CommandCheck): Built<CommandCheck> => {
  if (!PROGRAMS.has(check.program)) {
    return {
      check,
      errors: [
        `\`program\`: the app cannot run '${check.program}'. It runs: ${known()}`,
      ],
    };
  }

  if (!check.reference.trim()) {
    return { check, errors: ["`reference` is missing"] };
  }

  if (check.tests.length < MIN_TESTS) {
    return { check, errors: [`needs at least ${MIN_TESTS} tests`] };
  }

  const errors: string[] = [];
  const start = check.start?.trim() ?? "";
  let startPasses = true;

  const tests = check.tests.map((test, i): CommandTest => {
    if (test.input === undefined && test.input_text === undefined) {
      errors.push(`test ${i + 1}: needs \`input\` or \`input_text\``);

      return test;
    }

    const ran = runCommand(check, check.reference, test);

    if (ran.error) {
      errors.push(`test ${i + 1}: the reference fails: ${ran.error}`);

      return test;
    }

    const tried = start ? runCommand(check, start, test) : null;

    if (
      !tried ||
      tried.error ||
      !sameOutput(check.compare, tried.output, ran.output)
    ) {
      startPasses = false;
    }

    return { ...test, expected: ran.output };
  });

  if (errors.length) {
    return { check, errors };
  }

  if (startPasses) {
    errors.push("the starting text already solves the exercise");
  }

  // A command that reads no input always prints the same thing; say so with `"constant": true`.
  if (new Set(tests.map((t) => t.expected)).size === 1 && !check.constant) {
    errors.push(
      "every test gives the same output, so a fixed answer would pass"
    );
  }

  return { check: { ...check, tests }, errors };
};

export const commandChecker: Checker<CommandCheck> = {
  build,
  grader: "engine",
  inCourse: true,
  key: (check) => check.reference,
  language: (check) => check.program,
  minutes: { easy: 2, hard: 6, medium: 4 },
  preview,
  ready: (check) =>
    check.tests.length > 0 &&
    check.tests.every((t) => t.expected !== undefined),
  retakeFromStart: true,
  run: (check, answer) => {
    const { text } = answer;

    if (text === null) {
      return unsaved(answer, check.tests.length);
    }

    const cases = check.tests.map((test, index): CaseResult => {
      const ran = runCommand(check, text, test);
      const expected = test.expected ?? "";

      return {
        actual: ran.output,
        args: [test.input_text ?? test.input],
        error: ran.error ?? undefined,
        expected,
        index,
        ok: !ran.error && sameOutput(check.compare, ran.output, expected),
      };
    });

    return {
      cases,
      passed: cases.filter((c) => c.ok).length,
      total: cases.length,
    };
  },
  start: (check) => check.start ?? "",
  tutor: (check) => {
    const [shown] = check.tests;

    return shown
      ? {
          answer_is: `the whole ${check.program} command, as in a terminal, reading the file ${check.file}`,
          input: inputText(shown),
          input_file: check.file,
          wanted_output: shown.expected,
        }
      : null;
  },
  view: (check) => {
    const [shown] = check.tests;

    return {
      file: check.file,
      hidden: check.tests.length - 1,
      input: shownInput(shown),
      program: check.program,
      type: "command",
      wanted: shown?.expected ?? "",
    };
  },
};
