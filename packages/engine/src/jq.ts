// The jq task type. The learner types a whole jq command, as in a terminal. It runs on each
// test input, and what it prints is compared with what the reference command printed.

import { spawnSync } from "node:child_process";
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
  guidedConcept,
  guidedNumber,
  lessonsDir,
  problemsDir,
  readJson,
} from "./content.ts";
import type { Course, ProblemInfo } from "./content.ts";
import type { CaseResult, RunResult } from "./runner.ts";
import type { Preview, Problem, TaskType } from "./tasks.ts";

/** One input a jq task is checked on, with the output the reference filter gives. */
export interface JqTest {
  /** The input as JSON. */
  input?: unknown;
  /** The input as raw text, for line-delimited JSON and `-R` tasks. */
  input_text?: string;
  expected?: string;
}

/**
 * How a jq task is written. The learner always types the whole command, as in a terminal:
 * `jq 'filter' data.json`. The mode says what the task's `reference` and `stub` hold.
 * - filter: the filter alone. The engine adds `jq`, the quotes and the file name.
 * - command: everything after `jq` except the file name, flags included. The output text
 *   must then match exactly, because the flags are the point.
 * - predict: a filter. The learner reads the input, and the command when it is shown, and
 *   types the value that comes out. Nothing runs while they type.
 */
export type JqMode = "filter" | "command" | "predict";

/** A jq task as its file holds it. */
export interface JqTask {
  title?: string;
  /** The task, in the statement subset of Markdown. */
  statement: string;
  mode?: JqMode;
  /** Flags a filter task's command needs, such as `["-r"]`. The learner types them. */
  flags?: string[];
  /** The file the input is in. `data.json` when left out. */
  file?: string;
  /**
   * What the editor starts with, in the same form as `reference`. Left out, the editor
   * starts empty and the learner types the whole command.
   */
  stub?: string;
  /** The answer key: a filter, or the text after `jq` in command mode. */
  reference: string;
  /** In a predict task: show the command, so the learner works out what it prints. */
  show_filter?: boolean;
  /** The first test is the one shown to the learner. The others are hidden. */
  tests: JqTest[];
  /** True when the output cannot depend on the input, as with `-n`. */
  constant?: boolean;
}

/** The jq part of a problem. */
export interface JqSpec {
  /** True when the learner types the output and not a command. */
  predict: boolean;
  /** True when the output text must match exactly. Otherwise outputs are compared as values. */
  exact: boolean;
  /** The name of the file the input is in. The learner's command reads it. */
  file: string;
  tests: JqTest[];
  /** The command a predict task shows, when it shows one. */
  shown: string | null;
}

const NO_INPUT = /(?:^|\s)(?:-n|--null-input)(?:\s|$)/u;

/** The file a jq task's input is in. */
const jqFile = (task: JqTask): string =>
  task.file ??
  (task.tests[0]?.input_text === undefined ? "data.json" : "data.jsonl");

/**
 * The whole command for a task's filter, or for its text after `jq`: what a learner would
 * type in a terminal. A command that reads no input gets no file name.
 */
export const jqCommand = (task: JqTask, text: string): string => {
  const head =
    task.mode === "command"
      ? text
      : [...(task.flags ?? []), `'${text}'`].join(" ");

  return `jq ${head}${NO_INPUT.test(head) ? "" : ` ${jqFile(task)}`}`;
};

/** What the editor starts with: empty, or a whole command to change. */
export const jqProblemStub = (task: JqTask): string => {
  const stub = task.stub?.trim() ?? "";

  // `.` and `'.'` are the "nothing yet" filters: the learner then starts from an empty line.
  return !stub || stub === "." || stub === "'.'" || task.mode === "predict"
    ? ""
    : jqCommand(task, stub);
};

/** How a jq task is run and checked. */
export const jqSpec = (task: JqTask): JqSpec => ({
  exact: task.mode === "command" || Boolean(task.flags?.length),
  file: jqFile(task),
  predict: task.mode === "predict",
  shown:
    task.mode === "predict" && task.show_filter
      ? jqCommand(task, task.reference)
      : null,
  tests: task.tests,
});

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
export const runJq = (spec: JqSpec, text: string): RunResult => {
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
export const previewJq = (spec: JqSpec, text: string): Preview => {
  const [shown] = spec.tests;

  // Nothing typed yet is not an error, and a predict task shows no output at all.
  if (!shown || !text.trim() || spec.predict) {
    return { error: null, matches: false, output: "" };
  }

  const ran = runOnce(spec, text, shown);

  return {
    error: ran.error,
    matches: !ran.error && sameOutput(spec, ran.output, shown.expected ?? ""),
    output: ran.output,
  };
};

/** A jq task's file content, or null when it is not written. */
const taskFile = (course: Course, slug: string): JqTask | null => {
  const conceptId = guidedConcept(slug);

  // A lesson's guided tasks share one file, in order.
  if (conceptId) {
    const file = path.join(lessonsDir(course), conceptId, "guided.json");

    return existsSync(file)
      ? (readJson<JqTask[]>(file)[guidedNumber(slug) - 1] ?? null)
      : null;
  }

  const file = path.join(problemsDir(course), `${slug}.json`);

  return existsSync(file) ? readJson<JqTask>(file) : null;
};

/** A jq task as a problem: its command is its only "language", and its tests are jq runs. */
interface JqProblem extends Problem {
  jq: JqSpec;
}

/** Every jq task read so far, per course. */
const loaded = new WeakMap<Course, Map<string, JqProblem>>();

const load = (course: Course, info: ProblemInfo): JqProblem => {
  const cached = loaded.get(course)?.get(info.slug);

  if (cached) {
    return cached;
  }

  const task = taskFile(course, info.slug);

  if (!task) {
    throw new Error(`Task '${info.slug}' is not written yet.`);
  }

  const read: JqProblem = {
    ...info,
    jq: jqSpec(task),
    statement: task.statement,
    stubs: { jq: jqProblemStub(task) },
  };

  loaded.set(course, (loaded.get(course) ?? new Map()).set(info.slug, read));

  return read;
};

export const jqTasks: TaskType = {
  appView: (course, info) => {
    const spec = load(course, info).jq;
    const [shown] = spec.tests;
    const { predict } = spec;

    return {
      command: spec.shown,
      file: spec.file,
      hidden: predict ? 0 : spec.tests.length - 1,
      input: shown?.input_text?.trimEnd() ?? showJson(shown?.input),
      kind: "jq",
      predict,
      // A predict task asks for the output, so it is not sent.
      wanted: predict ? "" : (shown?.expected ?? ""),
    };
  },
  isAuthored: (course, slug) => {
    const task = taskFile(course, slug);

    return Boolean(
      task?.tests.length && task.tests.every((t) => t.expected !== undefined)
    );
  },
  language: "jq",
  load,
  minutes: { easy: 2, hard: 6, medium: 4 },
  noun: "tasks",
  preview: (course, info, text) => previewJq(load(course, info).jq, text),
  reference: (course, slug) => {
    const task = taskFile(course, slug);

    if (!task) {
      return null;
    }

    // The answer to a predict task is the output, not the command that made it.
    return task.mode === "predict"
      ? (task.tests[0]?.expected ?? null)
      : jqCommand(task, task.reference);
  },
  retakeFromStub: true,
  run: (course, info, _language, file) => {
    const spec = load(course, info).jq;

    return existsSync(file)
      ? runJq(spec, readFileSync(file, "utf-8"))
      : {
          cases: [],
          fatal: `Solution file not found: ${file}`,
          passed: 0,
          total: spec.tests.length,
        };
  },
  // The engine checks an exercise by running its code, and it runs TypeScript and Python only.
  runsExerciseCode: false,
  title: (course, slug) => taskFile(course, slug)?.title,
  tutorView: (course, info) => {
    const spec = load(course, info).jq;
    const [shown] = spec.tests;

    return shown
      ? {
          answer_is: spec.predict
            ? "the value that comes out, typed as JSON. They cannot see the wanted output, so never state it."
            : `the whole jq command, as in a terminal, reading the file ${spec.file}`,
          input: inputText(shown),
          input_file: spec.file,
          wanted_output: shown.expected,
        }
      : null;
  },
};
