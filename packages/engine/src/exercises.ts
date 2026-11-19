// Tutor-made exercises shown in the app: a worked example to read, predict the output,
// arrange the lines, and an open answer. The engine runs the code to find the answer key,
// so an exercise with a wrong key never reaches the learner.

import { spawnSync } from "node:child_process";
import { mkdtempSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import path from "node:path";

import { DEFAULT_LANGUAGE, EXTENSIONS, concept, course } from "./content.ts";
import type { Language } from "./content.ts";
import { closeExercises, exerciseRow, open, openExercise } from "./db.ts";
import type { Confidence, ExerciseKind, ExerciseRow, Result } from "./db.ts";
import { grade } from "./grading.ts";
import type { ConceptResult } from "./grading.ts";
import { applyResults } from "./outcomes.ts";
import type { Applied } from "./outcomes.ts";
import { ensureDataStructures } from "./runner.ts";
import { MAX_TARGETS, isPassed } from "./scheduler.ts";

const TIMEOUT_MS = 10_000;

/** Fewer lines than this leaves nothing to arrange. */
const MIN_ARRANGE_LINES = 3;

/** One key point the tutor checks an open answer against. */
interface RubricItem {
  concept_id: string;
  points: string[];
}

/** The hidden side of an exercise. */
type AnswerKey =
  | { kind: "example" }
  | { kind: "predict"; output: string }
  | { kind: "arrange"; solution: string[]; output: string }
  | { kind: "answer"; rubric: RubricItem[]; model_answer: string };

/** What the learner sees, and the key kept from them. */
interface Prepared {
  body: string;
  key: AnswerKey;
}

export interface ExerciseInput {
  kind: ExerciseKind;
  conceptIds: string[];
  language?: Language;
  title: string;
  /** What the learner is asked, in one or two short sentences. Markdown. */
  prompt: string;
  /** Example and predict: the code to read. */
  code?: string;
  /** Arrange: the lines in the right order. */
  lines?: string[];
  /** Arrange: lines that look useful but are not needed. */
  distractors?: string[];
  /** Answer: the key points per concept. */
  rubric?: RubricItem[];
  /** Answer: a complete answer, shown to the learner after grading. */
  modelAnswer?: string;
}

/** Run a small program on its own and capture what it prints. */
const execute = (source: string, language: Language) => {
  const dir = mkdtempSync(path.join(tmpdir(), "tp-exercise-"));

  try {
    ensureDataStructures(dir, language);
    const file = path.join(dir, `exercise.${EXTENSIONS[language]}`);
    writeFileSync(file, source);

    const [cmd, args]: [string, string[]] =
      language === "python"
        ? ["python3", ["-I", "-B", file]]
        : [process.execPath, [file]];

    const proc = spawnSync(cmd, args, {
      encoding: "utf-8",
      timeout: TIMEOUT_MS,
    });

    return {
      ok: proc.status === 0 && !proc.signal,
      stderr: (proc.stderr ?? "").trim(),
      stdout: (proc.stdout ?? "").trimEnd(),
      timedOut: proc.signal === "SIGTERM",
    };
  } finally {
    rmSync(dir, { force: true, recursive: true });
  }
};

/** The output of code that must run cleanly and print something. */
const outputOf = (source: string, language: Language, what: string): string => {
  const run = execute(source, language);

  if (run.timedOut) {
    throw new Error(`${what} does not finish. Remove the endless loop.`);
  }

  if (!run.ok) {
    throw new Error(`${what} does not run:\n${run.stderr}`);
  }

  if (!run.stdout.trim()) {
    throw new Error(
      `${what} prints nothing. Print the result, so there is an output to check.`
    );
  }

  return run.stdout;
};

/** Outputs are compared the way a person reads them: spacing and quote style do not matter. */
const tidy = (text: string): string =>
  text.replaceAll(/\s+/gu, "").replaceAll(/['`]/gu, '"').toLowerCase();

const sameOutput = (a: string, b: string): boolean => tidy(a) === tidy(b);

/** A random order that differs from the right one, so the exercise never starts solved. */
const shuffled = (solution: string[], distractors: string[]): string[] => {
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

/** Check the tutor's exercise and work out what the learner sees and the hidden key. */
const prepare = (input: ExerciseInput, language: Language): Prepared => {
  if (input.kind === "example" || input.kind === "predict") {
    if (!input.code?.trim()) {
      throw new Error(`A ${input.kind} exercise needs \`code\`.`);
    }

    const code = input.code.trim();

    if (input.kind === "predict") {
      return {
        body: code,
        key: { kind: "predict", output: outputOf(code, language, "The code") },
      };
    }

    const run = execute(code, language);

    if (!run.ok) {
      throw new Error(`The example does not run:\n${run.stderr}`);
    }

    return { body: code, key: { kind: "example" } };
  }

  if (input.kind === "arrange") {
    const solution = (input.lines ?? []).map((l) => l.trimEnd());
    const distractors = (input.distractors ?? []).map((l) => l.trimEnd());

    if (solution.length < MIN_ARRANGE_LINES) {
      throw new Error(
        `An arrange exercise needs at least ${MIN_ARRANGE_LINES} lines.`
      );
    }

    if (
      new Set([...solution, ...distractors]).size !==
      solution.length + distractors.length
    ) {
      throw new Error(
        "Two lines are the same. Every line and distractor must differ."
      );
    }

    const output = outputOf(solution.join("\n"), language, "The arranged code");

    return {
      body: JSON.stringify(shuffled(solution, distractors)),
      key: { kind: "arrange", output, solution },
    };
  }

  const rubric = input.rubric ?? [];
  const covered = new Set(rubric.map((r) => r.concept_id));

  if (
    covered.size !== input.conceptIds.length ||
    !input.conceptIds.every((id) => covered.has(id)) ||
    rubric.some((r) => r.points.length === 0)
  ) {
    throw new Error(
      "An answer exercise needs `rubric`: the key points for each concept in concept_ids, and no others."
    );
  }

  if (!input.modelAnswer?.trim()) {
    throw new Error("An answer exercise needs `model_answer`.");
  }

  return {
    body: "",
    key: { kind: "answer", model_answer: input.modelAnswer.trim(), rubric },
  };
};

/** Check an exercise, store it and put it on screen in place of the last one. */
export const showExercise = (input: ExerciseInput) => {
  if (new Set(input.conceptIds).size !== input.conceptIds.length) {
    throw new Error("A concept is listed twice.");
  }

  if (input.conceptIds.length < 1 || input.conceptIds.length > MAX_TARGETS) {
    throw new Error(`An exercise targets 1 to ${MAX_TARGETS} concepts.`);
  }

  for (const id of input.conceptIds) {
    concept(id);
  }

  // The engine checks an exercise by running its code, and it runs TypeScript and Python only.
  if (course().kind === "jq" && input.kind !== "answer") {
    throw new Error(
      "In the jq course only an 'answer' exercise can be shown. Explain with short jq examples in chat."
    );
  }

  const language = input.language ?? DEFAULT_LANGUAGE;
  const { body, key } = prepare(input, language);
  const now = new Date();
  closeExercises(now);

  const id = open()
    .query(
      `INSERT INTO exercises (kind, concepts, language, title, prompt, body, answer, created_at)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`
    )
    .run(
      input.kind,
      JSON.stringify(input.conceptIds),
      language,
      input.title.trim(),
      input.prompt.trim(),
      body,
      JSON.stringify(key),
      now.toISOString()
    ).lastInsertRowid;

  return {
    exercise_id: Number(id),
    kind: input.kind,
    note:
      input.kind === "example"
        ? "On screen. Explain it in chat."
        : "On screen. Wait for the learner to submit; the app tells you the result.",
    /** What the code prints, for predict and arrange. */
    verified_output:
      key.kind === "predict" || key.kind === "arrange" ? key.output : null,
  };
};

// SAFETY: only `showExercise` writes this column, as an AnswerKey.
const keyOf = (row: ExerciseRow): AnswerKey =>
  JSON.parse(row.answer) as AnswerKey;

// SAFETY: only `showExercise` writes this column, as a list of concept ids.
const targetsOf = (row: ExerciseRow): string[] =>
  JSON.parse(row.concepts) as string[];

// SAFETY: only `finish` writes this column, as the applied results.
const resultsOf = (row: ExerciseRow): Applied[] | null =>
  row.results ? (JSON.parse(row.results) as Applied[]) : null;

// SAFETY: for an arrange exercise, `showExercise` writes the shuffled lines here.
const linesOf = (row: ExerciseRow): string[] | null =>
  row.kind === "arrange" ? (JSON.parse(row.body) as string[]) : null;

const statusOf = (row: ExerciseRow): "open" | "submitted" | "graded" => {
  if (row.graded_at) {
    return "graded";
  }

  return row.submitted_at ? "submitted" : "open";
};

/** An exercise as the app shows it. The answer key appears only once it is graded. */
export const exerciseView = (row: ExerciseRow) => {
  const key = keyOf(row);
  const graded = Boolean(row.graded_at);
  const results = resultsOf(row);
  const targets = targetsOf(row);
  // A review must not name its concepts, so they show only once it is graded.
  const labelled = graded || !targets.every(isPassed);

  let correctAnswer: string | string[] | null = null;

  if (graded) {
    if (key.kind === "predict") {
      correctAnswer = key.output;
    } else if (key.kind === "arrange") {
      correctAnswer = key.solution;
    } else if (key.kind === "answer") {
      correctAnswer = key.model_answer;
    }
  }

  return {
    code: row.kind === "arrange" ? null : row.body || null,
    concepts: (labelled ? targets : []).map((id) => ({
      effect: results?.find((r) => r.concept === id)?.effect ?? null,
      id,
      name: concept(id).name,
      result: results?.find((r) => r.concept === id)?.result ?? null,
    })),
    confidence: row.confidence,
    correct: results ? results.every((r) => r.result === "pass") : null,
    correct_answer: correctAnswer,
    id: row.id,
    kind: row.kind,
    language: row.language,
    lines: linesOf(row),
    prompt: row.prompt,
    response: row.response,
    status: statusOf(row),
    title: row.title,
  };
};

export type ExerciseView = ReturnType<typeof exerciseView>;

const finish = (
  row: ExerciseRow,
  results: ConceptResult[],
  now: Date
): ReturnType<typeof applyResults> => {
  const applied = applyResults({
    fromProblem: false,
    now,
    recognitionOk: true,
    results,
    source: { exerciseId: row.id },
  });

  open()
    .query("UPDATE exercises SET results = ?, graded_at = ? WHERE id = ?")
    .run(JSON.stringify(applied.concepts), now.toISOString(), row.id);

  return applied;
};

/** Is the learner's arrangement right? Another order that prints the same also counts. */
const arrangedRight = (
  key: Extract<AnswerKey, { kind: "arrange" }>,
  chosen: string[],
  language: Language
): boolean => {
  if (chosen.join("\n") === key.solution.join("\n")) {
    return true;
  }

  const sameLines =
    chosen.length === key.solution.length &&
    chosen.every((line) => key.solution.includes(line));

  if (!sameLines) {
    return false;
  }

  const run = execute(chosen.join("\n"), language);

  return run.ok && sameOutput(run.stdout, key.output);
};

/**
 * Take the learner's answer. The first answer is the evidence, so an exercise is submitted
 * once. Predict and arrange are graded here; an open answer waits for the tutor.
 */
export const submitExercise = (
  id: number,
  response: string | string[],
  confidence: Confidence | null
) => {
  const row = exerciseRow(id);

  if (row.kind === "example") {
    throw new Error("An example has nothing to submit.");
  }

  if (row.submitted_at) {
    throw new Error("This exercise was already submitted.");
  }

  const now = new Date();
  const key = keyOf(row);
  const text = Array.isArray(response) ? JSON.stringify(response) : response;

  open()
    .query(
      "UPDATE exercises SET response = ?, confidence = ?, submitted_at = ? WHERE id = ?"
    )
    .run(text, confidence, now.toISOString(), id);

  if (key.kind === "answer") {
    return { exercise_id: id, status: "submitted" as const };
  }

  // SAFETY: `showExercise` stores the language as a Language.
  const language = row.language as Language;

  const correct =
    key.kind === "predict"
      ? sameOutput(String(response), key.output)
      : key.kind === "arrange" &&
        Array.isArray(response) &&
        arrangedRight(key, response, language);

  const applied = finish(
    row,
    grade({
      correct,
      maxHintLevel: row.max_hint_level,
      targets: targetsOf(row),
    }),
    now
  );

  return {
    ...applied,
    // A wrong answer given with confidence is the clearest sign of a wrong mental model.
    confident_miss: !correct && confidence === "high",
    correct,
    exercise_id: id,
    status: "graded" as const,
  };
};

/** The tutor's reading of an open answer: pass or fail for each concept. */
export const gradeAnswer = (
  id: number,
  verdicts: { concept_id: string; result: Result; reason?: string }[]
) => {
  const row = exerciseRow(id);

  if (row.kind !== "answer") {
    throw new Error("Only open answers are graded by the tutor.");
  }

  if (!row.submitted_at) {
    throw new Error("The learner has not submitted an answer yet.");
  }

  if (row.graded_at) {
    throw new Error("This answer was already graded.");
  }

  const targets = targetsOf(row);
  const byConcept = new Map(verdicts.map((v) => [v.concept_id, v]));

  if (
    byConcept.size !== targets.length ||
    !targets.every((t) => byConcept.has(t))
  ) {
    throw new Error(
      `Give one verdict for each concept: ${targets.join(", ")}.`
    );
  }

  return finish(
    row,
    grade({
      correct: false,
      maxHintLevel: row.max_hint_level,
      targets,
      verdicts: byConcept,
    }),
    new Date()
  );
};

/** What the tutor needs to grade or discuss the exercise on screen, key included. */
export const currentExercise = () => {
  const row = openExercise();

  if (!row) {
    return null;
  }

  return { ...exerciseView(row), answer_key: keyOf(row) };
};
