#!/usr/bin/env bun
// JSON-lines bridge for the desktop app. The app's main process runs on Node and cannot open
// bun:sqlite, so it spawns this process and sends one request per line:
//   {"id": 1, "method": "session"}  ->  {"id": 1, "result": {...}}
//   {"id": 2, "method": "problem", "params": {"slug": "two-sum"}}  ->  {"id": 2, "result": {...}}
// The app leads the course through it: it opens lessons and reviews, saves and runs the
// learner's code, and hands problems in for grading. The tutor helps beside it, through MCP.

import {
  TASK_MARKER,
  concept,
  concepts,
  course as openCourse,
  courseErrors,
  courseLanguage,
  courses,
  guidedConcept,
  guidedSlugs,
  hasLesson,
  inCourse,
  isAuthored,
  lessonText,
  problem,
  problemIndex,
  problemInfo,
  selectCourse,
  soloConcept,
  soloSlugs,
  topics,
} from "./content.ts";
import type { Difficulty, Language } from "./content.ts";
import {
  addHint,
  closeExercises,
  exerciseRow,
  openAttempt,
  openExercise,
} from "./db.ts";
import type { AttemptRow, Confidence } from "./db.ts";
import { exerciseView, submitExercise } from "./exercises.ts";
import { previewJq, showJson } from "./jq.ts";
import { cardOf } from "./memory.ts";
import {
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
  isOpen,
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

/** The open course as the app names it. */
const subject = () => {
  const { id, initials, kind, name } = openCourse();

  return { id, initials, kind, name };
};

/** A rough time to solve a problem, for the review estimate. A jq task is much shorter. */
const MINUTES: Record<Difficulty, number> = { easy: 8, hard: 25, medium: 15 };
const JQ_MINUTES: Record<Difficulty, number> = { easy: 2, hard: 6, medium: 4 };

const minutes = (difficulty: Difficulty): number =>
  (openCourse().kind === "jq" ? JQ_MINUTES : MINUTES)[difficulty];

/** What a jq task shows beside its statement: the input, the wanted output and how to answer. */
const jqView = (slug: string) => {
  const spec = isAuthored(slug) ? problem(slug).jq : undefined;
  const [shown] = spec?.tests ?? [];

  if (!spec || !shown) {
    return null;
  }

  const predict = spec.mode === "predict";

  return {
    /** The filter a predict task asks about, when it shows one. */
    filter: spec.filter,
    flags: spec.flags,
    /** How many inputs Submit checks beyond the one shown. */
    hidden: predict ? 0 : spec.tests.length - 1,
    input: shown.input_text?.trimEnd() ?? showJson(shown.input),
    mode: spec.mode,
    // A predict task asks for the output, so it is not sent.
    wanted: predict ? "" : (shown.expected ?? ""),
  };
};

/** One problem as the app shows it. It carries no topic, so a review does not give its pattern away. */
const problemView = (slug: string) => {
  const info = problemInfo(slug);

  return {
    difficulty: info.difficulty,
    jq: jqView(slug),
    slug,
    statement: isAuthored(slug) ? problem(slug).statement : null,
    status: problemStatus(slug),
    title: info.title,
  };
};

/** The concept whose lesson an attempt belongs to, or null for a review. */
const lessonOf = (attempt: AttemptRow): string | null => {
  if (attempt.mode === "review") {
    return null;
  }

  return guidedConcept(attempt.slug) ?? soloConcept(attempt.slug);
};

const attemptView = (attempt: AttemptRow) => ({
  id: attempt.id,
  language: attempt.language,
  lesson: lessonOf(attempt),
  mode: attempt.mode,
  slug: attempt.slug,
});

/** What is open right now: the problem being solved, and the tutor's exercise if one is on screen. */
const session = () => {
  const open = currentAttempt();
  const shown = openExercise();

  return {
    attempt: open && attemptView(open),
    exercise: shown && exerciseView(shown),
  };
};

/** The course: topics as chapters and concepts as lessons, with progress. */
const course = () => {
  // The count that names the course covers its own problems, not the extras.
  const listed = problemIndex().filter((p) => !p.source);

  return {
    concepts: {
      learned: concepts().filter((c) => isPassed(c.id)).length,
      total: concepts().length,
    },
    courses: courses().map((c) => ({
      due: inCourse(c.id, dueCount),
      id: c.id,
      initials: c.initials,
      name: c.name,
    })),
    due: dueCount(),
    next_lesson: nextLesson(),
    problems: {
      solved: listed.filter((p) => problemStatus(p.slug) === "solved").length,
      total: listed.length,
    },
    skipped: courseErrors(),
    subject: subject(),
    topics: topics().map((t) => {
      const lessons = concepts()
        .filter((c) => c.topic === t.id)
        .map((c) => ({
          id: c.id,
          name: c.name,
          status: lessonStatus(c.id),
          written: hasLesson(c.id),
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

const conceptOf = (params: Params): string => {
  if (!params?.concept) {
    throw new Error("This method needs a concept id.");
  }

  return params.concept;
};

/** A step's tasks: the one to do now, and how far the learner is. */
const tasks = (slugs: string[], done: (slug: string) => boolean) => {
  const at = slugs.findIndex((s) => !done(s));
  const current = slugs.at(at) ?? slugs[0];

  if (!current) {
    throw new Error("A lesson step has no task.");
  }

  return {
    current,
    progress: { done: at === -1 ? slugs.length : at, total: slugs.length },
  };
};

/** A lesson's guided tasks: one counts as done once it is solved, with or without help. */
const guidedTasks = (id: string) =>
  tasks(guidedSlugs(id), (s) =>
    ["solved", "solved_with_help"].includes(problemStatus(s))
  );

/** A lesson's solo tasks: one counts as done only when it is solved alone. */
const soloTasks = (id: string) =>
  tasks(soloSlugs(id), (s) => problemStatus(s) === "solved");

/**
 * One lesson: its text, the guided task and the solo task to do now, and where the learner
 * stands in it. Most lessons have one task per step; a jq lesson has a few short ones.
 */
const lesson = (params: Params) => {
  const id = conceptOf(params);
  const c = concept(id);
  const open = currentAttempt();
  const mine = open && lessonOf(open) === id ? open : null;
  const guided = guidedTasks(id);
  const solo = soloTasks(id);

  return {
    attempt: mine && attemptView(mine),
    guided: problemView(guided.current),
    guided_tasks: guided.progress,
    id,
    key_idea: c.key_idea,
    name: c.name,
    // A lesson written in parts: one per guided task, then its summary.
    parts: lessonText(id)
      ?.split(TASK_MARKER)
      .map((part) => part.trim()),
    solo: problemView(solo.current),
    solo_tasks: solo.progress,
    status: lessonStatus(id),
    step: lessonStep(id),
    text: lessonText(id),
    topic: topics().find((t) => t.id === c.topic)?.name ?? c.topic,
    wait_until: soloWait(id),
  };
};

/**
 * Start work on a lesson: its guided problem in step 1, its solo problem in step 2. A solo
 * problem that waits after a struggle does not start; the lesson stays readable.
 */
const openLesson = (params: Params) => {
  const id = conceptOf(params);

  if (!isOpen(id)) {
    throw new Error(`The lesson '${concept(id).name}' is still locked.`);
  }

  if (lessonStep(id) === 1) {
    startProblem(guidedTasks(id).current, courseLanguage(), "guided");
  } else if (soloWait(id) === null) {
    startProblem(soloTasks(id).current, courseLanguage(), "solo");
  }

  return lesson(params);
};

/**
 * The learner reopened the lesson while solving its solo problem. That shows the approach,
 * so it counts as help, like a hint that names the concept.
 */
const peekLesson = (params: Params) => {
  const id = conceptOf(params);
  const open = currentAttempt();

  if (
    open?.mode === "solo" &&
    soloSlugs(id).includes(open.slug) &&
    !isPassed(id)
  ) {
    addHint(open.id, id, 2);

    return { counted_as_help: true };
  }

  return { counted_as_help: false };
};

/** What is due in the open course. */
const track = () => {
  const plan = reviewPlan();

  return {
    ...subject(),
    due: dueCount(),
    minutes: plan.reduce((sum, r) => sum + minutes(r.problem.difficulty), 0),
    next_due: nextDue(),
    problems: plan.length,
  };
};

/** What is due, per track. Each course is one track. */
const reviews = () => {
  const tracks = courses().map((c) => inCourse(c.id, track));

  return {
    due: tracks.reduce((sum, t) => sum + t.due, 0),
    minutes: tracks.reduce((sum, t) => sum + t.minutes, 0),
    problems: tracks.reduce((sum, t) => sum + t.problems, 0),
    tracks,
  };
};

/** The next review of the open course, opened. Null when nothing is due in it. */
const reviewHere = () => {
  const open = currentAttempt();

  if (open?.mode === "review") {
    return problemView(open.slug);
  }

  const next = nextReview();

  if (!next) {
    return null;
  }

  startProblem(next.problem.slug, courseLanguage(), "review");

  return problemView(next.problem.slug);
};

/**
 * Open the next review, or resume the one that is open. With `course`, only that track is
 * reviewed. Without it every track is: when the open course has nothing left, the next course
 * with a review due opens. Null when nothing is left.
 */
const startReview = (params: Params) => {
  if (params?.course) {
    selectCourse(params.course);

    return { problem: reviewHere() };
  }

  const here = reviewHere();

  if (here) {
    return { problem: here };
  }

  const other = courses().find((c) => inCourse(c.id, dueCount) > 0);

  if (!other || inCourse(other.id, nextReview) === null) {
    return { problem: null };
  }

  selectCourse(other.id);

  return { problem: reviewHere() };
};

/** The learner chose another course. */
const select = (params: Params) => {
  if (!params?.course) {
    throw new Error("This method needs a course id.");
  }

  selectCourse(params.course);

  return course();
};

/** One request line from the app. */
interface BridgeRequest {
  id: unknown;
  method: string;
  params?: {
    slug?: string;
    text?: string;
    /** An exercise id. */
    id?: number;
    /** A concept id, for the lesson methods. */
    concept?: string;
    /** A course id. */
    course?: string;
    response?: string | string[];
    confidence?: Confidence | null;
  };
}

type Params = BridgeRequest["params"];

const slugOf = (params: Params): string => {
  if (!params?.slug) {
    throw new Error("This method needs a slug.");
  }

  return params.slug;
};

/** The language of the open attempt on a problem, else the default. */
const languageOf = (slug: string): Language => {
  const open = currentAttempt();

  // SAFETY: attempts are opened with a Language, and only `startProblem` inserts them.
  return open?.slug === slug ? (open.language as Language) : courseLanguage();
};

/** The learner's code for a problem. It can be edited only while the tutor has the problem open. */
const readCode = (params: Params) => {
  const slug = slugOf(params);
  const language = languageOf(slug);

  return {
    editable: Boolean(openAttempt(slug, language)),
    language,
    text: readSolution(slug, language),
  };
};

/** What the learner's filter prints on the shown input, as they type. Nothing is recorded. */
const preview = (params: Params) =>
  previewJq(problem(slugOf(params)), params?.text ?? "");

const saveCode = (params: Params) => {
  const slug = slugOf(params);
  saveSolution(slug, languageOf(slug), params?.text ?? "");

  return { saved: true };
};

/** A test run as the app lists it: one row per case, details only where it failed. */
const runView = (run: RunResult) => ({
  cases: run.cases.map((c) => ({
    actual: c.ok ? null : short(c.actual, 120),
    error: c.error?.trim().split("\n").at(-1) ?? null,
    expected: short(c.expected, 120),
    input: short(c.args, 120),
    ok: c.ok,
  })),
  fatal: run.fatal ?? null,
  passed: run.passed,
  total: run.total,
});

const runCode = (params: Params) => {
  const slug = slugOf(params);

  return runView(testSolution(slug, languageOf(slug)).run);
};

/** What grading an attempt did, as the app shows it. */
const resultView = (
  result: ReturnType<typeof finishAttempt>,
  mode: AttemptRow["mode"]
) => ({
  concepts:
    "concepts" in result && result.concepts
      ? result.concepts.map((c) => ({
          effect: c.effect,
          id: c.concept,
          name: c.name,
          next_review:
            c.next_review ?? cardOf(c.concept)?.due.toISOString() ?? null,
          result: c.result,
        }))
      : [],
  mode,
  outcome: result.outcome,
});

/** The learner pressed Submit on a problem. */
const submitCode = (params: Params) => {
  const slug = slugOf(params);
  const language = languageOf(slug);
  const mode = openAttempt(slug, language)?.mode ?? null;
  const handed = submitProblem(slug, language);

  return {
    finished: handed.finished,
    result: handed.result && resultView(handed.result, mode),
    run: runView(handed.run),
  };
};

const giveUpCode = (params: Params) => {
  const slug = slugOf(params);
  const language = languageOf(slug);
  const mode = openAttempt(slug, language)?.mode ?? null;
  const { result, solution } = giveUp(slug, language);

  return { result: resultView(result, mode), solution };
};

const pauseCode = (params: Params) => {
  const slug = slugOf(params);
  pauseAttempt(slug, languageOf(slug));

  return { paused: true };
};

const submit = (params: Params) => {
  if (params?.id === undefined || params.response === undefined) {
    throw new Error("Submitting an exercise needs its id and the response.");
  }

  const result = submitExercise(
    params.id,
    params.response,
    params.confidence ?? null
  );

  return { exercise: exerciseView(exerciseRow(params.id)), result };
};

const closeExercise = () => {
  closeExercises();

  return { closed: true };
};

const methods = new Map<string, (params: Params) => object>([
  ["attempt.give_up", giveUpCode],
  ["attempt.pause", pauseCode],
  ["code.read", readCode],
  ["code.run", runCode],
  ["code.save", saveCode],
  ["code.submit", submitCode],
  ["course", course],
  ["course.select", select],
  ["exercise.close", closeExercise],
  ["exercise.submit", submit],
  ["jq.preview", preview],
  ["lesson", lesson],
  ["lesson.open", openLesson],
  ["lesson.peek", peekLesson],
  ["problem", (params) => problemView(slugOf(params))],
  ["review.next", startReview],
  ["reviews", reviews],
  ["session", session],
]);

// An extra exercise lasts for one sitting. One left open by an earlier run would cover the
// lesson, so the app starts with none on screen.
for (const c of courses()) {
  inCourse(c.id, closeExercises);
  inCourse(c.id, pauseUnknownAttempts);
}

for await (const line of console) {
  if (!line.trim()) {
    continue;
  }

  let id: BridgeRequest["id"] = null;

  try {
    // SAFETY: `id` is only echoed back, a `method` that is not a known name misses the table below, and an unknown slug fails the curriculum lookup.
    const request = JSON.parse(line) as BridgeRequest;
    ({ id } = request);
    const method = methods.get(request.method);

    if (!method) {
      throw new Error(`Unknown method '${request.method}'.`);
    }

    console.log(JSON.stringify({ id, result: method(request.params) }));
  } catch (error) {
    console.log(
      JSON.stringify({
        error: error instanceof Error ? error.message : String(error),
        id,
      })
    );
  }
}
