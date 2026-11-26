// The value check: the learner reads something and types the value that comes out of it.
// What they read is a command on an input, or a small program. Nothing runs while they type.

import { z } from "zod";

import { outputOf, sameReading } from "../program.ts";
import type { RunResult } from "../runner.ts";
import {
  CommandInput,
  inputText,
  jsonValues,
  runCommand,
  shownInput,
} from "./command.ts";
import type { Built, Checker, Shown } from "./types.ts";

/** A command on an input. The learner works out what it prints. */
// oxlint-disable-next-line sort-keys -- written back to the exercise's file in this order
const CommandSource = z.object({
  run: z.literal("command"),
  program: z.string(),
  command: z.string(),
  /** The file the input is in. */
  file: z.string(),
  ...CommandInput,
  /** Show the command. Left out, the exercise asks a question about the input alone. */
  show_command: z.boolean().optional(),
});

/** A small program. The learner works out what it prints. */
// oxlint-disable-next-line sort-keys -- written back to the exercise's file in this order
const CodeSource = z.object({
  run: z.literal("code"),
  language: z.string(),
  code: z.string(),
  /** Files the code imports, by name. They are shown beside the code, which is `main_file`. */
  files: z.record(z.string(), z.string()).optional(),
  /** What the code's own file is called on screen when it imports others, such as "main.js". */
  main_file: z.string().optional(),
});

// oxlint-disable-next-line sort-keys -- written back to the exercise's file in this order
export const valueCheck = z.object({
  type: z.literal("value"),
  /**
   * "json": the answer is compared as a JSON value, so spacing does not matter.
   * "loose": compared as a person reads it, so spacing, case and quote style do not matter.
   */
  compare: z.enum(["json", "loose"]),
  source: z.discriminatedUnion("run", [CommandSource, CodeSource]),
  /** What comes out. The build fills it in by running the source. */
  expected: z.string().optional(),
});

export type ValueCheck = z.infer<typeof valueCheck>;

/** What the learner's value is checked against, in words they can act on. */
const mistake = (check: ValueCheck, text: string): string | undefined => {
  if (!text.trim()) {
    return "Type the value you think comes out.";
  }

  return check.compare === "json" && jsonValues(text) === null
    ? 'This is not valid JSON. Text needs double quotes, like "Oslo". Check the brackets and commas too.'
    : undefined;
};

const matches = (check: ValueCheck, text: string): boolean => {
  const expected = check.expected ?? "";

  return check.compare === "json"
    ? jsonValues(text) === jsonValues(expected)
    : sameReading(text, expected);
};

const run = (check: ValueCheck, text: string): RunResult => {
  const error = mistake(check, text);
  const ok = !error && matches(check, text);
  const { source } = check;

  return {
    cases: [
      {
        actual: text.trim(),
        args:
          source.run === "command" ? [source.input_text ?? source.input] : [],
        error,
        expected: check.expected ?? "",
        index: 0,
        ok,
      },
    ],
    passed: ok ? 1 : 0,
    total: 1,
  };
};

/** Run the source to find what comes out. */
const build = (check: ValueCheck): Built<ValueCheck> => {
  const { source } = check;

  if (source.run === "code") {
    try {
      return {
        check: {
          ...check,
          expected: outputOf(
            source.code.trim(),
            source.language,
            "The code",
            source.files
          ),
        },
        errors: [],
      };
    } catch (error) {
      return {
        check,
        errors: [error instanceof Error ? error.message : String(error)],
      };
    }
  }

  if (source.input === undefined && source.input_text === undefined) {
    return { check, errors: ["needs `input` or `input_text`"] };
  }

  const ran = runCommand(source, source.command, source);

  return ran.error
    ? { check, errors: [`the command fails: ${ran.error}`] }
    : { check: { ...check, expected: ran.output }, errors: [] };
};

const shown = ({ source }: ValueCheck): Shown[] => {
  if (source.run === "code") {
    // Code that imports other files is shown as a file among them, each under its name.
    return [
      { label: source.main_file ?? "Code", text: source.code },
      ...Object.entries(source.files ?? {}).map(([name, text]) => ({
        label: name,
        text,
      })),
    ];
  }

  return [
    { file: source.file, label: "Input", text: shownInput(source) },
    ...(source.show_command
      ? [{ label: "Command", text: source.command }]
      : []),
  ];
};

export const valueChecker: Checker<ValueCheck> = {
  build,
  grader: "engine",
  inCourse: true,
  // The answer is the value, not the command or the code that made it.
  key: (check) => check.expected ?? null,
  language: ({ source }) =>
    source.run === "command" ? source.program : "text",
  minutes: { easy: 2, hard: 6, medium: 4 },
  ready: (check) => check.expected !== undefined,
  retakeFromStart: true,
  run: (check, answer) => run(check, answer.text ?? ""),
  start: () => "",
  tutor: (check) => {
    const { source } = check;
    const answerIs = `the value that comes out, typed ${check.compare === "json" ? "as JSON" : "as it is printed"}. They cannot see the wanted output, so never state it.`;

    return source.run === "command"
      ? {
          answer_is: answerIs,
          input: inputText(source),
          input_file: source.file,
          wanted_output: check.expected,
        }
      : {
          answer_is: answerIs,
          code: source.code,
          files: source.files,
          wanted_output: check.expected,
        };
  },
  view: (check) => ({ shown: shown(check), type: "value" }),
};
