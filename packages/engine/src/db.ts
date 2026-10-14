import { Database } from "bun:sqlite";
import { mkdirSync } from "node:fs";
import { join } from "node:path";

import { HOME_DIR, aliases, concepts, problemIndex } from "./content.ts";

/** Stored stages. "locked" and "available" are derived from prerequisites, never stored. */
export type Stage = "unseen" | "learning" | "passed" | "mastered";

export type Phase = "learning" | "review";

export type Outcome = "solved" | "solved_with_help" | "gave_up" | "paused";

export type Recognition = "correct" | "partial" | "wrong" | "skipped";

export interface ConceptRow {
  concept_id: string;
  stage: Stage;
  card: string | null;
  introduced_at: string | null;
  passed_at: string | null;
  mastered_at: string | null;
  fail_count: number;
}

export interface AttemptRow {
  id: number;
  slug: string;
  concept_id: string;
  language: string;
  started_at: string;
  finished_at: string | null;
  phase: Phase | null;
  outcome: Outcome | null;
  recognition: Recognition | null;
  hints_used: number;
  max_hint_level: number;
  test_runs: number;
  last_passed: number | null;
  last_total: number | null;
  gave_up: number;
  explanation_score: number | null;
  rating: number | null;
  notes: string | null;
}

export interface HintRow {
  id: number;
  attempt_id: number;
  concept_id: string | null;
  level: number;
  created_at: string;
}

export interface NoteRow {
  id: number;
  concept_id: string;
  slug: string | null;
  text: string;
  created_at: string;
}

export interface ReviewRow {
  id: number;
  concept_id: string;
  attempt_id: number;
  rating: number;
  reviewed_at: string;
  due: string;
  stability: number;
  difficulty: number;
  implicit_credit: number | null;
  source_concept: string | null;
}

let db: Database | undefined;

function addColumn(
  database: Database,
  table: string,
  column: string,
  definition: string
): void {
  const columns = database
    .query<{ name: string }, []>(`PRAGMA table_info(${table})`)
    .all();

  if (!columns.some((c) => c.name === column)) {
    database.exec(`ALTER TABLE ${table} ADD COLUMN ${column} ${definition}`);
  }
}

/** Create tables, add columns introduced after the first version, and apply id renames. */
function migrate(database: Database): void {
  database.exec(`
    CREATE TABLE IF NOT EXISTS concept_state (
      concept_id    TEXT PRIMARY KEY,
      stage         TEXT NOT NULL DEFAULT 'unseen',
      card          TEXT,
      introduced_at TEXT
    );
    CREATE TABLE IF NOT EXISTS attempts (
      id                INTEGER PRIMARY KEY AUTOINCREMENT,
      slug              TEXT NOT NULL,
      concept_id        TEXT NOT NULL,
      language          TEXT NOT NULL,
      started_at        TEXT NOT NULL,
      finished_at       TEXT,
      hints_used        INTEGER NOT NULL DEFAULT 0,
      max_hint_level    INTEGER NOT NULL DEFAULT 0,
      test_runs         INTEGER NOT NULL DEFAULT 0,
      last_passed       INTEGER,
      last_total        INTEGER,
      gave_up           INTEGER NOT NULL DEFAULT 0,
      explanation_score INTEGER,
      rating            INTEGER,
      notes             TEXT
    );
    CREATE TABLE IF NOT EXISTS reviews (
      id          INTEGER PRIMARY KEY AUTOINCREMENT,
      concept_id  TEXT NOT NULL,
      attempt_id  INTEGER NOT NULL,
      rating      INTEGER NOT NULL,
      reviewed_at TEXT NOT NULL,
      due         TEXT NOT NULL,
      stability   REAL NOT NULL,
      difficulty  REAL NOT NULL
    );
    CREATE TABLE IF NOT EXISTS notes (
      id         INTEGER PRIMARY KEY AUTOINCREMENT,
      concept_id TEXT NOT NULL,
      slug       TEXT,
      text       TEXT NOT NULL,
      created_at TEXT NOT NULL
    );
    CREATE TABLE IF NOT EXISTS hints (
      id         INTEGER PRIMARY KEY AUTOINCREMENT,
      attempt_id INTEGER NOT NULL,
      concept_id TEXT,
      level      INTEGER NOT NULL,
      created_at TEXT NOT NULL
    );
    CREATE TABLE IF NOT EXISTS concept_outcomes (
      attempt_id INTEGER NOT NULL,
      concept_id TEXT NOT NULL,
      verdict    TEXT NOT NULL,
      reason     TEXT,
      PRIMARY KEY (attempt_id, concept_id)
    );
  `);
  addColumn(database, "concept_state", "passed_at", "TEXT");
  addColumn(database, "concept_state", "mastered_at", "TEXT");
  addColumn(
    database,
    "concept_state",
    "fail_count",
    "INTEGER NOT NULL DEFAULT 0"
  );
  addColumn(database, "attempts", "phase", "TEXT");
  addColumn(database, "attempts", "outcome", "TEXT");
  addColumn(database, "attempts", "recognition", "TEXT");
  addColumn(database, "reviews", "implicit_credit", "REAL");
  addColumn(database, "reviews", "source_concept", "TEXT");
  // The first version called passed concepts "practicing".
  database.exec(
    "UPDATE concept_state SET stage = 'passed' WHERE stage = 'practicing'"
  );

  const renames = aliases();

  for (const [from, to] of Object.entries(renames.concepts)) {
    for (const table of [
      "concept_state",
      "attempts",
      "reviews",
      "notes",
      "hints",
      "concept_outcomes",
    ]) {
      database
        .query(
          `UPDATE OR IGNORE ${table} SET concept_id = ? WHERE concept_id = ?`
        )
        .run(to, from);
    }
  }

  for (const [from, to] of Object.entries(renames.problems)) {
    database.query("UPDATE attempts SET slug = ? WHERE slug = ?").run(to, from);
    database.query("UPDATE notes SET slug = ? WHERE slug = ?").run(to, from);
  }
}

export function open(): Database {
  if (db) {
    return db;
  }
  mkdirSync(HOME_DIR, { recursive: true });
  db = new Database(join(HOME_DIR, "progress.db"), {
    create: true,
    strict: true,
  });
  db.exec("PRAGMA journal_mode = WAL;");
  migrate(db);

  return db;
}

/** Learner state that points at ids missing from the curriculum (e.g. after a rename without an alias). */
export function orphans(): string[] {
  const conceptIds = new Set(concepts().map((c) => c.id));
  const slugs = new Set(problemIndex().map((p) => p.slug));
  const found: string[] = [];

  for (const { concept_id } of open()
    .query<{ concept_id: string }, []>(
      "SELECT DISTINCT concept_id FROM concept_state"
    )
    .all()) {
    if (!conceptIds.has(concept_id)) {
      found.push(`concept_state has unknown concept '${concept_id}'`);
    }
  }

  for (const { slug } of open()
    .query<{ slug: string }, []>("SELECT DISTINCT slug FROM attempts")
    .all()) {
    if (!slugs.has(slug)) {
      found.push(`attempts have unknown problem '${slug}'`);
    }
  }

  return found;
}

export function conceptRow(conceptId: string): ConceptRow {
  const row = open()
    .query<ConceptRow, [string]>(
      "SELECT * FROM concept_state WHERE concept_id = ?"
    )
    .get(conceptId);

  return (
    row ?? {
      card: null,
      concept_id: conceptId,
      fail_count: 0,
      introduced_at: null,
      mastered_at: null,
      passed_at: null,
      stage: "unseen",
    }
  );
}

export function saveConceptRow(row: ConceptRow): void {
  open()
    .query(
      `INSERT INTO concept_state (concept_id, stage, card, introduced_at, passed_at, mastered_at, fail_count)
       VALUES ($concept_id, $stage, $card, $introduced_at, $passed_at, $mastered_at, $fail_count)
       ON CONFLICT(concept_id) DO UPDATE SET stage = $stage, card = $card, introduced_at = $introduced_at,
         passed_at = $passed_at, mastered_at = $mastered_at, fail_count = $fail_count`
    )
    .run({ ...row });
}

export function attempt(id: number): AttemptRow {
  const row = open()
    .query<AttemptRow, [number]>("SELECT * FROM attempts WHERE id = ?")
    .get(id);

  if (!row) {
    throw new Error(`Unknown attempt ${id}`);
  }
  return row;
}

export function openAttempt(slug: string, language: string): AttemptRow | null {
  return open()
    .query<AttemptRow, [string, string]>(
      "SELECT * FROM attempts WHERE slug = ? AND language = ? AND finished_at IS NULL ORDER BY id DESC LIMIT 1"
    )
    .get(slug, language);
}

export function attemptsFor(where: {
  slug?: string;
  conceptId?: string;
}): AttemptRow[] {
  if (where.slug) {
    return open()
      .query<AttemptRow, [string]>(
        "SELECT * FROM attempts WHERE slug = ? ORDER BY id"
      )
      .all(where.slug);
  }

  if (where.conceptId) {
    return open()
      .query<AttemptRow, [string]>(
        "SELECT * FROM attempts WHERE concept_id = ? ORDER BY id"
      )
      .all(where.conceptId);
  }

  return open()
    .query<AttemptRow, []>("SELECT * FROM attempts ORDER BY id")
    .all();
}

export function hintsFor(attemptId: number): HintRow[] {
  return open()
    .query<HintRow, [number]>(
      "SELECT * FROM hints WHERE attempt_id = ? ORDER BY id"
    )
    .all(attemptId);
}

export function addHint(
  attemptId: number,
  conceptId: string | null,
  level: number
): void {
  open()
    .query(
      "INSERT INTO hints (attempt_id, concept_id, level, created_at) VALUES (?, ?, ?, ?)"
    )
    .run(attemptId, conceptId, level, new Date().toISOString());
  open()
    .query(
      "UPDATE attempts SET hints_used = hints_used + 1, max_hint_level = MAX(max_hint_level, ?) WHERE id = ?"
    )
    .run(level, attemptId);
}

export function saveConceptOutcome(
  attemptId: number,
  conceptId: string,
  verdict: string,
  reason: string | null
): void {
  open()
    .query(
      "INSERT OR REPLACE INTO concept_outcomes (attempt_id, concept_id, verdict, reason) VALUES (?, ?, ?, ?)"
    )
    .run(attemptId, conceptId, verdict, reason);
}

export function lastExplicitReview(conceptId: string): ReviewRow | null {
  return open()
    .query<ReviewRow, [string]>(
      "SELECT * FROM reviews WHERE concept_id = ? AND implicit_credit IS NULL ORDER BY id DESC LIMIT 1"
    )
    .get(conceptId);
}

export function notesFor(conceptId?: string, limit = 20): NoteRow[] {
  if (conceptId) {
    return open()
      .query<NoteRow, [string, number]>(
        "SELECT * FROM notes WHERE concept_id = ? ORDER BY id DESC LIMIT ?"
      )
      .all(conceptId, limit);
  }

  return open()
    .query<NoteRow, [number]>("SELECT * FROM notes ORDER BY id DESC LIMIT ?")
    .all(limit);
}

export function addNote(
  conceptId: string,
  text: string,
  slug: string | null
): void {
  open()
    .query(
      "INSERT INTO notes (concept_id, slug, text, created_at) VALUES (?, ?, ?, ?)"
    )
    .run(conceptId, slug, text, new Date().toISOString());
}
