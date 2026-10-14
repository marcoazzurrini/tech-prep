import type { Api } from "../../preload/index";

declare global {
  interface Window {
    tp: Api;
  }
}

export type Difficulty = "easy" | "medium" | "hard";
export type ConceptStage = "locked" | "available" | "learning" | "passed" | "mastered";
export type ProblemStatus = "unattempted" | "in_progress" | "attempted" | "solved_with_help" | "solved";

export type NextAction =
  | { action: "resume"; problem: string; why: string }
  | { action: "reteach"; concept: string; why: string }
  | { action: "review"; problem: string; covers: string[]; why: string }
  | { action: "learn"; problem: string; new_concepts: string[]; why: string }
  | { action: "practice"; problem: string; why: string }
  | { action: "done_for_now"; next_due: string | null; why: string };

/** From the engine bridge's `session` method. */
export interface Session {
  next: NextAction;
  attempt: { id: number; slug: string; phase: "learning" | "review" | null; language: string } | null;
  problem: {
    slug: string;
    title: string;
    topic: string;
    difficulty: Difficulty;
    statement: string | null;
    concept_count: number;
    new_concepts: string[];
  } | null;
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
    concepts: { id: string; name: string; key_idea: string; stage: ConceptStage; due: string | null; recall: number | null }[];
    problems: { slug: string; title: string; difficulty: Difficulty; status: ProblemStatus; unlocked: boolean }[];
  }[];
}

/** Written by `tp test` (server/src/notify.ts). */
export type TestEvent =
  | { type: "test_start"; file: string }
  | {
      type: "test_result";
      file: string;
      passed: number;
      total: number;
      fatal?: string;
      failure?: { args: unknown[]; expected: unknown; actual?: unknown; error?: string };
    };

export type TutorEvent =
  | { type: "message"; text: string }
  | { type: "activity"; label: string }
  | { type: "busy"; busy: boolean }
  | { type: "error"; text: string };
