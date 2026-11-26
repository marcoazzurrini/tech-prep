#!/usr/bin/env bun
// JSON-lines bridge for the desktop app. The app's main process runs on Node and cannot open
// bun:sqlite, so it spawns this process and sends one request per line:
//   {"id": 1, "method": "session"}  ->  {"id": 1, "result": {...}}
//   {"id": 2, "method": "problem", "params": {"slug": "two-sum"}}  ->  {"id": 2, "result": {...}}
// The app leads the course through it: it opens lessons and reviews, saves and runs the
// learner's code, and hands problems in for grading. The tutor helps beside it, through MCP.

import { z } from "zod";

import {
  concept,
  concepts,
  courseErrors,
  courses,
  guidedConcept,
  problemIndex,
  savedCourse,
  selectCourse,
  soloConcept,
  soloSlugs,
  topics,
} from "./content.ts";
import type { Course, ProblemInfo } from "./content.ts";
import type { Method, Methods } from "./contract.ts";
import { addHint, closeExtras, extraRow, openExtra } from "./db.ts";
import type { AttemptRow } from "./db.ts";
import {
  checkView,
  checkingOf,
  hasLesson,
  isAuthored,
  previewAnswer,
  problem,
  problemInfo,
  problemLanguage,
} from "./exercises.ts";
import { extraView, submitExtra } from "./extras.ts";
import {
  guidedProgress,
  lessonParts,
  movesOn,
  soloProgress,
  startLesson,
} from "./lessons.ts";
import { cardOf } from "./memory.ts";
import {
  attemptOn,
  currentAttempt,
  giveUp,
  pauseAttempt,
  pauseUnknownAttempts,
  readSolution,
  saveSolution,
  startProblem,
  submitProblem,
  testSolution,
} from "./practice.ts";
import type { finishAttempt } from "./practice.ts";
import { short } from "./runner.ts";
import type { RunResult } from "./runner.ts";
import {
  dueCount,
  isPassed,
  lessonStatus,
  lessonStep,
  nextDue,
  nextLesson,
  nextReview,
  problemStatus,
  reviewPlan,
  soloWait,
} from "./scheduler.ts";

/** A course as the app names it. */
const subject = (course: Course) => {
  const { id, initials, name, noun } = course;

  return { id, initials, name, noun };
};

/** A rough time to solve a problem, for the review estimate. */
const minutes = (course: Course, { slug, difficulty }: ProblemInfo): number =>
  isAuthored(course, slug) ? checkingOf(course, slug).minutes[difficulty] : 0;

/** One problem as the app shows it. It carries no topic, so a review does not give its pattern away. */
const problemView = (course: Course, slug: string) => {
  const info = problemInfo(course, slug);

  return {
    // How the answer is checked, and what that shows. Null while it is not written.
    check: checkView(course, slug),
    difficulty: info.difficulty,
    slug,
    statement: isAuthored(course, slug)
      ? problem(course, slug).statement
      : null,
    status: problemStatus(course, slug),
    title: info.title,
  };
};

/** The concept whose lesson an attempt belongs to, or null for a review. */
const lessonOf = (course: Course, attempt: AttemptRow): string | null => {
  if (attempt.mode === "review") {
    return null;
  }

  return guidedConcept(attempt.slug) ?? soloConcept(course, attempt.slug);
};

const attemptView = (course: Course, attempt: AttemptRow) => ({
  id: attempt.id,
  language: attempt.language,
  lesson: lessonOf(course, attempt),
  mode: attempt.mode,
  slug: attempt.slug,
});

/** What is open right now: the problem being solved, and the tutor's exercise if one is on screen. */
const session = (course: Course) => {
  const open = currentAttempt(course);
  const shown = openExtra(course);

  return {
    attempt: open && attemptView(course, open),
    exercise: shown && extraView(course, shown),
  };
};

/** The course: topics as chapters and concepts as lessons, with progress. */
const courseView = (course: Course) => {
  // The count that names the course covers its own problems, not the extras.
  const listed = problemIndex(course).filter((p) => !p.source);

  return {
    concepts: {
      learned: concepts(course).filter((c) => isPassed(course, c.id)).length,
      total: concepts(course).length,
    },
    courses: courses().map((c) => ({
      due: dueCount(c),
      id: c.id,
      initials: c.initials,
      name: c.name,
    })),
    due: dueCount(course),
    next_lesson: nextLesson(course),
    problems: {
      solved: listed.filter((p) => problemStatus(course, p.slug) === "solved")
        .length,
      total: listed.length,
    },
    skipped: courseErrors(),
    subject: subject(course),
    topics: topics(course).map((t) => {
      const lessons = concepts(course)
        .filter((c) => c.topic === t.id)
        .map((c) => ({
          id: c.id,
          name: c.name,
          status: lessonStatus(course, c.id),
          written: hasLesson(course, c.id),
        }));

      return {
        id: t.id,
        learned: lessons.filter((l) => l.status === "done").length,
        lessons,
        name: t.name,
        total: lessons.length,
      };
    }),
  };
};

/**
 * One lesson: its parts, the guided task and the solo task to do now, and where the learner
 * stands in it.
 */
const lesson = (course: Course, id: string) => {
  const c = concept(course, id);
  const open = currentAttempt(course);
  const mine = open && lessonOf(course, open) === id ? open : null;
  const guided = guidedProgress(course, id);
  const solo = soloProgress(course, id);

  return {
    attempt: mine && attemptView(course, mine),
    guided: problemView(course, guided.current),
    guided_tasks: { done: guided.done, total: guided.total },
    id,
    key_idea: c.key_idea,
    name: c.name,
    // One part per guided task. Empty while the lesson is not written.
    parts: lessonParts(course, id),
    solo: problemView(course, solo.current),
    solo_tasks: { done: solo.done, total: solo.total },
    status: lessonStatus(course, id),
    step: lessonStep(course, id),
    topic: topics(course).find((t) => t.id === c.topic)?.name ?? c.topic,
    wait_until: soloWait(course, id),
  };
};

/**
 * Open a lesson, and start its next task when there is one to start. With `practise`, a
 * lesson that is already learned starts again too.
 */
const openLesson = (
  course: Course,
  { concept: id, practise }: Params<"lesson.open">
) => {
  startLesson(course, id, practise ?? false);

  return lesson(course, id);
};

/**
 * The learner reopened the lesson while solving its solo problem. That shows the approach,
 * so it counts as help, like a hint that names the concept.
 */
const peekLesson = (course: Course, { concept: id }: Params<"lesson.peek">) => {
  const open = currentAttempt(course);

  if (
    open?.mode === "solo" &&
    soloSlugs(course, id).includes(open.slug) &&
    !isPassed(course, id)
  ) {
    addHint(course, open.id, id, 2);

    return { counted_as_help: true };
  }

  return { counted_as_help: false };
};

/** What is due in one course. */
const track = (course: Course) => {
  const plan = reviewPlan(course);

  return {
    ...subject(course),
    due: dueCount(course),
    minutes: plan.reduce((sum, r) => sum + minutes(course, r.problem), 0),
    next_due: nextDue(course),
    problems: plan.length,
  };
};

/** What is due, per track. Each course is one track. */
const reviews = () => {
  const tracks = courses().map(track);

  return {
    due: tracks.reduce((sum, t) => sum + t.due, 0),
    minutes: tracks.reduce((sum, t) => sum + t.minutes, 0),
    problems: tracks.reduce((sum, t) => sum + t.problems, 0),
    tracks,
  };
};

/** The next review of a course, opened. Null when nothing is due in it. */
const reviewHere = (course: Course) => {
  const open = currentAttempt(course);

  if (open?.mode === "review") {
    return problemView(course, open.slug);
  }

  const next = nextReview(course);

  if (!next) {
    return null;
  }

  startProblem(course, next.problem.slug, "review");

  return problemView(course, next.problem.slug);
};

/**
 * Open the next review, or resume the one that is open. With `course`, only that track is
 * reviewed. Without it every track is: when the open course has nothing left, the next course
 * with a review due opens. Null when nothing is left.
 */
const startReview = (course: Course, params: Params<"review.next">) => {
  if (params?.course) {
    return { problem: reviewHere(selectCourse(params.course)) };
  }

  const here = reviewHere(course);

  if (here) {
    return { problem: here };
  }

  const other = courses().find((c) => dueCount(c) > 0);

  if (!other || nextReview(other) === null) {
    return { problem: null };
  }

  return { problem: reviewHere(selectCourse(other.id)) };
};

/** The learner chose another course. */
const select = (_open: Course, { course }: Params<"course.select">) =>
  courseView(selectCourse(course));

type Params<M extends Method> = Methods[M]["params"];

type Slug = Params<"problem">;

/** The open attempt, when it is on this problem. Null for a problem that is only shown. */
const openOn = (course: Course, slug: string): AttemptRow | null => {
  const open = currentAttempt(course);

  return open?.slug === slug ? open : null;
};

/** The learner's code for a problem. It can be edited only while the tutor has the problem open. */
const readCode = (course: Course, { slug }: Slug) => {
  const open = openOn(course, slug);
  const language = open?.language ?? problemLanguage(course, slug);

  return {
    editable: Boolean(open),
    language,
    text: readSolution(course, slug, language),
  };
};

/** What the learner's text prints on the shown input, as they type. Nothing is recorded. */
const preview = (course: Course, { slug, text }: Params<"answer.preview">) => {
  const seen = previewAnswer(course, slug, text);

  if (!seen) {
    throw new Error("This exercise shows no output while typing.");
  }

  return seen;
};

const saveCode = (course: Course, { slug, text }: Params<"code.save">) => {
  saveSolution(course, attemptOn(course, slug), text);

  return { saved: true };
};

/** A test run as the app lists it: one row per case, details only where it failed. */
const runView = (run: RunResult) => ({
  cases: run.cases.map((c) => ({
    actual: c.ok ? null : short(c.actual, 120),
    error: c.error?.trim().split("\n").at(-1) ?? null,
    expected: short(c.expected, 120),
    input: c.shown ?? short(c.args, 120),
    ok: c.ok,
  })),
  fatal: run.fatal ?? null,
  passed: run.passed,
  total: run.total,
});

const runCode = (course: Course, { slug }: Slug) => {
  const language =
    openOn(course, slug)?.language ?? problemLanguage(course, slug);

  return runView(testSolution(course, slug, language).run);
};

/** What grading an attempt did, as the app shows it. */
const resultView = (
  course: Course,
  result: ReturnType<typeof finishAttempt>,
  attempt: AttemptRow
) => ({
  concepts:
    "concepts" in result && result.concepts
      ? result.concepts.map((c) => ({
          effect: c.effect,
          id: c.concept,
          // The approach in a sentence, to show when the concept was missed.
          key_idea: concept(course, c.concept).key_idea,
          name: c.name,
          next_review:
            c.next_review ??
            cardOf(course, c.concept)?.due.toISOString() ??
            null,
          result: c.result,
        }))
      : [],
  mode: attempt.mode,
  // True when the app opens the next task by itself.
  moves_on: movesOn(course, attempt, lessonOf(course, attempt), result.outcome),
  outcome: result.outcome,
});

/** The learner pressed Submit on a problem. */
const submitCode = (course: Course, { slug }: Slug) => {
  const open = attemptOn(course, slug);
  const handed = submitProblem(course, open);

  return {
    finished: handed.finished,
    result: handed.result && resultView(course, handed.result, open),
    run: runView(handed.run),
  };
};

const giveUpCode = (course: Course, { slug }: Slug) => {
  const open = attemptOn(course, slug);
  const { result, solution } = giveUp(course, open);

  return { result: resultView(course, result, open), solution };
};

const pauseCode = (course: Course, { slug }: Slug) => {
  const open = openOn(course, slug);

  if (open) {
    pauseAttempt(course, open);
  }

  return { paused: true };
};

const submit = (
  course: Course,
  { id, response }: Params<"exercise.submit">
) => {
  const result = submitExtra(course, id, response, null);

  return { exercise: extraView(course, extraRow(course, id)), result };
};

const closeExercise = (course: Course) => {
  closeExtras(course);

  return { closed: true };
};

/**
 * Every method of the contract. Each gets the course the learner has open, then the
 * request's parameters. The type holds each reply to the shape the app expects.
 */
type Handlers = {
  [M in Method]: (
    course: Course,
    params: Methods[M]["params"]
  ) => Methods[M]["result"];
};

const handlers: Handlers = {
  "answer.preview": preview,
  "attempt.give_up": giveUpCode,
  "attempt.pause": pauseCode,
  "code.read": readCode,
  "code.run": runCode,
  "code.save": saveCode,
  "code.submit": submitCode,
  course: courseView,
  "course.select": select,
  "exercise.close": closeExercise,
  "exercise.submit": submit,
  "lesson.open": openLesson,
  "lesson.peek": peekLesson,
  problem: (course, { slug }) => problemView(course, slug),
  "review.next": startReview,
  reviews,
  session,
};

const none = z.undefined();
const slugOnly = z.object({ slug: z.string().min(1) });

/** What each method must be sent. A request that does not fit is refused, with the reason. */
type ParamSchemas = { [M in Method]: z.ZodType<Methods[M]["params"]> };

const PARAMS: ParamSchemas = {
  "answer.preview": z.object({ slug: z.string().min(1), text: z.string() }),
  "attempt.give_up": slugOnly,
  "attempt.pause": slugOnly,
  "code.read": slugOnly,
  "code.run": slugOnly,
  "code.save": z.object({ slug: z.string().min(1), text: z.string() }),
  "code.submit": slugOnly,
  course: none,
  "course.select": z.object({ course: z.string().min(1) }),
  "exercise.close": none,
  "exercise.submit": z.object({
    id: z.number().int(),
    response: z.union([z.string(), z.array(z.string())]),
  }),
  "lesson.open": z.object({
    concept: z.string().min(1),
    practise: z.boolean().optional(),
  }),
  "lesson.peek": z.object({ concept: z.string().min(1) }),
  problem: slugOnly,
  "review.next": z.object({ course: z.string().optional() }).optional(),
  reviews: none,
  session: none,
};

const isMethod = (name: string): name is Method =>
  Object.hasOwn(handlers, name);

/** Answer one request: check its parameters, then run its method on the open course. */
const answer = <M extends Method>(
  method: M,
  // oxlint-disable-next-line anti-slop/no-unknown-parameters -- whatever the request line held, checked just below
  raw: unknown
): Methods[M]["result"] => {
  const params = PARAMS[method].safeParse(raw ?? undefined);

  if (!params.success) {
    const [issue] = params.error.issues;

    throw new Error(
      `'${method}' was sent wrong parameters: \`${issue?.path.join(".") ?? ""}\` ${issue?.message ?? "is not valid"}.`
    );
  }

  return handlers[method](savedCourse(), params.data);
};

/** One request line from the app. */
const Request = z.object({
  id: z.unknown().optional(),
  method: z.string(),
  params: z.unknown().optional(),
});

// An extra exercise lasts for one sitting. One left open by an earlier run would cover the
// lesson, so the app starts with none on screen.
for (const c of courses()) {
  closeExtras(c);
  pauseUnknownAttempts(c);
}

/** The reply to one request line: the method's result, or why it could not be given. */
const respond = (line: string) => {
  let request: z.infer<typeof Request> | undefined;

  try {
    request = Request.parse(JSON.parse(line));

    if (!isMethod(request.method)) {
      throw new Error(`Unknown method '${request.method}'.`);
    }

    return {
      id: request.id,
      result: answer(request.method, request.params),
    };
  } catch (error) {
    return {
      error: error instanceof Error ? error.message : String(error),
      id: request?.id ?? null,
    };
  }
};

for await (const line of console) {
  if (line.trim()) {
    console.log(JSON.stringify(respond(line)));
  }
}
