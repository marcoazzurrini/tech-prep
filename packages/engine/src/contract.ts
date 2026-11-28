// The contract between the engine's bridge and the app: every method the app can call, what
// it takes and what it answers. The bridge is checked against it, and the app's calls are
// typed by it, so the two cannot drift apart. It holds types only and imports nothing, so
// the app can read it without the engine's runtime.

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
  /** How the answer is checked, and what that shows. Null while it is not written. */
  check: CheckView | null;
}

/** One thing an exercise shows the learner to work from, such as its input file. */
export interface Shown {
  label: string;
  /** The file the text is in, when the learner's answer names it. */
  file?: string;
  text: string;
}

/** The learner writes a function or a class, and test cases call it. */
export interface FunctionView {
  type: "function";
}

/** The learner types a whole command, as in a terminal, and sees what it prints. */
export interface CommandView {
  type: "command";
  /** The program the command starts with. */
  program: string;
  /** The file the input is in. The learner's command names it. */
  file: string;
  input: string;
  wanted: string;
  /** How many inputs Submit checks beyond the one shown. */
  hidden: number;
}

/** The learner types the value that comes out of what is shown. */
export interface ValueView {
  type: "value";
  shown: Shown[];
}

/** The learner puts lines in order and sets some aside. */
export interface ArrangeView {
  type: "arrange";
  /** The lines, mixed. */
  lines: string[];
}

/** The learner answers in their own words, and the tutor grades it. */
export interface AnswerView {
  type: "answer";
}

/** Code to read while the tutor explains it. There is nothing to answer. */
export interface ReadView {
  type: "read";
  code: string;
}

/**
 * How an exercise is checked, as the app sees it: the answer is left out. Each type has its
 * own way of taking an answer on screen.
 */
export type CheckView =
  | FunctionView
  | CommandView
  | ValueView
  | ArrangeView
  | AnswerView
  | ReadView;

/** From the bridge's `answer.preview` method: what the learner's text prints on the shown input. */
export interface Preview {
  output: string;
  error: string | null;
  matches: boolean;
}

export interface Attempt {
  id: number;
  slug: string;
  mode: Mode | null;
  language: string;
  /** The concept whose lesson this attempt belongs to; null for a review. */
  lesson: string | null;
}

/** An extra exercise from the tutor. Its answer appears once it is graded. */
export interface Exercise {
  id: number;
  title: string;
  prompt: string;
  check: CheckView;
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
  correct_answer: string | null;
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
  /** What the answer is written in, such as "typescript". */
  language: string;
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
  /** True when this answer is what made its concept learned. */
  learned: boolean;
  concepts: {
    id: string;
    name: string;
    /** The approach in a sentence, shown when the concept was missed. */
    key_idea: string;
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
  /** The course that is open. */
  subject: {
    id: string;
    name: string;
    initials: string;
    /** What the course calls the things its learner solves. */
    noun: "problems" | "tasks" | "exercises";
  };
  /** Every course the app found, with its concepts due for review. */
  courses: { id: string; name: string; initials: string; due: number }[];
  /** Why a course folder could not be used, one line each. */
  skipped: string[];
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
      /** When a learned concept comes back for review. */
      next_review: string | null;
    }[];
  }[];
}

/** One part of a lesson: one idea, read alone, then practised in its guided task. */
export interface LessonPart {
  /** Its short name. */
  name: string;
  /** The heading above its text. */
  title: string;
  text: string;
  /** The slug of the guided task that goes with it. */
  task: string;
}

/** From the bridge's `lesson.open` method. */
export interface Lesson {
  id: string;
  name: string;
  /** The chapter's name. */
  topic: string;
  key_idea: string;
  /**
   * The lesson in parts, one per guided task. One part when the lesson is read in one go,
   * and none while it is not written.
   */
  parts: LessonPart[];
  status: LessonStatus;
  /** 1: the guided problem, beside the lesson. 2: the solo problem, alone. */
  step: 1 | 2;
  /** The guided task to do now, and how many of the step's tasks are done. */
  guided: Problem;
  guided_tasks: { done: number; total: number };
  /** The solo task to do now, and how many of the step's tasks are solved alone. */
  solo: Problem;
  solo_tasks: { done: number; total: number };
  attempt: Attempt | null;
  /** When the solo problem opens again after a struggle. */
  wait_until: string | null;
}

/** From the bridge's `today` method: what a session of the open course holds. */
export interface Today {
  /** How many days the learner has studied this course, counting today. */
  day: number;
  /** What is due for review, and the tasks that cover it. */
  reviews: { concepts: number; tasks: number; minutes: number };
  /** The concept to learn next. Null when no concept is open. */
  concept: {
    id: string;
    name: string;
    /** Tasks still to do with the lesson, and tasks still to do alone. */
    guided: number;
    solo: number;
    minutes: number;
  } | null;
  /** Stable: kept through a later review. Learning: learned, not stable yet. */
  progress: { total: number; stable: number; learning: number };
  /** The share of learned concepts the learner would recall now, from 0 to 1. Null before the first review. */
  memory: number | null;
  /** When the next review falls due, among the concepts not due today. */
  next_due: string | null;
}

/** Every bridge method: its parameters and its reply. */
export interface Methods {
  /** What the learner's text prints on the shown input, as they type. */
  "answer.preview": { params: { slug: string; text: string }; result: Preview };
  /** The learner gave up: the attempt closes, and a worked solution comes back. */
  "attempt.give_up": { params: { slug: string }; result: GaveUp };
  /** Set the open attempt aside with no grade. */
  "attempt.pause": { params: { slug: string }; result: { paused: boolean } };
  "code.read": { params: { slug: string }; result: Code };
  /** Run the tests without handing the problem in. */
  "code.run": { params: { slug: string }; result: Run };
  "code.save": {
    params: { slug: string; text: string };
    result: { saved: boolean };
  };
  /** Run the tests and, when they pass, grade the attempt. */
  "code.submit": { params: { slug: string }; result: Handed };
  course: { params: undefined; result: Course };
  /** Open another course. */
  "course.select": { params: { course: string }; result: Course };
  "exercise.close": { params: undefined; result: { closed: boolean } };
  "exercise.submit": {
    params: { id: number; response: string | string[] };
    result: Submission;
  };
  /**
   * Open a lesson and start its next task when there is one to start. With `practise`, a
   * lesson that is already learned starts again too.
   */
  "lesson.open": {
    params: { concept: string; practise?: boolean };
    result: Lesson;
  };
  /** The learner reopened the lesson during its solo task. */
  "lesson.peek": {
    params: { concept: string };
    result: { counted_as_help: boolean };
  };
  problem: { params: { slug: string }; result: Problem };
  /** Open the next review: of one course, or of any course when none is named. */
  "review.next": {
    params: { course?: string } | undefined;
    result: { problem: Problem | null };
  };
  session: { params: undefined; result: Session };
  /** What a session of the open course holds today. */
  today: { params: undefined; result: Today };
}

export type Method = keyof Methods;
