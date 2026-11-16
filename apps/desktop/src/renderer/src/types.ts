import type { Api } from "../../preload/index";

declare global {
  interface Window {
    tp: Api;
  }
}

export type Difficulty = "easy" | "medium" | "hard";

export type ConceptStage =
  | "locked"
  | "available"
  | "learning"
  | "passed"
  | "mastered";

export type ProblemStatus =
  | "unattempted"
  | "in_progress"
  | "attempted"
  | "solved_with_help"
  | "solved";

export type NextAction =
  | { action: "resume"; problem: string; why: string }
  | { action: "reteach"; concept: string; why: string }
  | { action: "review"; problem: string; covers: string[]; why: string }
  | { action: "review_exercise"; concepts: string[]; why: string }
  | { action: "learn"; problem: string; new_concepts: string[]; why: string }
  | { action: "practice"; problem: string; why: string }
  | { action: "done_for_now"; next_due: string | null; why: string };

/** From the engine bridge's `problem` method, and the `problem` field of a session. */
export interface Problem {
  slug: string;
  title: string;
  topic: string;
  difficulty: Difficulty;
  statement: string | null;
  concept_count: number;
  new_concepts: string[];
}

export type ExerciseKind = "example" | "predict" | "arrange" | "answer";

export type Confidence = "low" | "medium" | "high";

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
  confidence: Confidence | null;
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

/** From the engine bridge's `session` method. */
export interface Session {
  next: NextAction;
  exercise: Exercise | null;
  attempt: {
    id: number;
    slug: string;
    phase: "learning" | "review" | null;
    language: string;
  } | null;
  problem: Problem | null;
}

/** From the engine bridge's `roadmap` method. */
export interface Roadmap {
  current: string | null;
  topics: {
    id: string;
    name: string;
    prereqs: string[];
    solved: number;
    total: number;
    concepts: {
      id: string;
      name: string;
      key_idea: string;
      stage: ConceptStage;
      due: string | null;
      recall: number | null;
    }[];
    problems: {
      slug: string;
      title: string;
      difficulty: Difficulty;
      status: ProblemStatus;
      unlocked: boolean;
    }[];
  }[];
}
