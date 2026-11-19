import {
  existsSync,
  mkdirSync,
  readdirSync,
  readFileSync,
  writeFileSync,
} from "node:fs";
import { homedir } from "node:os";
import path from "node:path";

import { z } from "zod";

/**
 * The courses that ship with the app. The packaged app points `TECHPREP_STARTERS` at its own
 * copy; from the repo it is the `@tech-prep/starters` package.
 */
const STARTERS_DIR =
  process.env.TECHPREP_STARTERS ??
  path.dirname(
    Bun.resolveSync("@tech-prep/starters/package.json", import.meta.dir)
  );

export const HOME_DIR =
  process.env.TECHPREP_HOME ?? path.join(homedir(), ".tech-prep");

/** Courses added beside the app. The app finds them at startup, with no reinstall. */
export const COURSES_DIR =
  process.env.TECHPREP_COURSES ?? path.join(HOME_DIR, "courses");

export const WORKSPACE_DIR = path.join(HOME_DIR, "workspace");

/** The newest course format this engine reads. A course that needs a newer one is skipped. */
export const COURSE_FORMAT = 1;

/** A course: one folder with a `course.json` manifest, a curriculum, lessons and problems. */
export interface Course {
  /** Stable id. Progress is stored under it, so it never changes. */
  id: string;
  name: string;
  /** Two or three characters for the course's badge. */
  initials: string;
  /** Rises with every content change. The highest version of a course id is the one used. */
  version: number;
  dir: string;
  /** True when the course ships with the app. */
  builtin: boolean;
}

// SAFETY: callers only read the curriculum and problem files, which are authored to these
// shapes and checked by `validateCurriculum` and `build-problem`.
const readJson = <T>(file: string): T =>
  JSON.parse(readFileSync(file, "utf-8")) as T;

/** The `course.json` manifest. */
const Manifest = z.object({
  format: z.number().int().positive(),
  id: z
    .string()
    .regex(/^[a-z0-9][a-z0-9-]*$/u, "use lowercase letters, digits and dashes"),
  initials: z.string().min(1).max(3),
  name: z.string().trim().min(1),
  version: z.number().int(),
});

/** Read one course folder. Throws with the reason when the course cannot be used. */
const readCourse = (dir: string, builtin: boolean): Course => {
  const parsed = Manifest.safeParse(
    JSON.parse(readFileSync(path.join(dir, "course.json"), "utf-8"))
  );

  if (!parsed.success) {
    const [issue] = parsed.error.issues;

    throw new Error(
      `course.json: \`${issue?.path.join(".") ?? ""}\` ${issue?.message ?? "is not valid"}`
    );
  }

  const { format, id, initials, name, version } = parsed.data;

  if (format > COURSE_FORMAT) {
    throw new Error(
      `it needs course format ${format}, and this app reads up to ${COURSE_FORMAT}`
    );
  }

  for (const file of ["topics.json", "concepts.json", "problems.json"]) {
    if (!existsSync(path.join(dir, "curriculum", file))) {
      throw new Error(`curriculum/${file} is missing`);
    }
  }

  return { builtin, dir, id, initials, name, version };
};

interface Found {
  courses: Course[];
  /** One line per course folder that could not be used. */
  errors: string[];
}

let scanned: Found | undefined;

/**
 * Scan the built-in folder, then the folder beside the app. A broken course is reported and
 * skipped, so it never hides the others. When two folders hold the same course id, the higher
 * version is used; on a tie the one beside the app wins, so a draft can be tried as it is.
 */
const discover = (): Found => {
  const byId = new Map<string, Course>();
  const errors: string[] = [];

  for (const [root, builtin] of [
    [STARTERS_DIR, true],
    [COURSES_DIR, false],
  ] as const) {
    const folders = existsSync(root)
      ? readdirSync(root, { withFileTypes: true })
          .filter((entry) => entry.isDirectory())
          .map((entry) => path.join(root, entry.name))
          .filter((dir) => existsSync(path.join(dir, "course.json")))
          .toSorted()
      : [];

    for (const dir of folders) {
      try {
        const next = readCourse(dir, builtin);
        const current = byId.get(next.id);

        if (!current || next.version >= current.version) {
          byId.set(next.id, next);
        }
      } catch (error) {
        errors.push(
          `Course in ${dir} was skipped: ${error instanceof Error ? error.message : String(error)}.`
        );
      }
    }
  }

  return { courses: [...byId.values()], errors };
};

/** Every usable course, built-in ones first. */
export const courses = (): Course[] => {
  scanned ??= discover();

  return scanned.courses;
};

/** Why a course folder was skipped. Empty when every folder could be read. */
export const courseErrors = (): string[] => {
  scanned ??= discover();

  return scanned.errors;
};

/** The file that remembers which course the learner has open. The app and the tutor share it. */
const STATE_FILE = path.join(HOME_DIR, "state.json");

const State = z.object({ course: z.string() });

const savedCourseId = (): string | null => {
  try {
    return State.parse(JSON.parse(readFileSync(STATE_FILE, "utf-8"))).course;
  } catch {
    return null;
  }
};

let active: Course | undefined;

const findCourse = (id: string | null): Course | undefined =>
  courses().find((c) => c.id === id);

/** The course every other function reads from: the one the learner has open. */
export const course = (): Course => {
  active ??= findCourse(savedCourseId()) ?? courses()[0];

  if (!active) {
    throw new Error(
      `No course was found. ${courseErrors().join(" ")}`.trimEnd()
    );
  }

  return active;
};

/** Read from another course from now on. Nothing is saved. */
export const setCourse = (id: string): Course => {
  const next = findCourse(id);

  if (!next) {
    throw new Error(`Unknown course '${id}'.`);
  }

  active = next;

  return next;
};

/** Open a course and remember the choice, so the app and the tutor both start on it. */
export const selectCourse = (id: string): Course => {
  const next = setCourse(id);

  mkdirSync(HOME_DIR, { recursive: true });
  writeFileSync(STATE_FILE, `${JSON.stringify({ course: id }, null, 2)}\n`);

  return next;
};

/** Follow the course the app has open. The tutor calls this before it answers. */
export const followSavedCourse = (): void => {
  const saved = findCourse(savedCourseId());

  if (saved) {
    active = saved;
  }
};

/** Run `fn` against another course, then return to the open one. */
export const inCourse = <T>(id: string, fn: () => T): T => {
  const before = course();

  setCourse(id);

  try {
    return fn();
  } finally {
    active = before;
  }
};

const curriculumDir = (): string => path.join(course().dir, "curriculum");
const problemsDir = (): string => path.join(course().dir, "problems");
const lessonsDir = (): string => path.join(course().dir, "lessons");

/** Where the learner's solution files for the open course live. */
export const solutionsDir = (): string => path.join(WORKSPACE_DIR, course().id);

export type Language = "python" | "typescript";

export const LANGUAGES: Language[] = ["python", "typescript"];

export const EXTENSIONS: Record<Language, string> = {
  python: "py",
  typescript: "ts",
};

export const DEFAULT_LANGUAGE: Language =
  process.env.TECHPREP_LANG === "python" ? "python" : "typescript";

export type Difficulty = "easy" | "medium" | "hard";

/** A node of the roadmap, e.g. "Two Pointers". Topics order the path. */
export interface Topic {
  id: string;
  name: string;
  prereqs: string[];
}

/** A small, teachable skill inside a topic, e.g. "Fast and Slow Pointers". FSRS schedules these. */
export interface Concept {
  id: string;
  name: string;
  topic: string;
  prereqs: string[];
  /** "Practising this concept also practises w of that one." Hand-set, only on prerequisite edges. */
  encompasses: { id: string; w: number }[];
  key_idea: string;
  /** The curriculum problem its lesson ends on, solved without the lesson. */
  solo: string;
}

/**
 * Where a problem comes from. The NeetCode 150 problems carry no source. An "extra" fills a
 * concept the list has no problem for. A "guided" problem belongs to one lesson and is solved
 * with the lesson beside it.
 */
export type ProblemSource = "extra" | "guided";

/** A problem's place in the curriculum: always available, even before its tests are written. */
export interface ProblemInfo {
  slug: string;
  title: string;
  topic: string;
  difficulty: Difficulty;
  concepts: string[];
  source?: ProblemSource;
}

/**
 * How a returned value is compared with the expected one.
 * - exact: deep equality.
 * - unordered: the top-level array may be in any order.
 * - deep-unordered: every nested array may be in any order (e.g. lists of groups).
 * - one-of: `expected` is a list of acceptable answers.
 */
export type CompareMode = "exact" | "unordered" | "deep-unordered" | "one-of";

export interface TestCase {
  args: unknown[];
  /** Method names for design problems; the first entry is the constructor. */
  ops?: string[];
  expected?: unknown;
}

/** How the harness calls a solution. See server/src/harness/*_harness.* for the semantics. */
export interface CallSpec {
  kind?: "function" | "design" | "roundtrip";
  function?: Record<Language, string>;
  class?: string;
  encode?: string;
  decode?: string;
  /** Roundtrip value type. */
  type?: string;
  /** Argument types: "json" (default), "ListNode", "ListNode[]", "CycleList", "TreeNode", "TreeNodeRef", "GraphNode", "RandomList". */
  params?: string[];
  /** Return type: "json" (default), "ListNode", "TreeNode", "TreeNodeVal", "GraphNode", "RandomList", "void". */
  returns?: string;
  /** "arg0" when the function changes its first argument in place and returns nothing. */
  output?: "return" | "arg0";
}

export interface Problem extends ProblemInfo, CallSpec {
  compare: CompareMode;
  stubs: Record<Language, string>;
  tests: TestCase[];
  statement: string;
}

/** What was read from one course's files. */
interface Cache {
  topics?: Topic[];
  concepts?: Concept[];
  index?: ProblemInfo[];
  problems: Map<string, Problem>;
}

const caches = new Map<string, Cache>();

const cache = (): Cache => {
  const { id } = course();
  let current = caches.get(id);

  if (!current) {
    current = { problems: new Map() };
    caches.set(id, current);
  }

  return current;
};

/** Topics in roadmap order. */
export const topics = (): Topic[] => {
  const c = cache();
  c.topics ??= readJson<Topic[]>(path.join(curriculumDir(), "topics.json"));

  return c.topics;
};

export const concepts = (): Concept[] => {
  const c = cache();
  c.concepts ??= readJson<Concept[]>(
    path.join(curriculumDir(), "concepts.json")
  );

  return c.concepts;
};

export const concept = (id: string): Concept => {
  const found = concepts().find((c) => c.id === id);

  if (!found) {
    throw new Error(`Unknown concept '${id}'.`);
  }

  return found;
};

/** All problems in curriculum order (topic order, then the order within each topic). */
export const problemIndex = (): ProblemInfo[] => {
  const c = cache();
  c.index ??= readJson<ProblemInfo[]>(
    path.join(curriculumDir(), "problems.json")
  );

  return c.index;
};

/** A lesson's guided problem has the slug `guided-<concept id>` and lives in the lesson's folder. */
const GUIDED_PREFIX = "guided-";

export const guidedSlug = (conceptId: string): string =>
  `${GUIDED_PREFIX}${conceptId}`;

/** The concept a guided problem belongs to, or null for a curriculum problem. */
export const guidedConcept = (slug: string): string | null =>
  slug.startsWith(GUIDED_PREFIX) ? slug.slice(GUIDED_PREFIX.length) : null;

/** The folder holding a problem's statement, spec and reference solutions. */
export const problemDir = (slug: string): string => {
  const conceptId = guidedConcept(slug);

  return conceptId
    ? path.join(lessonsDir(), conceptId)
    : path.join(problemsDir(), slug);
};

export const problemInfo = (slug: string): ProblemInfo => {
  const conceptId = guidedConcept(slug);

  if (conceptId) {
    const c = concept(conceptId);
    const spec = path.join(lessonsDir(), conceptId, "spec.json");

    return {
      concepts: [conceptId],
      difficulty: "easy",
      slug,
      source: "guided",
      title: existsSync(spec)
        ? (readJson<{ title?: string }>(spec).title ?? c.name)
        : c.name,
      topic: c.topic,
    };
  }

  const found = problemIndex().find((p) => p.slug === slug);

  if (!found) {
    throw new Error(`Unknown problem '${slug}'.`);
  }

  return found;
};

/** True when the problem has a statement and tests, so it can be practised. */
export const isAuthored = (slug: string): boolean =>
  existsSync(path.join(problemDir(slug), "spec.json")) &&
  existsSync(path.join(problemDir(slug), "problem.md"));

/** The lesson text for a concept, or null when it is not written yet. */
export const lessonText = (conceptId: string): string | null => {
  const file = path.join(lessonsDir(), conceptId, "lesson.md");

  return existsSync(file) ? readFileSync(file, "utf-8") : null;
};

/** True when a concept has its lesson text, its guided problem and its solo problem. */
export const hasLesson = (conceptId: string): boolean =>
  lessonText(conceptId) !== null &&
  isAuthored(guidedSlug(conceptId)) &&
  isAuthored(concept(conceptId).solo);

export const problem = (slug: string): Problem => {
  const cached = cache().problems.get(slug);

  if (cached) {
    return cached;
  }

  const info = problemInfo(slug);

  if (!isAuthored(slug)) {
    throw new Error(`Problem '${slug}' has no tests yet.`);
  }

  const spec = readJson<Omit<Problem, keyof ProblemInfo | "statement">>(
    path.join(problemDir(slug), "spec.json")
  );

  const statement = readFileSync(
    path.join(problemDir(slug), "problem.md"),
    "utf-8"
  );

  const full: Problem = { ...spec, ...info, statement };
  cache().problems.set(slug, full);

  return full;
};

/** The tutor's answer key for a problem, if one exists. */
export const referenceSolution = (
  slug: string,
  language: Language
): string | null => {
  const file = path.join(problemDir(slug), `reference.${EXTENSIONS[language]}`);

  return existsSync(file) ? readFileSync(file, "utf-8") : null;
};

export const problemsUsing = (conceptId: string): ProblemInfo[] =>
  problemIndex().filter((p) => p.concepts.includes(conceptId));

export interface Aliases {
  concepts: Record<string, string>;
  problems: Record<string, string>;
}

/** Old id -> new id, so learner progress follows a rename. */
export const aliases = (): Aliases => {
  const file = path.join(curriculumDir(), "aliases.json");

  if (!existsSync(file)) {
    return { concepts: {}, problems: {} };
  }

  const raw = readJson<Partial<Aliases>>(file);

  return { concepts: raw.concepts ?? {}, problems: raw.problems ?? {} };
};

/** A concept plus all of its prerequisites, prerequisites first. */
export const withPrereqs = (conceptIds: string[]): string[] => {
  const ordered: string[] = [];

  const visit = (id: string) => {
    if (ordered.includes(id)) {
      return;
    }

    for (const p of concept(id).prereqs) {
      visit(p);
    }

    ordered.push(id);
  };

  for (const id of conceptIds) {
    visit(id);
  }

  return ordered;
};

/** Every lesson ends on its own problem, and that problem needs nothing taught later. */
const soloErrors = (conceptIds: Set<string>): string[] => {
  const errors: string[] = [];
  const solos = new Set<string>();

  for (const c of concepts()) {
    const solo = problemIndex().find((p) => p.slug === c.solo);

    if (!solo) {
      errors.push(`concept ${c.id}: unknown solo problem ${c.solo}`);
      continue;
    }

    if (solos.has(c.solo)) {
      errors.push(`concept ${c.id}: solo problem ${c.solo} is used twice`);
    }

    solos.add(c.solo);

    if (!solo.concepts.includes(c.id)) {
      errors.push(`concept ${c.id}: solo problem ${c.solo} does not use it`);
    }

    const known = new Set(conceptIds.has(c.id) ? withPrereqs([c.id]) : []);

    for (const other of solo.concepts) {
      if (!known.has(other)) {
        errors.push(
          `concept ${c.id}: solo problem ${c.solo} needs ${other}, which is not a prerequisite`
        );
      }
    }
  }

  return errors;
};

/** Structural problems in the curriculum files. An empty list means the curriculum is sound. */
export const validateCurriculum = (): string[] => {
  const errors: string[] = [];
  const topicIds = new Set(topics().map((t) => t.id));
  const conceptIds = new Set(concepts().map((c) => c.id));
  const seen = new Set<string>();

  for (const t of topics()) {
    for (const p of t.prereqs) {
      if (!topicIds.has(p)) {
        errors.push(`topic ${t.id}: unknown prerequisite ${p}`);
      }
    }
  }

  for (const c of concepts()) {
    if (seen.has(c.id)) {
      errors.push(`concept ${c.id}: duplicate id`);
    }

    seen.add(c.id);

    if (!topicIds.has(c.topic)) {
      errors.push(`concept ${c.id}: unknown topic ${c.topic}`);
    }

    for (const p of c.prereqs) {
      if (!conceptIds.has(p)) {
        errors.push(`concept ${c.id}: unknown prerequisite ${p}`);
      }
    }

    for (const e of c.encompasses ?? []) {
      if (!c.prereqs.includes(e.id)) {
        errors.push(
          `concept ${c.id}: encompasses ${e.id}, which is not a prerequisite`
        );
      }

      if (!(e.w >= 0 && e.w <= 1)) {
        errors.push(
          `concept ${c.id}: encompassing weight ${e.w} is outside 0-1`
        );
      }
    }
  }

  // Prerequisites must form a DAG.
  const state = new Map<string, "visiting" | "done">();

  const visit = (id: string, trail: string[]) => {
    if (state.get(id) === "done" || !conceptIds.has(id)) {
      return;
    }

    if (state.get(id) === "visiting") {
      errors.push(`prerequisite cycle: ${[...trail, id].join(" -> ")}`);

      return;
    }

    state.set(id, "visiting");

    for (const p of concept(id).prereqs) {
      visit(p, [...trail, id]);
    }

    state.set(id, "done");
  };

  for (const c of concepts()) {
    visit(c.id, []);
  }

  const slugs = new Set<string>();

  for (const p of problemIndex()) {
    if (slugs.has(p.slug)) {
      errors.push(`problem ${p.slug}: duplicate slug`);
    }

    slugs.add(p.slug);

    if (!topicIds.has(p.topic)) {
      errors.push(`problem ${p.slug}: unknown topic ${p.topic}`);
    }

    for (const c of p.concepts) {
      if (!conceptIds.has(c)) {
        errors.push(`problem ${p.slug}: unknown concept ${c}`);
      }
    }
  }

  return [...errors, ...soloErrors(conceptIds)];
};

/** The name the harness calls, for function problems. */
export const functionName = (
  p: Problem,
  language: Language
): string | undefined => p.function?.[language];

/** Generic names that lessons may define freely, even though a practice problem uses them. */
const GENERIC_NAMES = new Set([
  "is_valid",
  "isValid",
  "find_min",
  "findMin",
  "get_sum",
  "getSum",
]);

/**
 * Practice-problem function names a lesson must not define, so generated lessons never
 * solve a practice problem. One-word names (search, merge, rob, ...) are too common to block.
 */
export const reservedNames = (language: Language): Set<string> => {
  const names = new Set<string>();

  for (const info of problemIndex()) {
    if (!isAuthored(info.slug)) {
      continue;
    }

    const name = problem(info.slug).function?.[language];

    if (name && /[A-Z_]/u.test(name) && !GENERIC_NAMES.has(name)) {
      names.add(name);
    }
  }

  return names;
};

export const solutionPath = (slug: string, language: Language): string =>
  path.join(solutionsDir(), `${slug}.${EXTENSIONS[language]}`);

/** Word-wrap one line of prose for comment headers in solution and lesson files. */
export const wrap = (line: string, width: number): string[] => {
  if (line.length <= width) {
    return [line];
  }

  const lines: string[] = [];
  let current = "";

  for (const word of line.split(" ")) {
    if (current && current.length + word.length + 1 > width) {
      lines.push(current);
      current = word;
    } else {
      current = current ? `${current} ${word}` : word;
    }
  }

  return [...lines, current];
};
