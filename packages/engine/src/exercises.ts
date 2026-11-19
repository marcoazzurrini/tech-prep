// A course's exercises: each one's place in the curriculum, its statement, and how its answer
// is checked. An exercise is a folder with `exercise.json` and `statement.md`, written the
// same way in every course. Its `check` names the checker, so nothing here or anywhere else
// in the engine asks what kind of course it is in.

import { existsSync, readFileSync } from "node:fs";
import path from "node:path";

import { z } from "zod";

import { anyCheck, checkerFor } from "./checks/index.ts";
import type { CheckView, Checking, Preview } from "./checks/index.ts";
import {
  exerciseDir,
  guidedSlugs,
  lessonText,
  problemEntry,
  soloSlugs,
} from "./content.ts";
import type { Course, Language, ProblemInfo } from "./content.ts";
import type { RunResult } from "./runner.ts";

/** `exercise.json` as an author writes it. */
// oxlint-disable-next-line sort-keys -- written back to the exercise's file in this order
const exerciseFile = z.object({
  /** May be left out when the curriculum's index holds the title. */
  title: z.string().optional(),
  check: anyCheck,
});

export type Definition = z.infer<typeof exerciseFile>;

/** What reading an exercise's file gave. `errors` says why it cannot be used. */
interface Read {
  definition: Definition | null;
  errors: string[];
}

export const definitionFile = (dir: string): string =>
  path.join(dir, "exercise.json");

export const statementFile = (dir: string): string =>
  path.join(dir, "statement.md");

export const readDefinition = (dir: string): Read => {
  try {
    const parsed = exerciseFile.safeParse(
      JSON.parse(readFileSync(definitionFile(dir), "utf-8"))
    );

    return parsed.success
      ? { definition: parsed.data, errors: [] }
      : {
          definition: null,
          errors: parsed.error.issues.map(
            (issue) =>
              `exercise.json: \`${issue.path.join(".")}\` ${issue.message}`
          ),
        };
  } catch (error) {
    return {
      definition: null,
      errors: [
        `exercise.json cannot be read: ${error instanceof Error ? error.message : String(error)}`,
      ],
    };
  }
};

/** An exercise that can be practised: its place in the curriculum and its text. */
export interface Problem extends ProblemInfo {
  statement: string;
}

/** An exercise as it was read from its folder. */
interface Loaded {
  title: string | undefined;
  statement: string;
  checking: Checking;
}

/** Every exercise read so far, per course. */
const loaded = new WeakMap<Course, Map<string, Loaded>>();

/**
 * Read an exercise's folder. Null when it is not written, cannot be read, or is not complete
 * yet: the build fills in the answers a check needs.
 */
const load = (course: Course, slug: string): Loaded | null => {
  const cached = loaded.get(course)?.get(slug);

  if (cached) {
    return cached;
  }

  const dir = exerciseDir(course, slug);

  if (!existsSync(definitionFile(dir)) || !existsSync(statementFile(dir))) {
    return null;
  }

  const { definition } = readDefinition(dir);

  if (!definition) {
    return null;
  }

  const checking = checkerFor(definition.check);

  // Some checks are for the tutor's extra exercises only.
  if (!checking.inCourse || !checking.ready()) {
    return null;
  }

  const read: Loaded = {
    checking,
    statement: readFileSync(statementFile(dir), "utf-8").trimEnd(),
    title: definition.title,
  };

  loaded.set(course, (loaded.get(course) ?? new Map()).set(slug, read));

  return read;
};

/** True when the exercise has a statement and a complete check, so it can be practised. */
export const isAuthored = (course: Course, slug: string): boolean =>
  load(course, slug) !== null;

/** An exercise's place in the curriculum, under the title its own file gives when it has one. */
export const problemInfo = (course: Course, slug: string): ProblemInfo => {
  const entry = problemEntry(course, slug);

  return {
    ...entry,
    // An exercise may leave its title out of the index when its own file holds it.
    title: load(course, slug)?.title ?? entry.title ?? slug,
  };
};

/** True when a concept has its lesson text, its guided exercises and its solo exercises. */
export const hasLesson = (course: Course, conceptId: string): boolean =>
  lessonText(course, conceptId) !== null &&
  guidedSlugs(course, conceptId).every((s) => isAuthored(course, s)) &&
  soloSlugs(course, conceptId).every((s) => isAuthored(course, s));

/** A written exercise. Throws when it cannot be practised yet. */
const authored = (course: Course, slug: string): Loaded => {
  // An unknown slug is reported as such, before anything is said about its files.
  problemEntry(course, slug);

  const read = load(course, slug);

  if (!read) {
    throw new Error(`Problem '${slug}' has no tests yet.`);
  }

  return read;
};

export const problem = (course: Course, slug: string): Problem => ({
  ...problemInfo(course, slug),
  statement: authored(course, slug).statement,
});

/** How an exercise's answer is checked. Throws when it is not written yet. */
export const checkingOf = (course: Course, slug: string): Checking =>
  authored(course, slug).checking;

/** What the app shows for an exercise beyond its statement. Null when it is not written yet. */
export const checkView = (course: Course, slug: string): CheckView | null =>
  load(course, slug)?.checking.view() ?? null;

/**
 * What an exercise's answer is written in. An exercise that is not written yet has none,
 * and gets plain text.
 */
export const problemLanguage = (course: Course, slug: string): Language =>
  load(course, slug)?.checking.language() ?? "text";

/** What the learner's text does on the shown input. Null for a check that shows nothing live. */
export const previewAnswer = (
  course: Course,
  slug: string,
  text: string
): Preview | null => checkingOf(course, slug).preview?.(text) ?? null;

/** The answer key for an exercise, if one exists. */
export const referenceSolution = (
  course: Course,
  slug: string,
  language: Language
): string | null =>
  load(course, slug)?.checking.key(language, exerciseDir(course, slug)) ?? null;

/** Check the answer saved in `file`. */
export const runTests = (
  course: Course,
  slug: string,
  language: Language,
  file: string
): RunResult =>
  checkingOf(course, slug).run({
    file,
    language,
    text: existsSync(file) ? readFileSync(file, "utf-8") : null,
  });
