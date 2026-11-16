#!/usr/bin/env bun
// JSON-lines bridge for the desktop app. The app's main process runs on Node and cannot open
// bun:sqlite, so it spawns this process and sends one request per line:
//   {"id": 1, "method": "session"}  ->  {"id": 1, "result": {...}}
//   {"id": 2, "method": "problem", "params": {"slug": "two-sum"}}  ->  {"id": 2, "result": {...}}
// It reads what the app shows and takes what the learner hands in: code, test runs and
// exercise answers. Everything else changes only through the tutor's MCP tools.

import {
  DEFAULT_LANGUAGE,
  concept,
  concepts,
  isAuthored,
  problem,
  problemIndex,
  problemInfo,
  topics,
} from "./content.ts";
import type { Language } from "./content.ts";
import { exerciseRow, openAttempt, openExercise } from "./db.ts";
import type { Confidence } from "./db.ts";
import { exerciseView, submitExercise } from "./exercises.ts";
import {
  currentAttempt,
  readSolution,
  saveSolution,
  testSolution,
} from "./practice.ts";
import { short } from "./runner.ts";
import type { RunResult } from "./runner.ts";
import {
  conceptStatus,
  isUnlocked,
  newConceptsFor,
  nextUp,
  problemStatus,
} from "./scheduler.ts";

/** One problem as the app shows it: title, statement and what it teaches. */
const problemView = (slug: string) => {
  const info = problemInfo(slug);

  return {
    concept_count: info.concepts.length,
    difficulty: info.difficulty,
    new_concepts: newConceptsFor(slug).map((id) => concept(id).name),
    slug,
    statement: isAuthored(slug) ? problem(slug).statement : null,
    title: info.title,
    topic: info.topic,
  };
};

/** What the learner is on: the tutor's exercise if one is on screen, and the open or next problem. */
const session = () => {
  const next = nextUp();
  const open = currentAttempt();
  const shown = openExercise();
  const slug = open?.slug ?? ("problem" in next ? next.problem : null);

  return {
    attempt: open && {
      id: open.id,
      language: open.language,
      phase: open.phase,
      slug: open.slug,
    },
    exercise: shown && exerciseView(shown),
    next,
    problem: slug ? problemView(slug) : null,
  };
};

/** Topics with their concepts and problems, for the roadmap screen. */
const roadmap = () => {
  const current = session().problem?.topic ?? null;

  return {
    current,
    topics: topics().map((t) => {
      const problems = problemIndex()
        .filter((p) => p.topic === t.id)
        .map((p) => ({
          difficulty: p.difficulty,
          slug: p.slug,
          status: problemStatus(p.slug),
          title: p.title,
          unlocked: isUnlocked(p),
        }));

      const conceptRows = concepts()
        .filter((c) => c.topic === t.id)
        .map((c) => {
          const s = conceptStatus(c.id);

          return {
            due: s.due,
            id: c.id,
            key_idea: c.key_idea,
            name: c.name,
            recall: s.retrievability,
            stage: s.stage,
          };
        });

      return {
        concepts: conceptRows,
        id: t.id,
        name: t.name,
        prereqs: t.prereqs,
        problems,
        solved: problems.filter((p) => p.status === "solved").length,
        total: problems.length,
      };
    }),
  };
};

/** One request line from the app. */
interface BridgeRequest {
  id: unknown;
  method: string;
  params?: {
    slug?: string;
    text?: string;
    id?: number;
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
  return open?.slug === slug ? (open.language as Language) : DEFAULT_LANGUAGE;
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

const methods = new Map<string, (params: Params) => object>([
  ["code.read", readCode],
  ["code.run", runCode],
  ["code.save", saveCode],
  ["exercise.submit", submit],
  ["problem", (params) => problemView(slugOf(params))],
  ["roadmap", roadmap],
  ["session", session],
]);

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
