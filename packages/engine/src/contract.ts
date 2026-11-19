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
  /** What the workbench of this kind of task shows. Null while the task is not written. */
  task: TaskView | null;
}

/** What a task shows beyond its statement. Each kind of task has its own workbench. */
export type TaskView = { kind: "code" } | JqTask;

/** A jq task: its input, the output to produce, and how the learner answers. */
export interface JqTask {
  kind: "jq";
  /**
   * False: the learner types the whole jq command, as in a terminal. True: they type the
   * value that comes out, and see no output while typing.
   */
  predict: boolean;
  /** The command a predict task asks about, when it shows one. */
  command: string | null;
  /** The file the input is in. The learner's command names it. */
  file: string;
  input: string;
  wanted: string;
  /** How many inputs Submit checks beyond the one shown. */
  hidden: number;
}

/** From the bridge's `task.preview` method: what the learner's text prints on the shown input. */
export interface JqPreview {
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

export type ExerciseKind = "example" | "predict" | "arrange" | "answer";

/** A tutor-made exercise, from the engine bridge. The answer appears once it is graded. */
export interface Exercise {
  id: number;
  kind: ExerciseKind;
  language: "typescript" | "python" | "jq";
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
  language: "typescript" | "python" | "jq";
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
  /** True when the app opens the next task by itself: the answer was right. */
  moves_on: boolean;
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
    /** What the course calls its tasks. */
    noun: "problems" | "tasks";
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
    }[];
  }[];
}

/** One part of a lesson: one idea, shown alone beside its guided task. */
export interface LessonPart {
  /** Its name on the trail in the top bar. */
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

/** Every bridge method: its parameters and its reply. */
export interface Methods {
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
  reviews: { params: undefined; result: Reviews };
  session: { params: undefined; result: Session };
  /** What the learner's text prints on the shown input, as they type. */
  "task.preview": { params: { slug: string; text: string }; result: JqPreview };
}

export type Method = keyof Methods;
