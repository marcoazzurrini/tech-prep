#!/usr/bin/env bun
// MCP server: the harness the tutor works through.
// It owns the curriculum (roadmap, concepts, Blind 75 problems), the learner's state,
// test runs, grading and FSRS scheduling. The tutor (Claude) owns the teaching:
// it writes explanations and exercises on the spot, and the engine verifies them.

import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";

import {
  DEFAULT_LANGUAGE,
  WORKSPACE_DIR,
  concept,
  isAuthored,
  problemInfo,
  problemsUsing,
  referenceSolution,
  topics,
  validateCurriculum,
  withPrereqs,
} from "./content.ts";
import type { Language } from "./content.ts";
import {
  addNote,
  attemptsFor,
  closeExercises,
  notesFor,
  orphans,
} from "./db.ts";
import type { ExerciseKind, Result } from "./db.ts";
import { currentExercise, gradeAnswer, showExercise } from "./exercises.ts";
import {
  finishAttempt,
  logHint,
  startProblem,
  testSolution,
} from "./practice.ts";
import { formatRun } from "./runner.ts";
import {
  completeLesson,
  conceptStatus,
  newConceptsFor,
  nextUp,
  problemStatus,
  topicProgress,
} from "./scheduler.ts";

const server = new McpServer({ name: "tech-prep", version: "0.2.0" });

const languageInput = z
  .enum(["python", "typescript"])
  .optional()
  .describe(`Defaults to ${DEFAULT_LANGUAGE}.`);

const reply = (text: string) => ({
  content: [{ text, type: "text" as const }],
});

/** Wrap a handler that answers in plain text; a thrown error becomes an error reply. */
const safelyText =
  <A>(fn: (args: A) => string) =>
  (args: A) => {
    try {
      return reply(fn(args));
    } catch (error) {
      return {
        ...reply(error instanceof Error ? error.message : String(error)),
        isError: true,
      };
    }
  };

/** Wrap a handler whose result is shown to the model as pretty-printed JSON. */
const safely = <A>(fn: (args: A) => object) =>
  safelyText((args: A) => JSON.stringify(fn(args), null, 2));

const conceptView = (id: string) => {
  const c = concept(id);
  const s = conceptStatus(id);

  return {
    due: s.due,
    id,
    key_idea: c.key_idea,
    learner_notes: notesFor(id, 5).map((n) => n.text),
    name: c.name,
    prereqs: c.prereqs,
    recall: s.retrievability,
    stage: s.stage,
    topic: c.topic,
  };
};

// ── Planning ────────────────────────────────────────────────────────────

server.registerTool(
  "next_up",
  {
    description:
      "What to do now, in order: resume an open attempt; reteach a concept the learner struggled with twice; review (the problem that covers the most due concepts, or, when no problem covers them, an exercise you write); learn the new concepts of the next unlocked roadmap problem, or practise it; or nothing for now. Call at the start of every session and after each finished attempt or review exercise. It clears the exercise on screen. Never tell the learner which concept a review is about.",
    inputSchema: {},
  },
  safely(() => {
    closeExercises();
    const problems = [...validateCurriculum(), ...orphans()];

    const next = {
      ...nextUp(),
      language: DEFAULT_LANGUAGE,
      workspace: WORKSPACE_DIR,
    };

    if (problems.length) {
      return { ...next, data_warnings: problems };
    }

    return next;
  })
);

server.registerTool(
  "get_roadmap",
  {
    description:
      "The roadmap: topics in order with prerequisites, solved/total problems per topic, and each concept's stage (locked, available, learning, passed, mastered), recall and due date.",
    inputSchema: {},
  },
  safely(() => topicProgress())
);

server.registerTool(
  "get_progress",
  {
    description:
      "Totals, concepts due soon, the weakest concepts, and recent tutor notes about the learner.",
    inputSchema: {},
  },
  safely(() => {
    const roadmap = topicProgress();

    const all = roadmap.flatMap((t) =>
      t.concepts.map((c) => ({ ...c, topic: t.name }))
    );

    const practiced = all.filter(
      (c) => c.stage === "passed" || c.stage === "mastered"
    );

    return {
      concepts_learning: all.filter((c) => c.stage === "learning").length,
      concepts_mastered: all.filter((c) => c.stage === "mastered").length,
      concepts_passed: practiced.length,
      concepts_total: all.length,
      due_soon: practiced
        .toSorted((a, b) => (a.due ?? "").localeCompare(b.due ?? ""))
        .slice(0, 5),
      recent_notes: notesFor(undefined, 10).map((n) => ({
        concept: n.concept_id,
        problem: n.slug,
        text: n.text,
      })),
      solved: roadmap.reduce((n, t) => n + t.solved, 0),
      total: roadmap.reduce((n, t) => n + t.total, 0),
      weakest: practiced
        .toSorted((a, b) => (a.recall ?? 0) - (b.recall ?? 0))
        .slice(0, 5),
    };
  })
);

// ── Curriculum queries ──────────────────────────────────────────────────

server.registerTool(
  "get_problem",
  {
    description:
      "Everything about a problem for teaching it: statement, topic, difficulty, its concepts (key idea, prerequisites, learner stage, recall, notes), concepts not taught yet, past attempts, and the reference solution. The reference is your answer key: never show it unless the learner asks for the solution (hint level 4).",
    inputSchema: {
      language: languageInput,
      slug: z
        .string()
        .describe("The problem slug, e.g. next_up's `problem` field."),
    },
  },
  safely(({ slug, language }: { slug: string; language?: Language }) => {
    const info = problemInfo(slug);

    return {
      ...info,
      // oxlint-disable-next-line sort-keys -- shown to the model as-is; keep each attempt in reading order, start time first
      attempts: attemptsFor({ slug }).map((a) => ({
        started_at: a.started_at,
        finished: Boolean(a.finished_at),
        hints: a.hints_used,
        outcome: a.outcome,
        notes: a.notes,
      })),
      authored: isAuthored(slug),
      concepts: info.concepts.map(conceptView),
      not_yet_taught: newConceptsFor(slug),
      reference_solution: referenceSolution(slug, language ?? DEFAULT_LANGUAGE),
      status: problemStatus(slug),
    };
  })
);

server.registerTool(
  "get_concept",
  {
    description:
      "A concept's key idea, its prerequisites (with the learner's stage for each), the learner's notes, and every Blind 75 problem that uses it, with status. Use it to plan a lesson or an exercise and to avoid problems the learner will practise.",
    inputSchema: { concept_id: z.string() },
  },
  safely(({ concept_id }: { concept_id: string }) => ({
    ...conceptView(concept_id),
    prerequisite_chain: withPrereqs([concept_id])
      .slice(0, -1)
      .map((id) => ({ id, stage: conceptStatus(id).stage })),
    problems: problemsUsing(concept_id).map((p) => ({
      slug: p.slug,
      status: problemStatus(p.slug),
      title: p.title,
    })),
  }))
);

server.registerTool(
  "list_topics",
  { description: "Topic ids and names in roadmap order.", inputSchema: {} },
  safely(() =>
    topics().map((t) => ({ id: t.id, name: t.name, prereqs: t.prereqs }))
  )
);

// ── Exercises (written by the tutor, verified here, shown in the app) ────

server.registerTool(
  "show_exercise",
  {
    description: [
      "Put one exercise on the learner's screen, in place of the last one. The engine runs the code first and rejects the exercise if it fails, so fix it and call again.",
      "kind 'example': solved code the learner reads while you explain it in chat. Nothing to submit.",
      "kind 'predict': the learner reads `code` and types what it prints. The engine runs the code to get the answer, so the code must print exactly what you ask for, and little of it.",
      "kind 'arrange': the learner puts `lines` in order and sets `distractors` aside. Pass `lines` in the right order; the app shuffles them. The program must print something. One statement per line, indented as it should be.",
      "kind 'answer': an open question answered in the learner's own words. Pass `rubric` (key points per concept) and `model_answer`. You grade it with grade_answer once the app says it was submitted.",
      "The learner answers once: the first answer is the evidence. The app tells you the result. Never use a Blind 75 problem.",
    ].join(" "),
    inputSchema: {
      code: z.string().optional().describe("example, predict: the code."),
      concept_ids: z
        .array(z.string())
        .min(1)
        .max(3)
        .describe(
          "The concepts the exercise cannot be done without. Every one gets the same pass or fail (except 'answer'), so keep the list honest and short."
        ),
      distractors: z
        .array(z.string())
        .optional()
        .describe("arrange: one or two plausible lines that are not needed."),
      kind: z.enum(["example", "predict", "arrange", "answer"]),
      language: languageInput,
      lines: z
        .array(z.string())
        .optional()
        .describe("arrange: the lines in the right order."),
      model_answer: z
        .string()
        .optional()
        .describe("answer: a complete, short answer. Shown after grading."),
      prompt: z
        .string()
        .describe(
          "What to do, in one or two short sentences. Do not name the concept in a review."
        ),
      rubric: z
        .array(
          z.object({
            concept_id: z.string(),
            points: z.array(z.string()).min(1),
          })
        )
        .optional()
        .describe(
          "answer: the key points a passing answer makes, per concept."
        ),
      title: z.string().describe("A few words, e.g. 'Predict the output'."),
    },
  },
  safely(
    (args: {
      kind: ExerciseKind;
      concept_ids: string[];
      language?: Language;
      title: string;
      prompt: string;
      code?: string;
      lines?: string[];
      distractors?: string[];
      rubric?: { concept_id: string; points: string[] }[];
      model_answer?: string;
    }) =>
      showExercise({
        code: args.code,
        conceptIds: args.concept_ids,
        distractors: args.distractors,
        kind: args.kind,
        language: args.language,
        lines: args.lines,
        modelAnswer: args.model_answer,
        prompt: args.prompt,
        rubric: args.rubric,
        title: args.title,
      })
  )
);

server.registerTool(
  "get_exercise",
  {
    description:
      "The exercise on screen with its answer key, the learner's answer and confidence, and the result if graded. Never show the key before the learner submits.",
    inputSchema: {},
  },
  safely(() => currentExercise() ?? { note: "No exercise is on screen." })
);

server.registerTool(
  "grade_answer",
  {
    description:
      "Grade a submitted open answer: pass or fail for each of its concepts, against the rubric. A concept passes only if the answer makes its key points in the learner's own words; a vague or half-right answer fails. Then tell the learner what was missing.",
    inputSchema: {
      exercise_id: z.number().int(),
      verdicts: z
        .array(
          // oxlint-disable-next-line sort-keys -- the model fills these in order; it names the result before giving a reason
          z.object({
            concept_id: z.string(),
            result: z.enum(["pass", "fail"]),
            reason: z.string().optional(),
          })
        )
        .min(1),
    },
  },
  safely(
    ({
      exercise_id,
      verdicts,
    }: {
      exercise_id: number;
      verdicts: { concept_id: string; result: Result; reason?: string }[];
    }) => gradeAnswer(exercise_id, verdicts)
  )
);

server.registerTool(
  "complete_lesson",
  {
    description:
      "Mark concepts as taught after you taught them (or when the learner skips the lesson, or after re-teaching). Concepts move to 'learning' and pass on the learner's first solve without help; concepts that no problem practises directly pass right away. Re-teaching resets the struggle count. A right answer on an exercise does this by itself.",
    inputSchema: { concept_ids: z.array(z.string()).min(1) },
  },
  safely(({ concept_ids }: { concept_ids: string[] }) => {
    for (const id of concept_ids) {
      concept(id);
    }

    return concept_ids.map((id) => ({ id, stage: completeLesson(id) }));
  })
);

// ── Practice ────────────────────────────────────────────────────────────

server.registerTool(
  "start_problem",
  {
    description:
      "Open a problem in the app's editor and open an attempt (or resume the open one). The app shows the statement, the editor, Run and Submit. The returned file is the learner's code: read it before you comment on it.",
    inputSchema: {
      language: languageInput,
      slug: z
        .string()
        .describe("The problem slug, e.g. next_up's `problem` field."),
    },
  },
  safely(({ slug, language }: { slug: string; language?: Language }) =>
    startProblem(slug, language)
  )
);

server.registerTool(
  "run_tests",
  {
    description:
      "Run the learner's code against the tests and record the result on the open attempt. The learner has their own Run button, so use this to see the failures yourself.",
    inputSchema: {
      language: languageInput,
      slug: z
        .string()
        .describe("The problem slug, e.g. next_up's `problem` field."),
    },
  },
  safelyText(({ slug, language }: { slug: string; language?: Language }) => {
    const { run, attempt_id } = testSolution(slug, language);

    return `${formatRun(run)}\n\nattempt_id: ${attempt_id ?? "none open"}`;
  })
);

server.registerTool(
  "log_hint",
  {
    description:
      "Record a hint before you give it. It counts for whatever is on screen: the exercise, else the problem. Levels: 1 = a question that redirects attention, 2 = name the concept or data structure, 3 = outline the approach, 4 = show the solution. Level 1 still counts as working alone; from level 2 the exercise cannot pass.",
    inputSchema: { level: z.number().int().min(1).max(4) },
  },
  safely(({ level }: { level: number }) => logHint(level))
);

server.registerTool(
  "finish_attempt",
  {
    description: [
      "Close a problem attempt after the learner submitted and explained the solution. The engine re-runs the tests.",
      "Every concept of the problem gets the same result: a pass needs passing tests and no hint above level 1.",
      "A concept being learned passes on a pass; otherwise its struggle count goes up and the problem waits a day. A concept under review is rescheduled, and credit flows to the concepts it encompasses.",
      "If the tests do not pass, set stopped: 'gave_up' (the learner gave up) or 'paused' (stopped for outside reasons: nothing is graded).",
    ].join(" "),
    inputSchema: {
      attempt_id: z.number().int(),
      notes: z
        .string()
        .optional()
        .describe("Short note on what went well or wrong in this attempt."),
      recognition: z
        .enum(["correct", "partial", "wrong", "skipped"])
        .optional()
        .describe(
          "Reviews: did the learner name the right approach before coding? 'skipped' if not asked."
        ),
      stopped: z.enum(["gave_up", "paused"]).optional(),
    },
  },
  safely(
    (args: {
      attempt_id: number;
      stopped?: "gave_up" | "paused";
      recognition?: "correct" | "partial" | "wrong" | "skipped";
      notes?: string;
    }) =>
      finishAttempt({
        attemptId: args.attempt_id,
        notes: args.notes,
        recognition: args.recognition,
        stopped: args.stopped,
      })
  )
);

server.registerTool(
  "add_note",
  {
    description:
      "Save a durable observation about the learner for a concept: the wrong idea behind a miss, or a recurring bug. Say what kind of miss it was (did not think of it, mixed it up with something, slipped while doing it). It shows up in get_problem, get_concept and get_progress in later sessions.",
    inputSchema: {
      concept_id: z.string(),
      slug: z.string().optional(),
      text: z.string(),
    },
  },
  safelyText(
    ({
      concept_id,
      text,
      slug,
    }: {
      concept_id: string;
      text: string;
      slug?: string;
    }) => {
      concept(concept_id);

      if (slug) {
        problemInfo(slug);
      }

      addNote(concept_id, text, slug ?? null);

      return "saved";
    }
  )
);

await server.connect(new StdioServerTransport());
