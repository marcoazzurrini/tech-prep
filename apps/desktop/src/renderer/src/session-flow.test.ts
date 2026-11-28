import { describe, expect, test } from "bun:test";

import { contextOf, count, EMPTY, partOf } from "./session-flow";
import type { Step } from "./session-flow";
import type { Lesson, Problem, Result } from "./types";

const problem: Problem = {
  check: null,
  difficulty: "easy",
  slug: "task",
  statement: "Do it.",
  status: "in_progress",
  title: "Task",
};

const lesson = (done: number, parts: number): Lesson => ({
  attempt: null,
  guided: problem,
  guided_tasks: { done, total: parts },
  id: "select",
  key_idea: "",
  name: "Keep items with select",
  parts: Array.from({ length: parts }, (_, i) => ({
    name: `Part ${i + 1}`,
    task: `guided-select-${i + 1}`,
    text: "",
    title: `Part ${i + 1}`,
  })),
  solo: problem,
  solo_tasks: { done: 0, total: 2 },
  status: "started",
  step: 1,
  topic: "Lists",
  wait_until: null,
});

const result = (over: Partial<Result>): Result => ({
  concepts: [],
  learned: false,
  mode: "guided",
  outcome: "solved",
  ...over,
});

const concept = (id: string): Result["concepts"][number] => ({
  effect: "reviewed",
  id,
  key_idea: "",
  name: id,
  next_review: null,
  result: "pass",
});

describe("a session", () => {
  test("shows the part whose task is the one to do", () => {
    expect(partOf(lesson(0, 3))).toBe(0);
    expect(partOf(lesson(2, 3))).toBe(2);
    // Every guided task is done: the last part is the one last read.
    expect(partOf(lesson(3, 3))).toBe(2);
  });

  test("names the concept to the tutor, and never a review", () => {
    const learning: Step = {
      kind: "task",
      lesson: lesson(0, 1),
      mode: "solo",
      problem,
    };

    const review: Step = {
      kind: "task",
      lesson: null,
      mode: "review",
      problem,
    };

    expect(contextOf(learning)).toBe("Keep items with select");
    expect(contextOf(review)).toBe("Review");
    expect(contextOf({ kind: "done", why: "time" })).toBe("");
  });

  test("counts what was right first time, learned and reviewed", () => {
    const solo: Step = {
      kind: "task",
      lesson: lesson(3, 3),
      mode: "solo",
      problem,
    };

    const review: Step = {
      kind: "task",
      lesson: null,
      mode: "review",
      problem,
    };

    let tally = count(EMPTY, solo, {
      result: result({ learned: true, mode: "solo" }),
      solution: null,
      tries: 1,
    });

    // A second answer is not first time. Help or giving up is not either.
    tally = count(tally, review, {
      result: result({
        concepts: [concept("a"), concept("b")],
        mode: "review",
      }),
      solution: null,
      tries: 2,
    });

    tally = count(tally, review, {
      result: result({ mode: "review", outcome: "gave_up" }),
      solution: "x",
      tries: 0,
    });

    expect(tally).toEqual({
      firstTime: 1,
      learned: ["Keep items with select"],
      reviewed: 2,
      tasks: 3,
    });
  });
});
