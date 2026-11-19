import {
  existsSync,
  mkdirSync,
  readdirSync,
  readFileSync,
  renameSync,
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

/** The course format this engine reads. A course written for another one is skipped. */
export const COURSE_FORMAT = 2;

/** What a course calls the things its learner solves. */
export type Noun = "problems" | "tasks" | "exercises";

/** A course: one folder with a `course.json` manifest, a curriculum, lessons and exercises. */
export interface Course {
  /** Stable id. Progress is stored under it, so it never changes. */
  id: string;
  name: string;
  /** Two or three characters for the course's badge. */
  initials: string;
  /** Rises with every content change. The highest version of a course id is the one used. */
  version: number;
  noun: Noun;
  /** Ids the course had before. Progress saved under one of them moves to `id`. */
  formerly: string[];
  dir: string;
  /** True when the course ships with the app. */
  builtin: boolean;
}

// SAFETY: callers only read the curriculum files, which are authored to these shapes and
// checked by `validateCurriculum`.
export const readJson = <T>(file: string): T =>
  JSON.parse(readFileSync(file, "utf-8")) as T;

/** The `course.json` manifest. */
const CourseId = z
  .string()
  .regex(/^[a-z0-9][a-z0-9-]*$/u, "use lowercase letters, digits and dashes");

const Manifest = z.object({
  format: z.number().int().positive(),
  formerly: z.array(CourseId).default([]),
  id: CourseId,
  initials: z.string().min(1).max(3),
  name: z.string().trim().min(1),
  noun: z.enum(["problems", "tasks", "exercises"]).default("exercises"),
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

  const { format, formerly, id, initials, name, noun, version } = parsed.data;

  if (format !== COURSE_FORMAT) {
    throw new Error(
      `it is written in course format ${format}, and this app reads format ${COURSE_FORMAT}`
    );
  }

  for (const file of ["topics.json", "concepts.json", "exercises.json"]) {
    if (!existsSync(path.join(dir, "curriculum", file))) {
      throw new Error(`curriculum/${file} is missing`);
    }
  }

  return { builtin, dir, formerly, id, initials, name, noun, version };
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

/** The course with this id. Throws when no course has it. */
export const courseById = (id: string): Course => {
  const found = courses().find((c) => c.id === id);

  if (!found) {
    throw new Error(`Unknown course '${id}'.`);
  }

  return found;
};

/**
 * The course the learner has open: the one that was chosen last, else the first one. The app
 * and the tutor are separate processes, and each asks this to stay on the same course.
 */
export const savedCourse = (): Course => {
  const saved = savedCourseId();

  // A choice saved under a course's earlier id opens that course.
  const found =
    courses().find((c) => c.id === saved) ??
    courses().find((c) => saved !== null && c.formerly.includes(saved)) ??
    courses()[0];

  if (!found) {
    throw new Error(
      `No course was found. ${courseErrors().join(" ")}`.trimEnd()
    );
  }

  return found;
};

/** Open a course and remember the choice, so the app and the tutor both start on it. */
export const selectCourse = (id: string): Course => {
  const next = courseById(id);

  mkdirSync(HOME_DIR, { recursive: true });
  writeFileSync(STATE_FILE, `${JSON.stringify({ course: id }, null, 2)}\n`);

  return next;
};

const curriculumDir = (course: Course): string =>
  path.join(course.dir, "curriculum");

const exercisesDir = (course: Course): string =>
  path.join(course.dir, "exercises");

export const lessonsDir = (course: Course): string =>
  path.join(course.dir, "lessons");

/** Where the learner's code for a course is saved. A renamed course's folder moves with it. */
export const solutionsDir = (course: Course): string => {
  const dir = path.join(WORKSPACE_DIR, course.id);

  for (const earlier of course.formerly) {
    const old = path.join(WORKSPACE_DIR, earlier);

    if (!existsSync(dir) && existsSync(old)) {
      renameSync(old, dir);
    }
  }

  return dir;
};

/**
 * What an answer is written in, such as "typescript". Each exercise names its own,
 * so the engine keeps no list of them.
 */
export type Language = string;

const EXTENSIONS = new Map([
  ["python", "py"],
  ["typescript", "ts"],
]);

/** The file extension of an answer in a language: its usual one, else the language's name. */
export const extension = (language: Language): string =>
  EXTENSIONS.get(language) ?? language;

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
  /**
   * The curriculum problems its lesson ends on, solved without the lesson: one slug, or a
   * list when the lesson has several short tasks. Read them with `soloSlugs`.
   */
  solo: string | string[];
  /** How many guided tasks the lesson has. One when left out. */
  guided?: number;
}

/**
 * Where a problem comes from. A course's own problems carry no source. An "extra" is one the
 * course added to fill a concept, and is left out of the count that names the course. A
 * "guided" problem belongs to one lesson and is solved with the lesson beside it.
 */
export type ProblemSource = "extra" | "guided";

/** A problem's place in the curriculum: always available, even before its tests are written. */
export interface ProblemInfo {
  slug: string;
  /** The index may leave it out: the exercise's own file can hold the title. */
  title: string;
  topic: string;
  difficulty: Difficulty;
  concepts: string[];
  source?: ProblemSource;
}

/** What was read from one course's files. */
interface Cache {
  topics?: Topic[];
  concepts?: Concept[];
  index?: ProblemInfo[];
}

const caches = new Map<string, Cache>();

const cache = (course: Course): Cache => {
  const { id } = course;
  let current = caches.get(id);

  if (!current) {
    current = {};
    caches.set(id, current);
  }

  return current;
};

/** Topics in roadmap order. */
export const topics = (course: Course): Topic[] => {
  const c = cache(course);
  c.topics ??= readJson<Topic[]>(
    path.join(curriculumDir(course), "topics.json")
  );

  return c.topics;
};

export const concepts = (course: Course): Concept[] => {
  const c = cache(course);
  c.concepts ??= readJson<Concept[]>(
    path.join(curriculumDir(course), "concepts.json")
  );

  return c.concepts;
};

export const concept = (course: Course, id: string): Concept => {
  const found = concepts(course).find((c) => c.id === id);

  if (!found) {
    throw new Error(`Unknown concept '${id}'.`);
  }

  return found;
};

/** All problems in curriculum order (topic order, then the order within each topic). */
export const problemIndex = (course: Course): ProblemInfo[] => {
  const c = cache(course);
  c.index ??= readJson<ProblemInfo[]>(
    path.join(curriculumDir(course), "exercises.json")
  );

  return c.index;
};

/**
 * A lesson's guided problem has the slug `guided-<concept id>` and lives in the lesson's
 * folder. A lesson with several guided tasks numbers the later ones: `guided-<concept id>.2`.
 */
const GUIDED_PREFIX = "guided-";
const GUIDED_NUMBER = /\.(?<n>\d+)$/u;

export const guidedSlug = (conceptId: string, n = 1): string =>
  n === 1
    ? `${GUIDED_PREFIX}${conceptId}`
    : `${GUIDED_PREFIX}${conceptId}.${n}`;

/** The concept a guided problem belongs to, or null for a curriculum problem. */
export const guidedConcept = (slug: string): string | null =>
  slug.startsWith(GUIDED_PREFIX)
    ? slug.slice(GUIDED_PREFIX.length).replace(GUIDED_NUMBER, "")
    : null;

/** Which of its lesson's guided tasks a guided slug is, counted from 1. */
export const guidedNumber = (slug: string): number =>
  Number(GUIDED_NUMBER.exec(slug)?.groups?.n ?? 1);

/** A lesson's guided tasks, in order. */
export const guidedSlugs = (course: Course, conceptId: string): string[] =>
  Array.from({ length: concept(course, conceptId).guided ?? 1 }, (_, i) =>
    guidedSlug(conceptId, i + 1)
  );

/** The problems a lesson ends on, in order. */
export const soloSlugs = (course: Course, conceptId: string): string[] =>
  [concept(course, conceptId).solo].flat();

/** The concept whose lesson ends on this problem, if any. */
export const soloConcept = (course: Course, slug: string): string | null =>
  concepts(course).find((c) => [c.solo].flat().includes(slug))?.id ?? null;

/**
 * A problem's place in the curriculum. A guided problem is not in the index: it belongs to
 * its lesson, is easy, and is named after the concept unless its own file gives a title.
 */
export const problemEntry = (course: Course, slug: string): ProblemInfo => {
  const conceptId = guidedConcept(slug);

  if (conceptId) {
    const c = concept(course, conceptId);

    return {
      concepts: [conceptId],
      difficulty: "easy",
      slug,
      source: "guided",
      title: c.name,
      topic: c.topic,
    };
  }

  const found = problemIndex(course).find((p) => p.slug === slug);

  if (!found) {
    throw new Error(`Unknown problem '${slug}'.`);
  }

  return found;
};

/**
 * The folder that holds an exercise: its statement, how it is checked and its answer key.
 * A lesson's guided exercises sit in the lesson's folder, numbered from 1.
 */
export const exerciseDir = (course: Course, slug: string): string => {
  const conceptId = guidedConcept(slug);

  return conceptId
    ? path.join(
        lessonsDir(course),
        conceptId,
        "exercises",
        String(guidedNumber(slug))
      )
    : path.join(exercisesDir(course), slug);
};

/** How to tutor this course, in the course's own words. Null when it gives no guide. */
export const tutorGuide = (course: Course): string | null => {
  const file = path.join(course.dir, "tutor.md");

  return existsSync(file) ? readFileSync(file, "utf-8").trim() : null;
};

/** The lesson text for a concept, or null when it is not written yet. */
export const lessonText = (
  course: Course,
  conceptId: string
): string | null => {
  const file = path.join(lessonsDir(course), conceptId, "lesson.md");

  return existsSync(file) ? readFileSync(file, "utf-8") : null;
};

export const problemsUsing = (
  course: Course,
  conceptId: string
): ProblemInfo[] =>
  problemIndex(course).filter((p) => p.concepts.includes(conceptId));

export interface Aliases {
  concepts: Record<string, string>;
  problems: Record<string, string>;
}

/** Old id -> new id, so learner progress follows a rename. */
export const aliases = (course: Course): Aliases => {
  const file = path.join(curriculumDir(course), "aliases.json");

  if (!existsSync(file)) {
    return { concepts: {}, problems: {} };
  }

  const raw = readJson<Partial<Aliases>>(file);

  return { concepts: raw.concepts ?? {}, problems: raw.problems ?? {} };
};

/** A concept plus all of its prerequisites, prerequisites first. */
export const withPrereqs = (course: Course, conceptIds: string[]): string[] => {
  const ordered: string[] = [];

  const visit = (id: string) => {
    if (ordered.includes(id)) {
      return;
    }

    for (const p of concept(course, id).prereqs) {
      visit(p);
    }

    ordered.push(id);
  };

  for (const id of conceptIds) {
    visit(id);
  }

  return ordered;
};

/** Every lesson ends on its own problems, and they need nothing taught later. */
const soloErrors = (course: Course, conceptIds: Set<string>): string[] => {
  const errors: string[] = [];
  const solos = new Set<string>();

  for (const c of concepts(course)) {
    const known = new Set(
      conceptIds.has(c.id) ? withPrereqs(course, [c.id]) : []
    );

    for (const slug of [c.solo].flat()) {
      const solo = problemIndex(course).find((p) => p.slug === slug);

      if (!solo) {
        errors.push(`concept ${c.id}: unknown solo problem ${slug}`);
        continue;
      }

      if (solos.has(slug)) {
        errors.push(`concept ${c.id}: solo problem ${slug} is used twice`);
      }

      solos.add(slug);

      if (!solo.concepts.includes(c.id)) {
        errors.push(`concept ${c.id}: solo problem ${slug} does not use it`);
      }

      for (const other of solo.concepts) {
        if (!known.has(other)) {
          errors.push(
            `concept ${c.id}: solo problem ${slug} needs ${other}, which is not a prerequisite`
          );
        }
      }
    }
  }

  return errors;
};

/** Structural problems in the curriculum files. An empty list means the curriculum is sound. */
export const validateCurriculum = (course: Course): string[] => {
  const errors: string[] = [];
  const topicIds = new Set(topics(course).map((t) => t.id));
  const conceptIds = new Set(concepts(course).map((c) => c.id));
  const seen = new Set<string>();

  for (const t of topics(course)) {
    for (const p of t.prereqs) {
      if (!topicIds.has(p)) {
        errors.push(`topic ${t.id}: unknown prerequisite ${p}`);
      }
    }
  }

  for (const c of concepts(course)) {
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

    for (const p of concept(course, id).prereqs) {
      visit(p, [...trail, id]);
    }

    state.set(id, "done");
  };

  for (const c of concepts(course)) {
    visit(c.id, []);
  }

  const slugs = new Set<string>();

  for (const p of problemIndex(course)) {
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

  return [...errors, ...soloErrors(course, conceptIds)];
};

export const solutionPath = (
  course: Course,
  slug: string,
  language: Language
): string => path.join(solutionsDir(course), `${slug}.${extension(language)}`);

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
