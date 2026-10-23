#!/usr/bin/env bun
// Read-only JSON-lines bridge for the desktop app. The app's main process runs on Node and
// cannot open bun:sqlite, so it spawns this process and sends one request per line:
//   {"id": 1, "method": "session"}  ->  {"id": 1, "result": {...}}
//   {"id": 2, "method": "problem", "params": {"slug": "two-sum"}}  ->  {"id": 2, "result": {...}}
// The tutor still changes state only through the MCP tools.

import {
  concept,
  concepts,
  isAuthored,
  problem,
  problemIndex,
  problemInfo,
  topics,
} from "./content.ts";
import { attemptsFor } from "./db.ts";
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

/** The problem the learner is on: the open attempt, else the one next_up points at. */
const session = () => {
  const next = nextUp();

  const open = attemptsFor({}).findLast((a) => !a.finished_at) ?? null;

  const slug = open?.slug ?? ("problem" in next ? next.problem : null);

  if (!slug) {
    return { attempt: null, next, problem: null };
  }

  return {
    attempt: open && {
      id: open.id,
      language: open.language,
      phase: open.phase,
      slug: open.slug,
    },
    next,
    problem: problemView(slug),
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
  params?: { slug?: string };
}

/** Any problem by slug, so the learner can read one before the tutor gets there. */
const problemBySlug = (params: BridgeRequest["params"]) => {
  if (!params?.slug) {
    throw new Error("The problem method needs a slug.");
  }

  return problemView(params.slug);
};

const methods = new Map<string, (params: BridgeRequest["params"]) => object>([
  ["problem", problemBySlug],
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
