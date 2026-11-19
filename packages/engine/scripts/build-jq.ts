#!/usr/bin/env bun
// Checks the tasks of a jq course and fills their expected outputs.
//
//   bun scripts/build-jq.ts <concept id ...>     the lessons of these concepts
//   bun scripts/build-jq.ts --all                every lesson
//   bun scripts/build-jq.ts --course <id> ...    another jq course (the default is "jq")
//
// For every task of a lesson (its guided tasks, its solo tasks and its review tasks):
// 1. The fields must be complete, and the lesson text must exist.
// 2. The reference runs on every test input. What it prints becomes `expected`.
// 3. The starting text must not already solve the task.
// 4. The hidden inputs must not all give the same output, so a fixed answer cannot pass.

import { existsSync, readFileSync, writeFileSync } from "node:fs";
import path from "node:path";

import {
  concept,
  concepts,
  course,
  guidedSlugs,
  problemIndex,
  setCourse,
} from "../src/content.ts";
import type { JqTask, JqTest } from "../src/content.ts";
import { runOnce, sameOutput } from "../src/jq.ts";

const MIN_TESTS = 3;

const args = process.argv.slice(2);
let courseId = "jq";

if (args[0] === "--course") {
  courseId = args[1] ?? "";
  args.splice(0, 2);
}

setCourse(courseId);

if (course().kind !== "jq") {
  console.log(`✗ '${courseId}' is not a jq course.`);
  process.exit(1);
}

// SAFETY: the files are authored to the JqTask shape, and `check` below reports what is missing.
const read = <T>(file: string): T =>
  JSON.parse(readFileSync(file, "utf-8")) as T;

const write = (file: string, value: JqTask | JqTask[]): void =>
  writeFileSync(file, `${JSON.stringify(value, null, 2)}\n`);

/** Fill a task's expected outputs from its reference. Returns what is wrong with it. */
const check = (task: JqTask): string[] => {
  const errors: string[] = [];

  if (!task.title?.trim()) {
    errors.push("`title` is missing");
  }

  if (!task.statement?.trim()) {
    errors.push("`statement` is missing");
  }

  if (!task.reference?.trim()) {
    return [...errors, "`reference` is missing"];
  }

  if (!Array.isArray(task.tests) || task.tests.length < MIN_TESTS) {
    return [...errors, `needs at least ${MIN_TESTS} tests`];
  }

  const spec = {
    flags: task.flags ?? [],
    mode: task.mode ?? "filter",
    tests: task.tests,
  };

  const stub = task.stub ?? (spec.mode === "filter" ? "." : "");
  let stubPasses = true;

  task.tests = task.tests.map((test, i): JqTest => {
    if (test.input === undefined && test.input_text === undefined) {
      errors.push(`test ${i + 1}: needs \`input\` or \`input_text\``);

      return test;
    }

    const ran = runOnce(spec, task.reference, test);

    if (ran.error) {
      errors.push(`test ${i + 1}: the reference fails: ${ran.error}`);

      return test;
    }

    const tried = stub.trim() ? runOnce(spec, stub, test) : null;

    if (!tried || tried.error || !sameOutput(spec, tried.output, ran.output)) {
      stubPasses = false;
    }

    return { ...test, expected: ran.output };
  });

  if (errors.length) {
    return errors;
  }

  if (stubPasses) {
    errors.push("the starting text already solves the task");
  }

  const outputs = new Set(task.tests.map((t) => t.expected));

  // A task with no input (`-n`) always prints the same thing; say so with `"constant": true`.
  if (outputs.size === 1 && !task.constant) {
    errors.push(
      "every test gives the same output, so a fixed answer would pass"
    );
  }

  return errors;
};

/** Build one lesson: its text, its guided tasks and the problems tagged with its concept first. */
const build = (id: string): string[] => {
  const errors: string[] = [];
  const dir = path.join(course().dir, "lessons", id);
  const guidedFile = path.join(dir, "guided.json");
  const wanted = guidedSlugs(id).length;

  concept(id);

  if (!existsSync(path.join(dir, "lesson.md"))) {
    errors.push("lesson.md is missing");
  }

  if (existsSync(guidedFile)) {
    const tasks = read<JqTask[]>(guidedFile);

    if (!Array.isArray(tasks) || tasks.length !== wanted) {
      errors.push(`guided.json needs exactly ${wanted} tasks`);
    } else {
      for (const [i, task] of tasks.entries()) {
        errors.push(...check(task).map((e) => `guided ${i + 1}: ${e}`));
      }

      write(guidedFile, tasks);
    }
  } else {
    errors.push("guided.json is missing");
  }

  for (const p of problemIndex().filter((info) => info.concepts[0] === id)) {
    const file = path.join(course().dir, "problems", `${p.slug}.json`);

    if (existsSync(file)) {
      const task = read<JqTask>(file);
      errors.push(...check(task).map((e) => `${p.slug}: ${e}`));
      write(file, task);
    } else {
      errors.push(`${p.slug}: problems/${p.slug}.json is missing`);
    }
  }

  return errors;
};

const ids = args[0] === "--all" ? concepts().map((c) => c.id) : args;

if (!ids.length) {
  console.log(
    "usage: bun scripts/build-jq.ts [--course <id>] <concept id...> | --all"
  );
  process.exit(1);
}

let failed = 0;

for (const id of ids) {
  const errors = build(id);

  if (errors.length) {
    failed += 1;
    console.log(`✗ ${id}\n${errors.map((e) => `  ${e}`).join("\n")}`);
  } else {
    console.log(`✓ ${id}`);
  }
}

console.log(`\n${ids.length - failed}/${ids.length} lessons OK`);

process.exit(failed ? 1 : 0);
