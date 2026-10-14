#!/usr/bin/env bun
// Read-only JSON-lines bridge for the desktop app. The app's main process runs on Node and
// cannot open bun:sqlite, so it spawns this process and sends one request per line:
//   {"id": 1, "method": "session"}  ->  {"id": 1, "result": {...}}
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

/** The problem the learner is on: the open attempt, else the one next_up points at. */
function session() {
  const next = nextUp();
  const open =
    attemptsFor({})
      .filter((a) => !a.finished_at)
      .at(-1) ?? null;
  const slug = open?.slug ?? ("problem" in next ? next.problem : null);

  if (!slug) {
    return { next, attempt: null, problem: null };
  }
  const info = problemInfo(slug);

  return {
    attempt: open && {
      id: open.id,
      slug: open.slug,
      phase: open.phase,
      language: open.language,
    },
    next,
    problem: {
      concept_count: info.concepts.length,
      difficulty: info.difficulty,
      new_concepts: newConceptsFor(slug).map((id) => concept(id).name),
      slug,
      statement: isAuthored(slug) ? problem(slug).statement : null,
      title: info.title,
      topic: info.topic,
    },
  };
}

/** Topics with their concepts and problems, for the roadmap screen. */
function roadmap() {
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
}

const methods: Record<string, () => unknown> = { roadmap, session };

for await (const line of console) {
  if (!line.trim()) {
    continue;
  }
  let id: unknown = null;

  try {
    const request = JSON.parse(line) as { id: unknown; method: string };
    id = request.id;
    const method = methods[request.method];

    if (!method) {
      throw new Error(`Unknown method '${request.method}'.`);
    }
    console.log(JSON.stringify({ id, result: method() }));
  } catch (error) {
    console.log(
      JSON.stringify({
        error: error instanceof Error ? error.message : String(error),
        id,
      })
    );
  }
}
