// Extra exercises: ones the tutor writes on the spot when the learner asks for more
// practice. They are checked by the same checkers as a course's exercises. What differs is
// where they sit: an extra is shown once, in place of the last one, and the first answer is
// the evidence. The engine builds each one before it is shown, so an exercise with a wrong
// answer key never reaches the learner.

import { anyCheck, checkerFor } from "./checks/index.ts";
import type { Check, Checking } from "./checks/index.ts";
import { concept } from "./content.ts";
import type { Course, Language } from "./content.ts";
import {
  atomically,
  closeExtras,
  extraRow,
  insertExtra,
  openExtra,
  saveExtraResponse,
  saveExtraResults,
} from "./db.ts";
import type { Confidence, ExtraRow, Result } from "./db.ts";
import { grade } from "./grading.ts";
import type { ConceptResult } from "./grading.ts";
import { applyResults } from "./outcomes.ts";
import type { Applied } from "./outcomes.ts";
import { DEFAULT_LANGUAGE } from "./program.ts";
import { MAX_TARGETS, isPassed } from "./scheduler.ts";

/** An extra as the tutor writes it: one of four kinds, with the fields that kind needs. */
export interface Draft {
  kind: "example" | "predict" | "arrange" | "answer";
  /** The language of the code. The learner's usual one when left out. */
  language?: Language;
  /** Example and predict: the code to read. */
  code?: string;
  /** Arrange: the lines in the right order. */
  lines?: string[];
  /** Arrange: lines that look useful but are not needed. */
  distractors?: string[];
  /** Answer: the key points per concept. */
  rubric?: { concept_id: string; points: string[] }[];
  /** Answer: a complete answer, shown to the learner after grading. */
  modelAnswer?: string;
}

const codeOf = (draft: Draft): string => {
  const code = draft.code?.trim();

  if (!code) {
    throw new Error(`A ${draft.kind} exercise needs \`code\`.`);
  }

  return code;
};

/** The check behind each kind of extra the tutor can write. */
const DRAFTS: Record<
  Draft["kind"],
  (draft: Draft, language: Language) => Check
> = {
  answer: (draft) => ({
    model_answer: draft.modelAnswer ?? "",
    rubric: draft.rubric ?? [],
    type: "answer",
  }),
  arrange: (draft, language) => ({
    distractors: draft.distractors ?? [],
    language,
    lines: draft.lines ?? [],
    type: "arrange",
  }),
  // An example is only read.
  example: (draft, language) => ({
    code: codeOf(draft),
    language,
    type: "read",
  }),
  // A predict exercise asks what the code prints.
  predict: (draft, language) => ({
    compare: "loose",
    source: { code: codeOf(draft), language, run: "code" },
    type: "value",
  }),
};

/** How a drafted extra is checked. */
export const checkOfDraft = (draft: Draft): Check =>
  DRAFTS[draft.kind](draft, draft.language ?? DEFAULT_LANGUAGE);

export interface ExtraInput {
  conceptIds: string[];
  title: string;
  /** What the learner is asked, in one or two short sentences. Markdown. */
  prompt: string;
  /** How the answer is checked. The build fills in what the engine can work out. */
  check: Check;
}

/** Check an extra exercise, store it and put it on screen in place of the last one. */
export const showExtra = (course: Course, input: ExtraInput) => {
  if (new Set(input.conceptIds).size !== input.conceptIds.length) {
    throw new Error("A concept is listed twice.");
  }

  if (input.conceptIds.length < 1 || input.conceptIds.length > MAX_TARGETS) {
    throw new Error(`An exercise targets 1 to ${MAX_TARGETS} concepts.`);
  }

  for (const id of input.conceptIds) {
    concept(course, id);
  }

  const built = checkerFor(input.check).build({
    concepts: input.conceptIds,
    dir: null,
  });

  const [error] = built.errors;

  if (error) {
    throw new Error(error);
  }

  const { check } = built;
  const now = new Date();
  closeExtras(course, now);

  const id = insertExtra(
    course,
    {
      concepts: JSON.stringify(input.conceptIds),
      definition: JSON.stringify(check),
      prompt: input.prompt.trim(),
      title: input.title.trim(),
    },
    now
  );

  return {
    exercise_id: id,
    note:
      checkerFor(check).grader === "nobody"
        ? "On screen. Explain it in chat."
        : "On screen. Wait for the learner to submit; the app tells you the result.",
    type: check.type,
    /** What the code prints, when the answer came from running code. */
    verified_output: "expected" in check ? (check.expected ?? null) : null,
  };
};

/** How an extra's answer is checked. Throws for a row saved before checks were stored. */
const checkingOf = (row: ExtraRow): Checking => {
  const parsed = anyCheck.safeParse(JSON.parse(row.definition));

  if (!parsed.success) {
    throw new Error(
      `Exercise ${row.id} was made by an older version of the app and cannot be opened.`
    );
  }

  return checkerFor(parsed.data);
};

// SAFETY: only `showExtra` writes this column, as a list of concept ids.
const targetsOf = (row: ExtraRow): string[] =>
  JSON.parse(row.concepts) as string[];

// SAFETY: only `finish` writes this column, as the applied results.
const resultsOf = (row: ExtraRow): Applied[] | null =>
  row.results ? (JSON.parse(row.results) as Applied[]) : null;

const statusOf = (row: ExtraRow): "open" | "submitted" | "graded" => {
  if (row.graded_at) {
    return "graded";
  }

  return row.submitted_at ? "submitted" : "open";
};

/** An extra exercise as the app shows it. The answer key appears only once it is graded. */
export const extraView = (course: Course, row: ExtraRow) => {
  const checking = checkingOf(row);
  const graded = Boolean(row.graded_at);
  const results = resultsOf(row);
  const targets = targetsOf(row);
  // A review must not name its concepts, so they show only once it is graded.
  const labelled = graded || !targets.every((id) => isPassed(course, id));

  return {
    check: checking.view(),
    concepts: (labelled ? targets : []).map((id) => ({
      effect: results?.find((r) => r.concept === id)?.effect ?? null,
      id,
      name: concept(course, id).name,
      result: results?.find((r) => r.concept === id)?.result ?? null,
    })),
    confidence: row.confidence,
    correct: results ? results.every((r) => r.result === "pass") : null,
    correct_answer: graded ? checking.key(checking.language(), null) : null,
    id: row.id,
    prompt: row.prompt,
    response: row.response,
    status: statusOf(row),
    title: row.title,
  };
};

export type ExtraView = ReturnType<typeof extraView>;

/** True when the extra on screen can take a hint: it is open and has an answer to find. */
export const takesHint = (row: ExtraRow): boolean =>
  !row.graded_at && checkingOf(row).grader !== "nobody";

const finish = (
  course: Course,
  row: ExtraRow,
  results: ConceptResult[],
  now: Date
): ReturnType<typeof applyResults> =>
  // The reviews, the concepts and the exercise's results are saved together or not at all.
  atomically(course, () => {
    const applied = applyResults(course, {
      fromProblem: false,
      now,
      recognitionOk: true,
      results,
      source: { extraId: row.id },
    });

    saveExtraResults(course, row.id, JSON.stringify(applied.concepts), now);

    return applied;
  });

/**
 * Take the learner's answer. The first answer is the evidence, so an extra is submitted
 * once. The engine grades what it can check; an open answer waits for the tutor.
 */
export const submitExtra = (
  course: Course,
  id: number,
  response: string | string[],
  confidence: Confidence | null
) => {
  const row = extraRow(course, id);
  const checking = checkingOf(row);

  if (checking.grader === "nobody") {
    throw new Error("An example has nothing to submit.");
  }

  if (row.submitted_at) {
    throw new Error("This exercise was already submitted.");
  }

  const now = new Date();
  const text = Array.isArray(response) ? JSON.stringify(response) : response;

  saveExtraResponse(course, id, text, confidence, now);

  if (checking.grader === "tutor") {
    return { exercise_id: id, status: "submitted" as const };
  }

  const run = checking.run({ file: "", language: checking.language(), text });
  const correct = !run.fatal && run.passed === run.total;

  const applied = finish(
    course,
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
  course: Course,
  id: number,
  verdicts: { concept_id: string; result: Result; reason?: string }[]
) => {
  const row = extraRow(course, id);

  if (checkingOf(row).grader !== "tutor") {
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
    course,
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

/** What the tutor needs to grade or discuss the extra on screen, answer key included. */
export const currentExtra = (course: Course) => {
  const row = openExtra(course);

  if (!row) {
    return null;
  }

  return { ...extraView(course, row), answer_key: checkingOf(row).tutor() };
};
