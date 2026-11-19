// Where the learner is on the lesson screen, and how each thing they do moves them. It is
// plain data and plain functions, with no React and no engine calls, so it can be tested
// alone. The screen holds a `Flow`, sends it events and draws what it says.

import type { Lesson, Result } from "./types";

/** How a task ended: its grade, and a worked solution when the learner gave up. */
export interface Finished {
  result: Result;
  solution: string | null;
}

export interface Flow {
  /** Null until the engine has answered. */
  lesson: Lesson | null;
  /** How the task on screen ended, when it stays on screen: it has something to read. */
  finished: Finished | null;
  /** The part the learner went back to. Null: the task they are on. */
  view: number | null;
  /** A lesson of one part, reopened beside its solo task. */
  peeking: boolean;
  /** What the footer says about the task before this one, such as "Part 1 was right." */
  note: string;
  /** What to ask the engine for. A new request loads the lesson again. */
  request: { practise: boolean };
}

export type FlowEvent =
  /** The engine answered with the lesson, and started its next task if there was one. */
  | { type: "loaded"; lesson: Lesson }
  /** The task on screen was solved or given up. */
  | { type: "finished"; finished: Finished }
  /** The learner asked for the next task: to try again, or to practise a learned lesson. */
  | { type: "again" }
  /** The learner picked a part on the trail. */
  | { type: "open_part"; part: number }
  /** The learner went back to the task they are on. */
  | { type: "back_to_task" }
  /** The learner pressed "Lesson" during the solo step of a lesson of one part. */
  | { type: "toggle_peek" };

export const start: Flow = {
  finished: null,
  lesson: null,
  note: "",
  peeking: false,
  request: { practise: false },
  view: null,
};

/** A lesson in several parts shows one at a time, with a trail to move between them. */
export const isPaged = (lesson: Lesson): boolean => lesson.parts.length > 1;

/** The part whose guided task is the one to do. */
export const currentPart = (lesson: Lesson): number =>
  Math.max(0, Math.min(lesson.guided_tasks.done, lesson.parts.length - 1));

/** True when the learner may open this part: they finished it or they are on it. */
const reached = (lesson: Lesson, part: number): boolean =>
  part >= 0 &&
  part < lesson.parts.length &&
  (lesson.step === 2 || part <= currentPart(lesson));

/**
 * What the footer of the next task says after a right answer moved on. The engine decides
 * that a result moves on; this only words it.
 */
export const movedOnNote = (lesson: Lesson): string => {
  if (lesson.step === 2) {
    return `Task ${lesson.solo_tasks.done + 1} was right.`;
  }

  // A lesson with one guided task has nothing to number.
  if (lesson.guided_tasks.total === 1) {
    return "That was right.";
  }

  return `${isPaged(lesson) ? "Part" : "Task"} ${lesson.guided_tasks.done + 1} was right.`;
};

export const reduce = (flow: Flow, event: FlowEvent): Flow => {
  if (event.type === "loaded") {
    return {
      ...flow,
      finished: null,
      lesson: event.lesson,
      peeking: false,
      view: null,
    };
  }

  const { lesson } = flow;

  // Nothing can happen on a lesson that has not arrived.
  if (!lesson) {
    return flow;
  }

  switch (event.type) {
    case "finished": {
      // A right answer opens the next task. Anything else stays, to be read.
      return event.finished.result.moves_on
        ? { ...flow, note: movedOnNote(lesson), request: { practise: true } }
        : { ...flow, finished: event.finished };
    }

    case "again": {
      return { ...flow, note: "", request: { practise: true } };
    }

    case "open_part": {
      if (!reached(lesson, event.part)) {
        return flow;
      }

      // In step 1, the part the learner is on is not "gone back to": it is the task itself.
      const own = lesson.step === 1 && event.part === currentPart(lesson);

      return { ...flow, view: own ? null : event.part };
    }

    case "back_to_task": {
      return { ...flow, peeking: false, view: null };
    }

    case "toggle_peek": {
      return { ...flow, peeking: !flow.peeking };
    }

    default: {
      return flow;
    }
  }
};

/**
 * True when an event reopens the lesson during the solo step. The screen then tells the
 * engine, which counts it as help unless the lesson is already learned.
 */
export const reopensLesson = (flow: Flow, event: FlowEvent): boolean => {
  if (flow.lesson?.step !== 2) {
    return false;
  }

  if (event.type === "open_part") {
    return flow.view === null && reached(flow.lesson, event.part);
  }

  return event.type === "toggle_peek" && !flow.peeking;
};

/** What the lesson screen shows for a flow. */
export interface Shown {
  paged: boolean;
  /** The part whose text is on screen. */
  part: number;
  /** True when the lesson text sits beside the solo task. */
  reading: boolean;
  /** The slug of an earlier part's task, when the learner went back to it in step 1. */
  past: string | null;
}

export const shown = (flow: Flow, lesson: Lesson): Shown => {
  const paged = isPaged(lesson);
  const part = flow.view ?? currentPart(lesson);

  return {
    paged,
    part,
    past:
      lesson.step === 1 && flow.view !== null
        ? (lesson.parts[flow.view]?.task ?? null)
        : null,
    reading: paged ? flow.view !== null : flow.peeking,
  };
};

/** One stop of the top bar's trail. */
export interface Stop {
  label: string;
  state: "done" | "current" | "todo";
  /** What picking it does. Null for a part the learner has not reached. */
  event: FlowEvent | null;
  /** Shown on hover. */
  hint?: string;
}

/** The top bar's trail: every part of the lesson, then the step on your own. */
export const trail = (flow: Flow, lesson: Lesson): Stop[] => {
  const solo = lesson.step === 2;
  const at = currentPart(lesson);
  const on = flow.view ?? (solo ? null : at);
  const helps = solo && lesson.status !== "done";

  return [
    ...lesson.parts.map((part, i): Stop => {
      const done = solo || i < at;
      let state: Stop["state"] = done ? "done" : "todo";

      if (i === on) {
        state = "current";
      }

      return {
        event: reached(lesson, i) ? { part: i, type: "open_part" } : null,
        hint: helps ? "Opening the lesson counts as help." : undefined,
        label: part.name,
        state,
      };
    }),
    {
      event: solo ? { type: "back_to_task" } : null,
      label: "On your own",
      state: solo && flow.view === null ? "current" : "todo",
    },
  ];
};
