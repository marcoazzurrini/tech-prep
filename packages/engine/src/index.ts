#!/usr/bin/env bun
// MCP server: what the tutor sees and can do.
// The app leads the course: it opens lessons and reviews and grades what the learner hands
// in. The tutor (Claude) helps beside it: it reads what is on screen, answers questions,
// gives hints, and can show an extra exercise, which the engine verifies.

import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";

import {
  concept,
  courseErrors,
  savedCourse,
  guidedConcept,
  problemsUsing,
  soloConcept,
  solutionPath,
  solutionsDir,
  topics,
  tutorGuide,
  validateCurriculum,
  withPrereqs,
} from "./content.ts";
import type { Course, Language } from "./content.ts";
import { addNote, attemptsFor, notesFor, orphans } from "./db.ts";
import type { Result } from "./db.ts";
import {
  checkingOf,
  isAuthored,
  problemInfo,
  problemLanguage,
  referenceSolution,
} from "./exercises.ts";
import {
  checkOfDraft,
  currentExtra,
  gradeAnswer,
  showExtra,
} from "./extras.ts";
import type { Draft } from "./extras.ts";
import {
  currentAttempt,
  logHint,
  readSolution,
  testSolution,
} from "./practice.ts";
import { PROGRAM_LANGUAGES } from "./program.ts";
import { formatRun } from "./runner.ts";
import { conceptStatus, problemStatus, topicProgress } from "./scheduler.ts";

const server = new McpServer({ name: "tech-prep", version: "0.2.0" });

const languageInput = z
  .string()
  .optional()
  .describe(
    `One of: ${PROGRAM_LANGUAGES.join(", ")}. Defaults to the language the problem is solved in.`
  );

const reply = (text: string) => ({
  content: [{ text, type: "text" as const }],
});

/** Wrap a handler that answers in plain text; a thrown error becomes an error reply. */
const safelyText =
  <A>(fn: (course: Course, args: A) => string) =>
  (args: A) => {
    try {
      // The learner may have switched course in the app since the last call, so every
      // call asks which course is open.
      return reply(fn(savedCourse(), args));
    } catch (error) {
      return {
        ...reply(error instanceof Error ? error.message : String(error)),
        isError: true,
      };
    }
  };

/** Wrap a handler whose result is shown to the model as pretty-printed JSON. */
const safely = <A>(fn: (course: Course, args: A) => object) =>
  safelyText((course, args: A) => JSON.stringify(fn(course, args), null, 2));

const conceptView = (course: Course, id: string) => {
  const c = concept(course, id);
  const s = conceptStatus(course, id);

  return {
    due: s.due,
    id,
    key_idea: c.key_idea,
    learner_notes: notesFor(course, id, 5).map((n) => n.text),
    name: c.name,
    prereqs: c.prereqs,
    recall: s.retrievability,
    stage: s.stage,
    topic: c.topic,
  };
};

/** How the tutor may help, by the reason the problem is open. */
const MODE_RULES = {
  guided:
    "A lesson's guided problem. The lesson is beside it, so explain freely and point at the lesson's worked example. Do not write the solution.",
  review:
    "A review. The learner must choose the approach alone. Never name the concept, the lesson or the pattern unless they ask for a hint, and log the hint first.",
  solo: "A lesson's solo problem, with the lesson closed. It decides whether the concept is learned. Hints above level 1 make it count as solved with help, so log every hint first.",
};

// ── What is on screen ───────────────────────────────────────────────────

server.registerTool(
  "get_session",
  {
    description:
      "What the learner has on screen right now: the problem they are solving, why it is open (a lesson's guided problem, a lesson's solo problem, or a review), the lesson it belongs to, their code, and your exercise if one is showing. `course_guide` holds the course's own teaching rules, and `task` says how the answer is checked. Call it first, every time the learner writes to you, because the app moves on without you. In a review, never say which concept or lesson the problem is about.",
    inputSchema: {},
  },
  safely((course) => {
    const open = currentAttempt(course);

    // Empty unless a course, the curriculum or the progress data is inconsistent.
    const extra = {
      course: course.name,
      // How to tutor this course, in the course's own words.
      course_guide: tutorGuide(course),
      data_warnings: [
        ...courseErrors(),
        ...validateCurriculum(course),
        ...orphans(course),
      ],
    };

    if (!open) {
      return {
        on_screen:
          "No problem is open. The learner is between lessons or reviews.",
        workspace: solutionsDir(course),
        ...extra,
      };
    }

    const lessonId =
      open.mode === "review"
        ? null
        : (guidedConcept(open.slug) ?? soloConcept(course, open.slug));

    const { language } = open;

    return {
      attempt_id: open.id,
      code: readSolution(course, open.slug, language),
      exercise_on_screen: Boolean(currentExtra(course)),
      file: solutionPath(course, open.slug, language),
      hints_so_far: open.max_hint_level,
      language,
      lesson: lessonId && conceptView(course, lessonId),
      mode: open.mode,
      problem: open.slug,
      rules: MODE_RULES[open.mode ?? "review"],
      // How the answer is checked: what the learner types, and what never to give away.
      task: checkingOf(course, open.slug).tutor(),
      title: problemInfo(course, open.slug).title,
      workspace: solutionsDir(course),
      ...extra,
    };
  })
);

server.registerTool(
  "get_roadmap",
  {
    description:
      "The roadmap: topics in order with prerequisites, solved/total problems per topic, and each concept's stage (locked, available, learning, passed, mastered), recall and due date.",
    inputSchema: {},
  },
  safely((course) => topicProgress(course))
);

server.registerTool(
  "get_progress",
  {
    description:
      "Totals, concepts due soon, the weakest concepts, and recent tutor notes about the learner.",
    inputSchema: {},
  },
  safely((course) => {
    const roadmap = topicProgress(course);

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
      recent_notes: notesFor(course, undefined, 10).map((n) => ({
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
        .describe("The problem slug, e.g. get_session's `problem` field."),
    },
  },
  safely(
    (course, { slug, language }: { slug: string; language?: Language }) => {
      const info = problemInfo(course, slug);

      return {
        ...info,
        // oxlint-disable-next-line sort-keys -- shown to the model as-is; keep each attempt in reading order, start time first
        attempts: attemptsFor(course, { slug }).map((a) => ({
          started_at: a.started_at,
          finished: Boolean(a.finished_at),
          hints: a.hints_used,
          outcome: a.outcome,
          notes: a.notes,
        })),
        authored: isAuthored(course, slug),
        concepts: info.concepts.map((id) => conceptView(course, id)),
        reference_solution: referenceSolution(
          course,
          slug,
          language ?? problemLanguage(course, slug)
        ),
        status: problemStatus(course, slug),
      };
    }
  )
);

server.registerTool(
  "get_concept",
  {
    description:
      "A concept's key idea, its prerequisites (with the learner's stage for each), the learner's notes, and every curriculum problem that uses it, with status. Use it to plan a lesson or an exercise and to avoid problems the learner will practise.",
    inputSchema: { concept_id: z.string() },
  },
  safely((course, { concept_id }: { concept_id: string }) => ({
    ...conceptView(course, concept_id),
    prerequisite_chain: withPrereqs(course, [concept_id])
      .slice(0, -1)
      .map((id) => ({ id, stage: conceptStatus(course, id).stage })),
    problems: problemsUsing(course, concept_id).map((p) => ({
      slug: p.slug,
      status: problemStatus(course, p.slug),
      title: p.title,
    })),
  }))
);

server.registerTool(
  "list_topics",
  { description: "Topic ids and names in roadmap order.", inputSchema: {} },
  safely((course) =>
    topics(course).map((t) => ({ id: t.id, name: t.name, prereqs: t.prereqs }))
  )
);

// ── Exercises (written by the tutor, verified here, shown in the app) ────

/** What `show_exercise` takes. */
interface ExerciseArgs {
  kind: Draft["kind"];
  concept_ids: string[];
  language?: Language;
  title: string;
  prompt: string;
  code?: string;
  lines?: string[];
  distractors?: string[];
  rubric?: { concept_id: string; points: string[] }[];
  model_answer?: string;
}

server.registerTool(
  "show_exercise",
  {
    description: [
      "Put one exercise on the learner's screen, in place of the last one. The engine runs the code first and rejects the exercise if it fails, so fix it and call again.",
      "kind 'example': solved code the learner reads while you explain it in chat. Nothing to submit.",
      "kind 'predict': the learner reads `code` and types what it prints. The engine runs the code to get the answer, so the code must print exactly what you ask for, and little of it.",
      "kind 'arrange': the learner puts `lines` in order and sets `distractors` aside. Pass `lines` in the right order; the app shuffles them. The program must print something. One statement per line, indented as it should be.",
      "kind 'answer': an open question answered in the learner's own words. Pass `rubric` (key points per concept) and `model_answer`. You grade it with grade_answer once the app says it was submitted.",
      "The learner answers once: the first answer is the evidence. The app tells you the result. Never use a curriculum problem.",
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
  safely((course, args: ExerciseArgs) =>
    showExtra(course, {
      check: checkOfDraft({ ...args, modelAnswer: args.model_answer }),
      conceptIds: args.concept_ids,
      prompt: args.prompt,
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
  safely(
    (course) => currentExtra(course) ?? { note: "No exercise is on screen." }
  )
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
    (
      course,
      {
        exercise_id,
        verdicts,
      }: {
        exercise_id: number;
        verdicts: { concept_id: string; result: Result; reason?: string }[];
      }
    ) => gradeAnswer(course, exercise_id, verdicts)
  )
);

// ── Practice ────────────────────────────────────────────────────────────

server.registerTool(
  "run_tests",
  {
    description:
      "Run the learner's code against the tests and record the result on the open attempt. The learner has their own Run button, so use this to see the failures yourself.",
    inputSchema: {
      language: languageInput,
      slug: z
        .string()
        .describe("The problem slug, e.g. get_session's `problem` field."),
    },
  },
  safelyText(
    (course, { slug, language }: { slug: string; language?: Language }) => {
      const { run, attempt_id } = testSolution(course, slug, language);

      return `${formatRun(run)}\n\nattempt_id: ${attempt_id ?? "none open"}`;
    }
  )
);

server.registerTool(
  "log_hint",
  {
    description:
      "Record a hint before you give it. It counts for whatever is on screen: the exercise, else the problem. Levels: 1 = a question that redirects attention, 2 = name the concept, 3 = outline the approach, 4 = show the solution. Level 1 still counts as working alone; from level 2 the exercise cannot pass.",
    inputSchema: { level: z.number().int().min(1).max(4) },
  },
  safely((course, { level }: { level: number }) => logHint(course, level))
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
    (
      course,
      {
        concept_id,
        text,
        slug,
      }: {
        concept_id: string;
        text: string;
        slug?: string;
      }
    ) => {
      concept(course, concept_id);

      if (slug) {
        problemInfo(course, slug);
      }

      addNote(course, concept_id, text, slug ?? null);

      return "saved";
    }
  )
);

await server.connect(new StdioServerTransport());
