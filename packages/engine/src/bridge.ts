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
import { conceptStatus, isUnlocked, newConceptsFor, nextUp, problemStatus } from "./scheduler.ts";

/** The problem the learner is on: the open attempt, else the one next_up points at. */
function session() {
  const next = nextUp();
  const open = attemptsFor({}).filter((a) => !a.finished_at).at(-1) ?? null;
  const slug = open?.slug ?? ("problem" in next ? next.problem : null);
  if (!slug) return { next, attempt: null, problem: null };
  const info = problemInfo(slug);
  return {
    next,
    attempt: open && { id: open.id, slug: open.slug, phase: open.phase, language: open.language },
    problem: {
      slug,
      title: info.title,
      topic: info.topic,
      difficulty: info.difficulty,
      statement: isAuthored(slug) ? problem(slug).statement : null,
      concept_count: info.concepts.length,
      new_concepts: newConceptsFor(slug).map((id) => concept(id).name),
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
          slug: p.slug,
          title: p.title,
          difficulty: p.difficulty,
          status: problemStatus(p.slug),
          unlocked: isUnlocked(p),
        }));
      const conceptRows = concepts()
        .filter((c) => c.topic === t.id)
        .map((c) => {
          const s = conceptStatus(c.id);
          return { id: c.id, name: c.name, key_idea: c.key_idea, stage: s.stage, due: s.due, recall: s.retrievability };
        });
      return {
        id: t.id,
        name: t.name,
        prereqs: t.prereqs,
        solved: problems.filter((p) => p.status === "solved").length,
        total: problems.length,
        concepts: conceptRows,
        problems,
      };
    }),
  };
}

const methods: Record<string, () => unknown> = { session, roadmap };

for await (const line of console) {
  if (!line.trim()) continue;
  let id: unknown = null;
  try {
    const request = JSON.parse(line) as { id: unknown; method: string };
    id = request.id;
    const method = methods[request.method];
    if (!method) throw new Error(`Unknown method '${request.method}'.`);
    console.log(JSON.stringify({ id, result: method() }));
  } catch (error) {
    console.log(JSON.stringify({ id, error: error instanceof Error ? error.message : String(error) }));
  }
}
