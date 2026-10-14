#!/usr/bin/env bun
// MCP server: the harness the tutor works through.
// It owns the curriculum (roadmap, concepts, Blind 75 problems), the learner's state,
// test runs, grading and FSRS scheduling. The tutor (Claude) owns the teaching:
// it generates explanations and lesson files on the spot, and the engine verifies them.

import path from "node:path";

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
import { addNote, attemptsFor, notesFor, orphans } from "./db.ts";
import { LESSONS_DIR, runLessonFile, writeLessonFile } from "./lessons.ts";
import type { LessonKind } from "./lessons.ts";
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
      "What to do now, in order: resume an open attempt; reteach a concept the learner struggled with twice; review (the problem that covers the most due concepts, chosen by repetition compression); learn the new concepts of the next unlocked roadmap problem, or practise it; or nothing for now. Call at the start of every session and after each finished attempt. Never tell the learner which concept a review is about.",
    inputSchema: {},
  },
  safely(() => {
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
      "The roadmap: topics in order with prerequisites, solved/total problems per topic, and each concept's stage (unseen, learning, practicing), recall and due date.",
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
        rating: a.rating,
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
      "A concept's key idea, its prerequisites (with the learner's stage for each), the learner's notes, and every Blind 75 problem that uses it, with status. Use it to plan a lesson and to avoid problems the learner will practise.",
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

// ── Lessons (generated by the tutor, verified here) ─────────────────────

server.registerTool(
  "write_lesson_file",
  {
    description: [
      "Verify a lesson file you generated and, if it is sound, write it to the workspace. Tell the learner the returned path.",
      "kind 'example' (step 1 of 3): a solved function the learner reads while you explain it in chat.",
      "kind 'exercise' (step 2 of 3): the same pattern on another problem, with 2-3 key lines replaced by TODO placeholders that still parse (e.g. `while (false /* TODO: condition */)`). Pass the complete code as `solution`.",
      "The engine adds the banners and the check() helper, runs the code, and rejects the file if any check fails, if the unfilled exercise crashes or hangs, or if it uses a practice problem's function name.",
      "Keep it short: one small function, at most ~4 short comments, 3-5 checks. Never use a Blind 75 problem.",
    ].join(" "),
    inputSchema: {
      checks: z
        .string()
        .describe('One check per line: check("label", fn(args), expected)'),
      code: z
        .string()
        .describe("Only the function(s). No banners, no check helper."),
      concept_ids: z
        .array(z.string())
        .min(1)
        .describe(
          "The concepts this lesson teaches; the first names the file."
        ),
      kind: z.enum(["example", "exercise"]),
      language: languageInput,
      solution: z
        .string()
        .optional()
        .describe("Exercise only: the complete code with the TODOs filled in."),
      title: z
        .string()
        .describe("One line, e.g. 'Count pairs whose difference is k.'"),
    },
  },
  safely(
    (args: {
      concept_ids: string[];
      kind: LessonKind;
      language?: Language;
      title: string;
      code: string;
      checks: string;
      solution?: string;
    }) =>
      writeLessonFile({
        checks: args.checks,
        code: args.code,
        conceptIds: args.concept_ids,
        kind: args.kind,
        language: args.language ?? DEFAULT_LANGUAGE,
        solution: args.solution,
        title: args.title,
      })
  )
);

server.registerTool(
  "run_lesson_file",
  {
    description:
      "Run the checks in a lesson file from write_lesson_file, after the learner has filled in the TODO lines. Prints ✓ or ✗ per check.",
    inputSchema: {
      file: z.string().describe("The path write_lesson_file returned."),
    },
  },
  safelyText(({ file }: { file: string }) => {
    const lessonFile = path.resolve(file);

    if (!lessonFile.startsWith(`${LESSONS_DIR}/`)) {
      throw new Error(`Only lesson files under ${LESSONS_DIR} can run.`);
    }

    const run = runLessonFile(
      lessonFile,
      lessonFile.endsWith(".py") ? "python" : "typescript"
    );

    return `${run.passed}/${run.passed + run.failed} checks passed${run.timedOut ? " (timed out)" : ""}\n\n${run.output}`;
  })
);

server.registerTool(
  "complete_lesson",
  {
    description:
      "Mark concepts as taught after a lesson (or when the learner skips it, or after re-teaching). Concepts move to 'learning' and pass on the learner's first independent solve; concepts that no problem practises directly pass right away. Re-teaching resets the struggle count.",
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
      "Create the learner's solution file (statement on top, skeleton below) and open an attempt (or resume the open one). Tell the learner the returned path.",
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
      "Run the learner's solution against the hidden tests and record the result on the open attempt. Shows input, expected and actual output for the first failures.",
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
      "Record a hint before giving it, tagged with the concept it is about (one of the problem's concepts) whenever possible; this is how the engine knows which concept needed help. Levels: 1 = guiding question, 2 = name the concept or data structure, 3 = outline the approach, 4 = show solution code.",
    inputSchema: {
      attempt_id: z.number().int(),
      concept_id: z
        .string()
        .optional()
        .describe(
          "The problem concept this hint is about. Omit only if it is about no particular concept."
        ),
      level: z.number().int().min(1).max(4),
    },
  },
  safely(
    ({
      attempt_id,
      level,
      concept_id,
    }: {
      attempt_id: number;
      level: number;
      concept_id?: string;
    }) => {
      const a = logHint(attempt_id, level, concept_id ?? null);

      return {
        attempt_id,
        hints_used: a.hints_used,
        max_hint_level: a.max_hint_level,
      };
    }
  )
);

server.registerTool(
  "finish_attempt",
  {
    description: [
      "Close an attempt after the teach-back. The engine re-runs the tests and grades each concept separately.",
      "Learning-phase concepts pass on an independent solve (no hint above level 1 on them, verdict ok), otherwise their struggle count goes up and the problem waits a day.",
      "Review-phase concepts get FSRS grades from hints and tests; your diagnosis, explanation and recognition scores and the learner's self-rating can only lower them. Credit then flows to the concepts they encompass.",
      "If the tests do not pass, set stopped: 'gave_up' (the learner gave up) or 'paused' (stopped for outside reasons: nothing is graded).",
    ].join(" "),
    inputSchema: {
      attempt_id: z.number().int(),
      diagnosis: z
        .array(
          // oxlint-disable-next-line sort-keys -- the model fills these in order; it names the verdict before giving a reason
          z.object({
            concept_id: z.string(),
            verdict: z.enum(["ok", "struggled", "failed"]),
            reason: z.string().optional(),
          })
        )
        .optional()
        .describe(
          "From your review of their final code and the session: how they handled each concept. On a give-up, mark the concept(s) that caused it as 'failed'."
        ),
      explanation_score: z
        .number()
        .int()
        .min(0)
        .max(3)
        .describe(
          "0 wrong/missing, 1 vague or wrong complexity, 2 correct approach and complexity, 3 also why it works and edge cases."
        ),
      learner_self_rating: z
        .union([z.literal(1), z.literal(2), z.literal(3), z.literal(4)])
        .optional()
        .describe(
          "Learner's own rating 1-4 (Again/Hard/Good/Easy). It can only lower grades."
        ),
      notes: z
        .string()
        .optional()
        .describe("Short note on what went well or wrong in this attempt."),
      recognition: z
        .enum(["correct", "partial", "wrong", "skipped"])
        .optional()
        .describe(
          "Reviews: did the learner name the right approach before coding? 'skipped' if not asked (lessons)."
        ),
      stopped: z.enum(["gave_up", "paused"]).optional(),
    },
  },
  safely(
    (args: {
      attempt_id: number;
      stopped?: "gave_up" | "paused";
      explanation_score: number;
      recognition?: "correct" | "partial" | "wrong" | "skipped";
      diagnosis?: {
        concept_id: string;
        verdict: "ok" | "struggled" | "failed";
        reason?: string;
      }[];
      learner_self_rating?: 1 | 2 | 3 | 4;
      notes?: string;
    }) =>
      finishAttempt({
        attemptId: args.attempt_id,
        diagnosis: args.diagnosis,
        explanationScore: args.explanation_score,
        learnerSelfRating: args.learner_self_rating,
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
      "Save a durable observation about the learner for a concept, such as a misconception or a recurring bug. It shows up in get_problem, get_concept and get_progress in later sessions.",
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
