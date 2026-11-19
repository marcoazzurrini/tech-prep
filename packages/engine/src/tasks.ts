// What a task is depends on the course: code checked by tests, or a jq command checked by
// its output. Each kind is one task type. The rest of the engine asks this module and never
// the course's kind, so a new kind of course is one more task type and nothing else.

import { codeTasks } from "./code.ts";
import { guidedSlugs, lessonText, problemEntry, soloSlugs } from "./content.ts";
import type {
  Course,
  CourseKind,
  Difficulty,
  Language,
  ProblemInfo,
} from "./content.ts";
import { jqTasks } from "./jq.ts";
import type { RunResult } from "./runner.ts";

/** A task that can be practised: its place in the curriculum, its text and its starting code. */
export interface Problem extends ProblemInfo {
  statement: string;
  /** What the editor starts with, for each language the task can be solved in. */
  stubs: Partial<Record<Language, string>>;
}

/** What the learner's text prints on the shown input, while they type. */
export interface Preview {
  output: string;
  error: string | null;
  matches: boolean;
}

/** What the app shows for a task beyond its statement. Each kind has its own workbench. */
export type TaskView =
  | { kind: "code" }
  | {
      kind: "jq";
      /** True when the learner types the value that comes out and not a command. */
      predict: boolean;
      /** The command a predict task asks about, when it shows one. */
      command: string | null;
      /** The file the input is in. The learner's command names it. */
      file: string;
      input: string;
      /** Empty in a predict task: finding it is the task. */
      wanted: string;
      /** How many inputs Submit checks beyond the one shown. */
      hidden: number;
    };

/** One kind of task: how it is read from a course's files, run and shown. */
export interface TaskType {
  /** The language a course of this kind is solved in. */
  language: Language;
  /** What the app calls the tasks of such a course. */
  noun: "problems" | "tasks";
  /** A rough time to solve one, for the review estimate. */
  minutes: Record<Difficulty, number>;
  /**
   * True when a task taken again starts from its starting text. With short tasks, the old
   * answer would give the new attempt away.
   */
  retakeFromStub: boolean;
  /** True when the engine can run a tutor-made exercise's code to check it. */
  runsExerciseCode: boolean;
  /** The title a task's own file gives, if any. */
  title: (course: Course, slug: string) => string | undefined;
  /** True when the task has a statement and tests, so it can be practised. */
  isAuthored: (course: Course, slug: string) => boolean;
  /** Read an authored task. The task type keeps what it read. */
  load: (course: Course, info: ProblemInfo) => Problem;
  /** The answer key, if one exists. */
  reference: (
    course: Course,
    slug: string,
    language: Language
  ) => string | null;
  /** Put the files a solution needs beside it in `dir`, for a kind that needs any. */
  prepare?: (dir: string, language: Language) => void;
  /** Run the solution in `file` on every test. */
  run: (
    course: Course,
    info: ProblemInfo,
    language: Language,
    file: string
  ) => RunResult;
  /** Run the learner's text on the shown input, when the kind shows output while typing. */
  preview?: (course: Course, info: ProblemInfo, text: string) => Preview;
  /** What the app shows beside the statement of an authored task. */
  appView: (course: Course, info: ProblemInfo) => TaskView;
  /** What the tutor is told about the task beyond its statement and the learner's code. */
  tutorView: (course: Course, info: ProblemInfo) => object | null;
}

const TYPES: Record<CourseKind, TaskType> = { code: codeTasks, jq: jqTasks };

/** The task type of a course. */
export const taskType = (course: Course): TaskType => TYPES[course.kind];

/** The language a course's tasks are written in. */
export const courseLanguage = (course: Course): Language =>
  taskType(course).language;

/** A problem's place in the curriculum, under the title its own file gives when it has one. */
export const problemInfo = (course: Course, slug: string): ProblemInfo => {
  const entry = problemEntry(course, slug);

  return {
    ...entry,
    // A task may leave its title out of the index when its own file holds it.
    title: taskType(course).title(course, slug) ?? entry.title ?? slug,
  };
};

/** True when the problem has a statement and tests, so it can be practised. */
export const isAuthored = (course: Course, slug: string): boolean =>
  taskType(course).isAuthored(course, slug);

/** True when a concept has its lesson text, its guided problems and its solo problems. */
export const hasLesson = (course: Course, conceptId: string): boolean =>
  lessonText(course, conceptId) !== null &&
  guidedSlugs(course, conceptId).every((s) => isAuthored(course, s)) &&
  soloSlugs(course, conceptId).every((s) => isAuthored(course, s));

/** An authored problem's place in the curriculum. Throws when it cannot be practised yet. */
const authored = (course: Course, slug: string): ProblemInfo => {
  const info = problemInfo(course, slug);

  if (!isAuthored(course, slug)) {
    throw new Error(`Problem '${slug}' has no tests yet.`);
  }

  return info;
};

export const problem = (course: Course, slug: string): Problem =>
  taskType(course).load(course, authored(course, slug));

/** What the app shows for a task beyond its statement. Null when it is not written yet. */
export const taskView = (course: Course, slug: string): TaskView | null =>
  isAuthored(course, slug)
    ? taskType(course).appView(course, problemInfo(course, slug))
    : null;

/** What the tutor is told about a task beyond its statement and the learner's code. */
export const tutorTaskView = (course: Course, slug: string): object | null =>
  taskType(course).tutorView(course, authored(course, slug));

/** What the learner's text prints on the shown input. Null for a kind that shows no output. */
export const previewTask = (
  course: Course,
  slug: string,
  text: string
): Preview | null =>
  taskType(course).preview?.(course, authored(course, slug), text) ?? null;

/** The tutor's answer key for a problem, if one exists. */
export const referenceSolution = (
  course: Course,
  slug: string,
  language: Language
): string | null => taskType(course).reference(course, slug, language);

/** Run the solution in `file` on every test of a problem. */
export const runTests = (
  course: Course,
  slug: string,
  language: Language,
  file: string
): RunResult =>
  taskType(course).run(course, authored(course, slug), language, file);
