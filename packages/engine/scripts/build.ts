#!/usr/bin/env bun
// Builds and checks a course's exercises. It works the same for every course, because each
// exercise names the checker that builds it.
//
//   bun scripts/build.ts <slug...>             build these exercises
//   bun scripts/build.ts --all                 build every exercise and check every lesson
//   bun scripts/build.ts --course <id> ...     another course (the default is the open one)
//
// A lesson's guided exercises have the slugs `guided-<concept id>`, `guided-<concept id>.2`
// and so on.
//
// For each exercise, its checker fills in the answers from the reference (a test's
// `expected`, for example) and reports what is wrong. A changed exercise is written back.

import { existsSync, readFileSync, writeFileSync } from "node:fs";
import path from "node:path";

import { checkerFor } from "../src/checks/index.ts";
import {
  concepts,
  courseById,
  exerciseDir,
  guidedSlugs,
  lessonsDir,
  problemEntry,
  problemIndex,
  savedCourse,
  soloSlugs,
} from "../src/content.ts";
import type { Course } from "../src/content.ts";
import {
  definitionFile,
  readDefinition,
  statementFile,
} from "../src/exercises.ts";
import type { Definition } from "../src/exercises.ts";
import { TASK_MARKER } from "../src/lessons.ts";

/** `exercise.json` as text. A function check's tests take one line each, so they diff well. */
const format = (definition: Definition): string => {
  const { check } = definition;

  if (check.type !== "function") {
    return `${JSON.stringify(definition, null, 2)}\n`;
  }

  const MARK = "@@TESTS@@";

  const head = JSON.stringify(
    { ...definition, check: { ...check, tests: MARK } },
    null,
    2
  );

  const lines = check.tests
    .map((test) => `      ${JSON.stringify(test)}`)
    .join(",\n");

  // A function replacement, so a `$` in a test is kept as written.
  return `${head.replace(`"${MARK}"`, () => `[\n${lines}\n    ]`)}\n`;
};

/** Build one exercise. Returns what is wrong with it. */
const build = (course: Course, slug: string): string[] => {
  const dir = exerciseDir(course, slug);
  const info = problemEntry(course, slug);

  const missing = [definitionFile(dir), statementFile(dir)].flatMap((file) =>
    existsSync(file) ? [] : [`missing ${path.basename(file)}`]
  );

  if (missing.length) {
    return missing;
  }

  const { definition, errors } = readDefinition(dir);

  if (!definition) {
    return errors;
  }

  if (!definition.title?.trim() && !info.title?.trim()) {
    errors.push("`title` is missing");
  }

  if (!readFileSync(statementFile(dir), "utf-8").trim()) {
    errors.push("statement.md is empty");
  }

  const checking = checkerFor(definition.check);

  if (!checking.inCourse) {
    return [
      ...errors,
      `a '${definition.check.type}' check cannot be used in a course yet. The tutor shows it as an extra exercise`,
    ];
  }

  const built = checking.build({ concepts: info.concepts, dir });

  // Written back only when the build changed something, so an untouched file stays as it is.
  if (
    !built.errors.length &&
    JSON.stringify(built.check) !== JSON.stringify(definition.check)
  ) {
    writeFileSync(
      definitionFile(dir),
      format({ ...definition, check: built.check })
    );
  }

  return [...errors, ...built.errors];
};

/** Check a lesson's text against its exercises. Returns what is wrong with it. */
const checkLesson = (course: Course, id: string): string[] => {
  const errors: string[] = [];
  const file = path.join(lessonsDir(course), id, "lesson.md");
  const guided = guidedSlugs(course, id);

  if (existsSync(file)) {
    const parts = readFileSync(file, "utf-8").split(TASK_MARKER).length - 1;

    // A lesson with one guided exercise needs no marker.
    if (parts !== guided.length && !(guided.length === 1 && parts === 0)) {
      errors.push(
        `lesson.md has ${parts} "${TASK_MARKER}" lines and the lesson has ${guided.length} guided exercises`
      );
    }
  } else {
    errors.push("lesson.md is missing");
  }

  for (const slug of [...guided, ...soloSlugs(course, id)]) {
    if (!existsSync(definitionFile(exerciseDir(course, slug)))) {
      errors.push(`exercise ${slug} is not written`);
    }
  }

  return errors;
};

const args = process.argv.slice(2);

// `--course <id>` builds another course. The default is the course that is open.
const target =
  args[0] === "--course" ? courseById(args[1] ?? "") : savedCourse();

if (args[0] === "--course") {
  args.splice(0, 2);
}

const all = args[0] === "--all";

// `--all` builds the exercises that exist. A course may list some that are not written yet.
const slugs = all
  ? [
      ...problemIndex(target).map((p) => p.slug),
      ...concepts(target).flatMap((c) => guidedSlugs(target, c.id)),
    ].filter((slug) => existsSync(exerciseDir(target, slug)))
  : args;

if (!slugs.length) {
  console.log("usage: bun scripts/build.ts [--course <id>] <slug...> | --all");
  process.exit(1);
}

let failed = 0;

const report = (name: string, errors: string[]): void => {
  if (errors.length) {
    failed += 1;
    console.log(
      `✗ ${name}\n${errors.map((e) => `  ${e.replaceAll("\n", "\n  ")}`).join("\n")}`
    );
  } else {
    console.log(`✓ ${name}`);
  }
};

for (const slug of slugs) {
  report(slug, build(target, slug));
}

// A lesson is checked once it has a folder. A concept may be listed before its lesson exists.
const lessons = all
  ? concepts(target)
      .map((c) => c.id)
      .filter((id) => existsSync(path.join(lessonsDir(target), id)))
  : [];

for (const id of lessons) {
  report(`lesson ${id}`, checkLesson(target, id));
}

const total = slugs.length + lessons.length;

console.log(`\n${total - failed}/${total} OK`);

process.exit(failed ? 1 : 0);
