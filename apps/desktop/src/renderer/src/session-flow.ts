// What a session is made of, and what it adds up to. These rules use no screen, so they
// can be tested alone.

import type { Lesson, Mode, Problem } from "./types";
import type { Finished } from "./use-answer";

/** What is on screen: one part of a lesson to read, one task, or the closing summary. */
export type Step =
  | { kind: "see"; lesson: Lesson; part: number }
  | { kind: "task"; mode: Mode; problem: Problem; lesson: Lesson | null }
  | { kind: "done"; why: "time" | "empty" | "ended" };

/** The part of a lesson whose guided task is the one to do. */
export const partOf = (lesson: Lesson): number =>
  Math.max(0, Math.min(lesson.guided_tasks.done, lesson.parts.length - 1));

/** What the tutor pane's header says. A review is never named. */
export const contextOf = (step: Step): string => {
  if (step.kind === "done") {
    return "";
  }

  return step.lesson?.name ?? "Review";
};

/** What the session did, for the closing summary. */
export interface Tally {
  tasks: number;
  /** Tasks answered right on the first answer, with no help. */
  firstTime: number;
  /** Concepts a review rated. */
  reviewed: number;
  /** The names of the concepts learned. */
  learned: string[];
}

export const EMPTY: Tally = {
  firstTime: 0,
  learned: [],
  reviewed: 0,
  tasks: 0,
};

/** The tally after one more task. */
export const count = (tally: Tally, step: Step, done: Finished): Tally => {
  const { result } = done;
  const learned = step.kind === "task" && result.learned && step.lesson;

  return {
    firstTime:
      tally.firstTime + Number(result.outcome === "solved" && done.tries === 1),
    learned: learned ? [...tally.learned, learned.name] : tally.learned,
    reviewed:
      tally.reviewed + (result.mode === "review" ? result.concepts.length : 0),
    tasks: tally.tasks + 1,
  };
};
