import type { Api } from "../../preload/index";

declare global {
  interface Window {
    tp: Api;
  }
}

export type Difficulty = "easy" | "medium" | "hard";

/** Where a lesson stands, from the engine. */
export type LessonStatus = "locked" | "todo" | "started" | "partial" | "done";

export type ProblemStatus =
  | "unattempted"
  | "in_progress"
  | "attempted"
  | "solved_with_help"
  | "solved";

/** Why a problem is open: a lesson's guided problem, its solo problem, or a review. */
export type Mode = "guided" | "solo" | "review";

/** One problem as the app shows it. It carries no topic, so a review does not give its pattern away. */
export interface Problem {
  slug: string;
  title: string;
  difficulty: Difficulty;
  statement: string | null;
  status: ProblemStatus;
}

export interface Attempt {
  id: number;
  slug: string;
  mode: Mode | null;
  language: string;
  /** The concept whose lesson this attempt belongs to; null for a review. */
  lesson: string | null;
}

export type ExerciseKind = "example" | "predict" | "arrange" | "answer";

/** A tutor-made exercise, from the engine bridge. The answer appears once it is graded. */
export interface Exercise {
  id: number;
  kind: ExerciseKind;
  language: "typescript" | "python";
  title: string;
  prompt: string;
  code: string | null;
  /** Arrange: the lines, shuffled. */
  lines: string[] | null;
  /** Empty for a review until it is graded, so the concepts are not given away. */
  concepts: {
    id: string;
    name: string;
    result: "pass" | "fail" | null;
    /** What the result changed, in words. */
    effect: string | null;
  }[];
  status: "open" | "submitted" | "graded";
  response: string | null;
  correct: boolean | null;
  correct_answer: string | string[] | null;
}

/** What handing in an exercise did, from the bridge's `exercise.submit` method. */
export interface Submission {
  exercise: Exercise;
  result: {
    status: "submitted" | "graded";
    correct?: boolean;
    concepts?: { name: string; result: "pass" | "fail"; effect: string }[];
  };
}

/** From the bridge's `code.read` method. */
export interface Code {
  text: string;
  language: "typescript" | "python";
  editable: boolean;
}

/** From the bridge's `code.run` method. */
export interface Run {
  passed: number;
  total: number;
  fatal: string | null;
  cases: {
    ok: boolean;
    input: string;
    expected: string;
    actual: string | null;
    error: string | null;
  }[];
}

/** What grading a problem did. */
export interface Result {
  outcome: "solved" | "solved_with_help" | "gave_up" | "paused";
  mode: Mode | null;
  concepts: {
    id: string;
    name: string;
    result: "pass" | "fail";
    effect: string;
    next_review: string | null;
  }[];
}

/** From the bridge's `code.submit` method. */
export interface Handed {
  /** False when the tests do not pass yet. */
  finished: boolean;
  run: Run;
  result: Result | null;
}

/** From the bridge's `attempt.give_up` method. */
export interface GaveUp {
  result: Result;
  solution: string | null;
}

/** From the bridge's `session` method. */
export interface Session {
  attempt: Attempt | null;
  exercise: Exercise | null;
}

/** From the bridge's `course` method. */
export interface Course {
  subject: { id: string; name: string; initials: string };
  concepts: { learned: number; total: number };
  problems: { solved: number; total: number };
  /** Concepts due for review. */
  due: number;
  next_lesson: string | null;
  topics: {
    id: string;
    name: string;
    learned: number;
    total: number;
    lessons: {
      id: string;
      name: string;
      status: LessonStatus;
      /** False while the lesson text or its problems are missing. */
      written: boolean;
    }[];
  }[];
}

/** From the bridge's `lesson` and `lesson.open` methods. */
export interface Lesson {
  id: string;
  name: string;
  /** The chapter's name. */
  topic: string;
  key_idea: string;
  text: string | null;
  status: LessonStatus;
  /** 1: the guided problem, beside the lesson. 2: the solo problem, alone. */
  step: 1 | 2;
  guided: Problem;
  solo: Problem;
  attempt: Attempt | null;
  /** When the solo problem opens again after a struggle. */
  wait_until: string | null;
}

/** From the bridge's `reviews` method. */
export interface Reviews {
  due: number;
  problems: number;
  minutes: number;
  tracks: {
    id: string;
    name: string;
    initials: string;
    due: number;
    problems: number;
    minutes: number;
    next_due: string | null;
  }[];
}
