// The arrange check: the learner puts the lines of a small program in order and sets the
// lines it does not need aside.

import { z } from "zod";

import { execute, outputOf, sameReading } from "../program.ts";
import type { Built, Checker } from "./types.ts";

/** Fewer lines than this leaves nothing to arrange. */
const MIN_LINES = 3;

// oxlint-disable-next-line sort-keys -- stored and shown to the tutor in this order
export const arrangeCheck = z.object({
  type: z.literal("arrange"),
  language: z.string(),
  /** The lines in the right order. */
  lines: z.array(z.string()),
  /** Lines that look useful but are not needed. */
  distractors: z.array(z.string()).default([]),
  /** The lines as the learner first sees them. The build mixes them. */
  shuffled: z.array(z.string()).optional(),
  /** What the arranged program prints. The build fills it in. */
  expected: z.string().optional(),
});

export type ArrangeCheck = z.infer<typeof arrangeCheck>;

/** A random order that differs from the right one, so the exercise never starts solved. */
const shuffle = (solution: string[], distractors: string[]): string[] => {
  const all = [...solution, ...distractors];

  for (let tries = 0; tries < 20; tries += 1) {
    const mixed = all
      .map((line) => ({ line, sort: Math.random() }))
      .toSorted((a, b) => a.sort - b.sort)
      .map((x) => x.line);

    if (mixed.slice(0, solution.length).join("\n") !== solution.join("\n")) {
      return mixed;
    }
  }

  return all.toReversed();
};

const build = (check: ArrangeCheck): Built<ArrangeCheck> => {
  const lines = check.lines.map((l) => l.trimEnd());
  const distractors = check.distractors.map((l) => l.trimEnd());

  if (lines.length < MIN_LINES) {
    return {
      check,
      errors: [`An arrange exercise needs at least ${MIN_LINES} lines.`],
    };
  }

  if (
    new Set([...lines, ...distractors]).size !==
    lines.length + distractors.length
  ) {
    return {
      check,
      errors: [
        "Two lines are the same. Every line and distractor must differ.",
      ],
    };
  }

  try {
    return {
      check: {
        ...check,
        distractors,
        expected: outputOf(
          lines.join("\n"),
          check.language,
          "The arranged code"
        ),
        lines,
        shuffled: shuffle(lines, distractors),
      },
      errors: [],
    };
  } catch (error) {
    return {
      check,
      errors: [error instanceof Error ? error.message : String(error)],
    };
  }
};

/** The lines the learner chose, in their order. Their answer is saved as a JSON list. */
const chosenLines = (text: string): string[] => {
  try {
    const parsed: unknown = JSON.parse(text);

    return Array.isArray(parsed) ? parsed.map(String) : [];
  } catch {
    return [];
  }
};

/** Is the arrangement right? Another order that prints the same also counts. */
const arrangedRight = (check: ArrangeCheck, chosen: string[]): boolean => {
  if (chosen.join("\n") === check.lines.join("\n")) {
    return true;
  }

  const sameLines =
    chosen.length === check.lines.length &&
    chosen.every((line) => check.lines.includes(line));

  if (!sameLines) {
    return false;
  }

  const ran = execute(chosen.join("\n"), check.language);

  return ran.ok && sameReading(ran.stdout, check.expected ?? "");
};

export const arrangeChecker: Checker<ArrangeCheck> = {
  build,
  grader: "engine",
  inCourse: false,
  key: (check) => check.lines.join("\n"),
  language: () => "json",
  minutes: { easy: 3, hard: 8, medium: 5 },
  ready: (check) =>
    check.expected !== undefined && check.shuffled !== undefined,
  retakeFromStart: true,
  run: (check, answer) => {
    const chosen = chosenLines(answer.text ?? "");
    const ok = arrangedRight(check, chosen);

    return {
      cases: [
        {
          actual: chosen.join("\n"),
          args: [],
          expected: check.lines.join("\n"),
          index: 0,
          ok,
        },
      ],
      passed: ok ? 1 : 0,
      total: 1,
    };
  },
  start: () => "",
  tutor: (check) => ({
    answer_is:
      "the lines in an order that runs and prints the wanted output, with the lines that are not needed set aside",
    distractors: check.distractors,
    solution: check.lines,
    wanted_output: check.expected,
  }),
  view: (check) => ({ lines: check.shuffled ?? [], type: "arrange" }),
};
