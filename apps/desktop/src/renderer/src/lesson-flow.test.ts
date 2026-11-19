import { describe, expect, test } from "bun:test";

import {
  currentPart,
  movedOnNote,
  reduce,
  reopensLesson,
  shown,
  start,
  trail,
} from "./lesson-flow";
import type { Finished, Flow, FlowEvent } from "./lesson-flow";
import type { Lesson, Problem } from "./types";

const problem = (slug: string): Problem => ({
  check: { type: "function" },
  difficulty: "easy",
  slug,
  statement: "Do it.",
  status: "unattempted",
  title: slug,
});

/** A lesson of three parts, on its second guided task unless told otherwise. */
const lesson = (over: Partial<Lesson> = {}): Lesson => ({
  attempt: null,
  guided: problem("guided-x.2"),
  guided_tasks: { done: 1, total: 3 },
  id: "x",
  key_idea: "The idea.",
  name: "The Lesson",
  parts: ["One", "Two", "Three"].map((name, i) => ({
    name,
    task: i ? `guided-x.${i + 1}` : "guided-x",
    text: `About ${name}.`,
    title: i ? name : "The Lesson",
  })),
  solo: problem("x-solo-1"),
  solo_tasks: { done: 0, total: 2 },
  status: "todo",
  step: 1,
  topic: "Chapter",
  wait_until: null,
  ...over,
});

const ended = (
  outcome: Finished["result"]["outcome"],
  movesOn: boolean
): Finished => ({
  result: { concepts: [], mode: "guided", moves_on: movesOn, outcome },
  solution: null,
});

/** A flow with a lesson loaded, after the events given. */
const after = (loaded: Lesson, ...events: FlowEvent[]): Flow => {
  let flow = reduce(start, { lesson: loaded, type: "loaded" });

  for (const event of events) {
    flow = reduce(flow, event);
  }

  return flow;
};

describe("the lesson flow", () => {
  test("nothing happens before the lesson has arrived", () => {
    expect(reduce(start, { type: "again" })).toBe(start);
    expect(reduce(start, { part: 0, type: "open_part" })).toBe(start);
  });

  test("a right answer asks for the next task and says what was right", () => {
    const before = after(lesson());

    const moved = reduce(before, {
      finished: ended("solved", true),
      type: "finished",
    });

    expect(moved.finished).toBeNull();
    expect(moved.note).toBe("Part 2 was right.");
    expect(moved.request).toEqual({ practise: true });
    // A new request is what loads the lesson again.
    expect(moved.request).not.toBe(before.request);
  });

  test("a task that has something to read stays on screen", () => {
    const gaveUp = ended("gave_up", false);
    const stayed = after(lesson(), { finished: gaveUp, type: "finished" });

    expect(stayed.finished).toBe(gaveUp);
    expect(stayed.request).toBe(start.request);

    // Trying again clears the note and asks for the task once more.
    const again = reduce(
      { ...stayed, note: "Part 1 was right." },
      {
        type: "again",
      }
    );

    expect(again.note).toBe("");
    expect(again.request).not.toBe(stayed.request);
  });

  test("loading a lesson clears what belonged to the task before", () => {
    const flow = after(
      lesson(),
      { part: 0, type: "open_part" },
      { finished: ended("gave_up", false), type: "finished" },
      { lesson: lesson(), type: "loaded" }
    );

    expect(flow).toMatchObject({ finished: null, peeking: false, view: null });
  });

  test("the note names what was right", () => {
    expect(movedOnNote(lesson())).toBe("Part 2 was right.");
    expect(
      movedOnNote(
        lesson({
          guided_tasks: { done: 0, total: 1 },
          parts: lesson().parts.slice(0, 1),
        })
      )
    ).toBe("That was right.");
    expect(movedOnNote(lesson({ step: 2 }))).toBe("Task 1 was right.");
  });
});

describe("moving between parts", () => {
  test("in step 1 the learner can go back, and not ahead", () => {
    const on = after(lesson());

    expect(currentPart(lesson())).toBe(1);
    expect(reduce(on, { part: 2, type: "open_part" })).toBe(on);
    expect(reduce(on, { part: 7, type: "open_part" })).toBe(on);

    const back = reduce(on, { part: 0, type: "open_part" });

    expect(shown(back, lesson())).toEqual({
      paged: true,
      part: 0,
      past: "guided-x",
      reading: true,
    });

    // Picking the part they are on is the same as going back to the task.
    expect(reduce(back, { part: 1, type: "open_part" }).view).toBeNull();
    expect(reduce(back, { type: "back_to_task" }).view).toBeNull();
  });

  test("the trail marks finished parts, the one on screen, and what is not reached", () => {
    const stops = trail(after(lesson()), lesson());

    expect(stops.map((s) => s.state)).toEqual([
      "done",
      "current",
      "todo",
      "todo",
    ]);
    expect(stops.map((s) => s.event?.type ?? null)).toEqual([
      "open_part",
      "open_part",
      null,
      null,
    ]);
    expect(stops.at(-1)?.label).toBe("On your own");
    expect(stops.some((s) => s.hint)).toBe(false);
  });

  test("in the solo step every part is open, and opening one is told to the engine", () => {
    const solo = lesson({ guided_tasks: { done: 3, total: 3 }, step: 2 });
    const on = after(solo);
    const open: FlowEvent = { part: 0, type: "open_part" };

    expect(trail(on, solo).map((s) => s.state)).toEqual([
      "done",
      "done",
      "done",
      "current",
    ]);
    expect(trail(on, solo)[0]?.hint).toBe("Opening the lesson counts as help.");
    expect(reopensLesson(on, open)).toBe(true);

    const reading = reduce(on, open);

    expect(shown(reading, solo)).toMatchObject({ past: null, reading: true });
    // Moving to another part while the lesson is open is not a second reopening.
    expect(reopensLesson(reading, { part: 1, type: "open_part" })).toBe(false);
    expect(trail(reading, solo).at(-1)).toMatchObject({
      event: { type: "back_to_task" },
      state: "todo",
    });
  });

  test("a learned lesson can be read without a warning", () => {
    const learned = lesson({ status: "done", step: 2 });

    expect(trail(after(learned), learned).some((s) => s.hint)).toBe(false);
  });

  test("going back in step 1 is never told to the engine", () => {
    expect(reopensLesson(after(lesson()), { part: 0, type: "open_part" })).toBe(
      false
    );
  });
});

describe("a lesson of one part", () => {
  const one = lesson({
    guided_tasks: { done: 1, total: 1 },
    parts: lesson().parts.slice(0, 1),
    step: 2,
  });

  test("it has no trail to move on: the Lesson button opens it beside the solo task", () => {
    const on = after(one);

    expect(shown(on, one)).toEqual({
      paged: false,
      part: 0,
      past: null,
      reading: false,
    });
    expect(reopensLesson(on, { type: "toggle_peek" })).toBe(true);

    const peeking = reduce(on, { type: "toggle_peek" });

    expect(shown(peeking, one).reading).toBe(true);
    // Closing it again is not a reopening.
    expect(reopensLesson(peeking, { type: "toggle_peek" })).toBe(false);
    expect(reduce(peeking, { type: "toggle_peek" }).peeking).toBe(false);
  });
});
