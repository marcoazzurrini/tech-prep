import { existsSync, readFileSync } from "node:fs";
import { homedir } from "node:os";
import { join } from "node:path";

export const PLUGIN_ROOT = join(import.meta.dir, "..", "..");
export const CONTENT_DIR = join(PLUGIN_ROOT, "content");
export const CURRICULUM_DIR = join(CONTENT_DIR, "curriculum");
export const PROBLEMS_DIR = join(CONTENT_DIR, "problems");
export const HOME_DIR = process.env.TECHPREP_HOME ?? join(homedir(), ".tech-prep");
export const WORKSPACE_DIR = join(HOME_DIR, "workspace");

export type Language = "python" | "typescript";
export const LANGUAGES: Language[] = ["python", "typescript"];
export const EXTENSIONS: Record<Language, string> = { python: "py", typescript: "ts" };
export const DEFAULT_LANGUAGE: Language = process.env.TECHPREP_LANG === "python" ? "python" : "typescript";

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
}

/** A problem's place in the curriculum: always available, even before its tests are written. */
export interface ProblemInfo {
  slug: string;
  title: string;
  topic: string;
  difficulty: Difficulty;
  concepts: string[];
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
  /** Argument types: "json" (default), "ListNode", "ListNode[]", "CycleList", "TreeNode", "TreeNodeRef", "GraphNode". */
  params?: string[];
  /** Return type: "json" (default), "ListNode", "TreeNode", "TreeNodeVal", "GraphNode", "void". */
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

function readJson<T>(path: string): T {
  return JSON.parse(readFileSync(path, "utf8")) as T;
}

let topicsCache: Topic[] | undefined;
let conceptsCache: Concept[] | undefined;
let indexCache: ProblemInfo[] | undefined;
const problemCache = new Map<string, Problem>();

/** Topics in roadmap order. */
export function topics(): Topic[] {
  topicsCache ??= readJson<Topic[]>(join(CURRICULUM_DIR, "topics.json"));
  return topicsCache;
}

export function concepts(): Concept[] {
  conceptsCache ??= readJson<Concept[]>(join(CURRICULUM_DIR, "concepts.json"));
  return conceptsCache;
}

export function concept(id: string): Concept {
  const found = concepts().find((c) => c.id === id);
  if (!found) throw new Error(`Unknown concept '${id}'.`);
  return found;
}

/** All problems in curriculum order (topic order, then the order within each topic). */
export function problemIndex(): ProblemInfo[] {
  indexCache ??= readJson<ProblemInfo[]>(join(CURRICULUM_DIR, "problems.json"));
  return indexCache;
}

export function problemInfo(slug: string): ProblemInfo {
  const found = problemIndex().find((p) => p.slug === slug);
  if (!found) throw new Error(`Unknown problem '${slug}'.`);
  return found;
}

/** True when the problem has a statement and tests, so it can be practised. */
export function isAuthored(slug: string): boolean {
  return existsSync(join(PROBLEMS_DIR, slug, "spec.json")) && existsSync(join(PROBLEMS_DIR, slug, "problem.md"));
}

export function problem(slug: string): Problem {
  const cached = problemCache.get(slug);
  if (cached) return cached;
  const info = problemInfo(slug);
  if (!isAuthored(slug)) throw new Error(`Problem '${slug}' has no tests yet.`);
  const spec = readJson<Omit<Problem, keyof ProblemInfo | "statement">>(join(PROBLEMS_DIR, slug, "spec.json"));
  const statement = readFileSync(join(PROBLEMS_DIR, slug, "problem.md"), "utf8");
  const full: Problem = { ...spec, ...info, statement };
  problemCache.set(slug, full);
  return full;
}

/** The tutor's answer key for a problem, if one exists. */
export function referenceSolution(slug: string, language: Language): string | null {
  const path = join(PROBLEMS_DIR, slug, `reference.${EXTENSIONS[language]}`);
  return existsSync(path) ? readFileSync(path, "utf8") : null;
}

export function problemsUsing(conceptId: string): ProblemInfo[] {
  return problemIndex().filter((p) => p.concepts.includes(conceptId));
}

export interface Aliases {
  concepts: Record<string, string>;
  problems: Record<string, string>;
}

/** Old id -> new id, so learner progress follows a rename. */
export function aliases(): Aliases {
  const path = join(CURRICULUM_DIR, "aliases.json");
  if (!existsSync(path)) return { concepts: {}, problems: {} };
  const raw = readJson<Partial<Aliases>>(path);
  return { concepts: raw.concepts ?? {}, problems: raw.problems ?? {} };
}

/** Structural problems in the curriculum files. An empty list means the curriculum is sound. */
export function validateCurriculum(): string[] {
  const errors: string[] = [];
  const topicIds = new Set(topics().map((t) => t.id));
  const conceptIds = new Set(concepts().map((c) => c.id));
  const seen = new Set<string>();
  for (const t of topics()) {
    for (const p of t.prereqs) if (!topicIds.has(p)) errors.push(`topic ${t.id}: unknown prerequisite ${p}`);
  }
  for (const c of concepts()) {
    if (seen.has(c.id)) errors.push(`concept ${c.id}: duplicate id`);
    seen.add(c.id);
    if (!topicIds.has(c.topic)) errors.push(`concept ${c.id}: unknown topic ${c.topic}`);
    for (const p of c.prereqs) if (!conceptIds.has(p)) errors.push(`concept ${c.id}: unknown prerequisite ${p}`);
    for (const e of c.encompasses ?? []) {
      if (!c.prereqs.includes(e.id)) errors.push(`concept ${c.id}: encompasses ${e.id}, which is not a prerequisite`);
      if (!(e.w >= 0 && e.w <= 1)) errors.push(`concept ${c.id}: encompassing weight ${e.w} is outside 0-1`);
    }
  }
  // Prerequisites must form a DAG.
  const state = new Map<string, "visiting" | "done">();
  const visit = (id: string, path: string[]) => {
    if (state.get(id) === "done" || !conceptIds.has(id)) return;
    if (state.get(id) === "visiting") return void errors.push(`prerequisite cycle: ${[...path, id].join(" -> ")}`);
    state.set(id, "visiting");
    for (const p of concept(id).prereqs) visit(p, [...path, id]);
    state.set(id, "done");
  };
  for (const c of concepts()) visit(c.id, []);
  const slugs = new Set<string>();
  for (const p of problemIndex()) {
    if (slugs.has(p.slug)) errors.push(`problem ${p.slug}: duplicate slug`);
    slugs.add(p.slug);
    if (!topicIds.has(p.topic)) errors.push(`problem ${p.slug}: unknown topic ${p.topic}`);
    for (const c of p.concepts) if (!conceptIds.has(c)) errors.push(`problem ${p.slug}: unknown concept ${c}`);
  }
  return errors;
}

/** A concept plus all of its prerequisites, prerequisites first. */
export function withPrereqs(conceptIds: string[]): string[] {
  const ordered: string[] = [];
  const visit = (id: string) => {
    if (ordered.includes(id)) return;
    for (const p of concept(id).prereqs) visit(p);
    ordered.push(id);
  };
  conceptIds.forEach(visit);
  return ordered;
}

/** The name the harness calls, for function problems. */
export function functionName(p: Problem, language: Language): string | undefined {
  return p.function?.[language];
}

/** Generic names that lessons may define freely, even though a practice problem uses them. */
const GENERIC_NAMES = new Set(["is_valid", "isValid", "find_min", "findMin", "get_sum", "getSum"]);

/**
 * Practice-problem function names a lesson must not define, so generated lessons never
 * solve a practice problem. One-word names (search, merge, rob, ...) are too common to block.
 */
export function reservedNames(language: Language): Set<string> {
  const names = new Set<string>();
  for (const info of problemIndex()) {
    if (!isAuthored(info.slug)) continue;
    const name = problem(info.slug).function?.[language];
    if (name && /[A-Z_]/.test(name) && !GENERIC_NAMES.has(name)) names.add(name);
  }
  return names;
}

export function solutionPath(slug: string, language: Language): string {
  return join(WORKSPACE_DIR, `${slug}.${EXTENSIONS[language]}`);
}

/** Map a workspace file back to its problem and language, e.g. `two-sum.ts`. */
export function parseSolutionPath(path: string): { slug: string; language: Language } {
  const match = path.match(/([\w-]+)\.(py|ts)$/);
  if (!match?.[1] || !match[2]) throw new Error(`Not a solution file: ${path}`);
  return { slug: match[1], language: match[2] === "py" ? "python" : "typescript" };
}

/** Word-wrap one line of prose for comment headers in solution and lesson files. */
export function wrap(line: string, width: number): string[] {
  if (line.length <= width) return [line];
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
}
