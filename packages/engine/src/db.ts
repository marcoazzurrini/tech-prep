import { Database } from "bun:sqlite";
import { existsSync, mkdirSync, renameSync } from "node:fs";
import path from "node:path";

import { HOME_DIR, aliases, concepts, problemIndex } from "./content.ts";
import type { Course, Language } from "./content.ts";

/** Stored stages. "locked" and "available" are derived from prerequisites, never stored. */
export type Stage = "unseen" | "learning" | "passed" | "mastered";

export type Phase = "learning" | "review";

/** Why an attempt was opened: a lesson's guided problem, its solo problem, or a review. */
export type Mode = "guided" | "solo" | "review";

export type Outcome = "solved" | "solved_with_help" | "gave_up" | "paused";

export type Recognition = "correct" | "partial" | "wrong" | "skipped";

/** What a tutor-made exercise asks the learner to do. An example is only read. */
export type ExerciseKind = "example" | "predict" | "arrange" | "answer";

export type Confidence = "low" | "medium" | "high";

/** Pass or fail for one concept. */
export type Result = "pass" | "fail";

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
  language: Language;
  started_at: string;
  finished_at: string | null;
  phase: Phase | null;
  mode: Mode | null;
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

/** A tutor-made exercise. JSON columns hold text; `exercises.ts` parses them. */
export interface ExerciseRow {
  id: number;
  kind: ExerciseKind;
  /** JSON list of target concept ids. */
  concepts: string;
  language: string;
  title: string;
  prompt: string;
  /** What the learner sees: the code to read, or a JSON list of shuffled lines. */
  body: string;
  /** The hidden answer key, as JSON. */
  answer: string;
  created_at: string;
  response: string | null;
  confidence: Confidence | null;
  submitted_at: string | null;
  /** JSON list of `{ concept, result, reason }`, set once graded. */
  results: string | null;
  graded_at: string | null;
  closed_at: string | null;
  max_hint_level: number;
}

export interface ReviewRow {
  id: number;
  concept_id: string;
  /** 0 when the review came from an exercise. */
  attempt_id: number;
  exercise_id: number | null;
  rating: number;
  reviewed_at: string;
  due: string;
  stability: number;
  difficulty: number;
  implicit_credit: number | null;
  source_concept: string | null;
}

/** One database per course, opened on first use. */
const dbs = new Map<string, Database>();

const addColumn = (
  database: Database,
  table: string,
  column: string,
  definition: string
): void => {
  const columns = database
    .query<{ name: string }, []>(`PRAGMA table_info(${table})`)
    .all();

  if (!columns.some((c) => c.name === column)) {
    database.exec(`ALTER TABLE ${table} ADD COLUMN ${column} ${definition}`);
  }
};

/** Create tables, add columns introduced after the first version, and apply id renames. */
const migrate = (course: Course, database: Database): void => {
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
    CREATE TABLE IF NOT EXISTS exercises (
      id             INTEGER PRIMARY KEY AUTOINCREMENT,
      kind           TEXT NOT NULL,
      concepts       TEXT NOT NULL,
      language       TEXT NOT NULL,
      title          TEXT NOT NULL,
      prompt         TEXT NOT NULL,
      body           TEXT NOT NULL,
      answer         TEXT NOT NULL,
      created_at     TEXT NOT NULL,
      response       TEXT,
      confidence     TEXT,
      submitted_at   TEXT,
      results        TEXT,
      graded_at      TEXT,
      closed_at      TEXT,
      max_hint_level INTEGER NOT NULL DEFAULT 0
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
  addColumn(database, "attempts", "mode", "TEXT");
  addColumn(database, "reviews", "implicit_credit", "REAL");
  addColumn(database, "reviews", "source_concept", "TEXT");
  addColumn(database, "reviews", "exercise_id", "INTEGER");
  // The first version called passed concepts "practicing".
  database.exec(
    "UPDATE concept_state SET stage = 'passed' WHERE stage = 'practicing'"
  );

  const renames = aliases(course);

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
};

const PROGRESS_DIR = path.join(HOME_DIR, "progress");

/** The course whose progress lived in `progress.db` before each course had its own file. */
const FIRST_COURSE = "interview";

/** Move the single database of earlier versions to its course's file. */
const adoptOldDatabase = (file: string): void => {
  const old = path.join(HOME_DIR, "progress.db");

  if (existsSync(file) || !existsSync(old)) {
    return;
  }

  for (const suffix of ["", "-wal", "-shm"]) {
    if (existsSync(old + suffix)) {
      renameSync(old + suffix, file + suffix);
    }
  }
};

/** A course's progress database, opened on first use. */
export const open = (course: Course): Database => {
  const { id } = course;
  const current = dbs.get(id);

  if (current) {
    return current;
  }

  mkdirSync(PROGRESS_DIR, { recursive: true });
  const file = path.join(PROGRESS_DIR, `${id}.db`);

  if (id === FIRST_COURSE) {
    adoptOldDatabase(file);
  }

  const db = new Database(file, { create: true, strict: true });
  db.exec("PRAGMA journal_mode = WAL;");
  migrate(course, db);
  dbs.set(id, db);

  return db;
};

/** Learner state that points at ids missing from the curriculum (e.g. after a rename without an alias). */
export const orphans = (course: Course): string[] => {
  const conceptIds = new Set(concepts(course).map((c) => c.id));
  const slugs = new Set(problemIndex(course).map((p) => p.slug));
  const found: string[] = [];

  for (const { concept_id } of open(course)
    .query<{ concept_id: string }, []>(
      "SELECT DISTINCT concept_id FROM concept_state"
    )
    .all()) {
    if (!conceptIds.has(concept_id)) {
      found.push(`concept_state has unknown concept '${concept_id}'`);
    }
  }

  for (const { slug } of open(course)
    .query<{ slug: string }, []>("SELECT DISTINCT slug FROM attempts")
    .all()) {
    if (!slugs.has(slug)) {
      found.push(`attempts have unknown problem '${slug}'`);
    }
  }

  return found;
};

export const conceptRow = (course: Course, conceptId: string): ConceptRow => {
  const row = open(course)
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
};

export const saveConceptRow = (course: Course, row: ConceptRow): void => {
  open(course)
    .query(
      `INSERT INTO concept_state (concept_id, stage, card, introduced_at, passed_at, mastered_at, fail_count)
       VALUES ($concept_id, $stage, $card, $introduced_at, $passed_at, $mastered_at, $fail_count)
       ON CONFLICT(concept_id) DO UPDATE SET stage = $stage, card = $card, introduced_at = $introduced_at,
         passed_at = $passed_at, mastered_at = $mastered_at, fail_count = $fail_count`
    )
    .run({ ...row });
};

export const attempt = (course: Course, id: number): AttemptRow => {
  const row = open(course)
    .query<AttemptRow, [number]>("SELECT * FROM attempts WHERE id = ?")
    .get(id);

  if (!row) {
    throw new Error(`Unknown attempt ${id}`);
  }

  return row;
};

export const openAttempt = (
  course: Course,
  slug: string,
  language: string
): AttemptRow | null =>
  open(course)
    .query<AttemptRow, [string, string]>(
      "SELECT * FROM attempts WHERE slug = ? AND language = ? AND finished_at IS NULL ORDER BY id DESC LIMIT 1"
    )
    .get(slug, language);

export const attemptsFor = (
  course: Course,
  where: {
    slug?: string;
    conceptId?: string;
  }
): AttemptRow[] => {
  if (where.slug) {
    return open(course)
      .query<AttemptRow, [string]>(
        "SELECT * FROM attempts WHERE slug = ? ORDER BY id"
      )
      .all(where.slug);
  }

  if (where.conceptId) {
    return open(course)
      .query<AttemptRow, [string]>(
        "SELECT * FROM attempts WHERE concept_id = ? ORDER BY id"
      )
      .all(where.conceptId);
  }

  return open(course)
    .query<AttemptRow, []>("SELECT * FROM attempts ORDER BY id")
    .all();
};

export const addHint = (
  course: Course,
  attemptId: number,
  conceptId: string | null,
  level: number
): void => {
  open(course)
    .query(
      "INSERT INTO hints (attempt_id, concept_id, level, created_at) VALUES (?, ?, ?, ?)"
    )
    .run(attemptId, conceptId, level, new Date().toISOString());
  open(course)
    .query(
      "UPDATE attempts SET hints_used = hints_used + 1, max_hint_level = MAX(max_hint_level, ?) WHERE id = ?"
    )
    .run(level, attemptId);
};

export const lastExplicitReview = (
  course: Course,
  conceptId: string
): ReviewRow | null =>
  open(course)
    .query<ReviewRow, [string]>(
      "SELECT * FROM reviews WHERE concept_id = ? AND implicit_credit IS NULL ORDER BY id DESC LIMIT 1"
    )
    .get(conceptId);

export const notesFor = (
  course: Course,
  conceptId?: string,
  limit = 20
): NoteRow[] => {
  if (conceptId) {
    return open(course)
      .query<NoteRow, [string, number]>(
        "SELECT * FROM notes WHERE concept_id = ? ORDER BY id DESC LIMIT ?"
      )
      .all(conceptId, limit);
  }

  return open(course)
    .query<NoteRow, [number]>("SELECT * FROM notes ORDER BY id DESC LIMIT ?")
    .all(limit);
};

export const addNote = (
  course: Course,
  conceptId: string,
  text: string,
  slug: string | null
): void => {
  open(course)
    .query(
      "INSERT INTO notes (concept_id, slug, text, created_at) VALUES (?, ?, ?, ?)"
    )
    .run(conceptId, slug, text, new Date().toISOString());
};

export const exerciseRow = (course: Course, id: number): ExerciseRow => {
  const row = open(course)
    .query<ExerciseRow, [number]>("SELECT * FROM exercises WHERE id = ?")
    .get(id);

  if (!row) {
    throw new Error(`Unknown exercise ${id}`);
  }

  return row;
};

/** The exercise on screen: the newest one the tutor has not moved on from. */
export const openExercise = (course: Course): ExerciseRow | null =>
  open(course)
    .query<ExerciseRow, []>(
      "SELECT * FROM exercises WHERE closed_at IS NULL ORDER BY id DESC LIMIT 1"
    )
    .get();

/** The tutor moved on: nothing stays on screen from earlier exercises. */
export const closeExercises = (course: Course, now = new Date()): void => {
  open(course)
    .query("UPDATE exercises SET closed_at = ? WHERE closed_at IS NULL")
    .run(now.toISOString());
};

export const exercisesFor = (
  course: Course,
  conceptId: string,
  limit = 5
): ExerciseRow[] =>
  open(course)
    .query<ExerciseRow, [string, number]>(
      `SELECT * FROM exercises WHERE EXISTS (SELECT 1 FROM json_each(exercises.concepts) WHERE value = ?)
       ORDER BY id DESC LIMIT ?`
    )
    .all(conceptId, limit);
