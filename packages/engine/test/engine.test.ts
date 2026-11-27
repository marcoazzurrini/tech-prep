import { Database } from "bun:sqlite";
import { afterAll, describe, expect, test } from "bun:test";
import {
  existsSync,
  mkdirSync,
  mkdtempSync,
  readdirSync,
  readFileSync,
  rmSync,
  writeFileSync,
} from "node:fs";
import { tmpdir } from "node:os";
import path from "node:path";

// Point the engine at a throwaway home before any module reads it.
const home = mkdtempSync(path.join(tmpdir(), "tech-prep-test-"));

process.env.TECHPREP_HOME = home;

// Courses beside the app: a small one, a newer copy of it, two written for another course
// format, and one with a broken manifest.
const extra = path.join(home, "courses");

/** A manifest as a test writes it: any field may be wrong or missing. */
interface Draft {
  format: number;
  id: string;
  initials: string;
  name?: string;
  version: number;
}

const writeCourse = (folder: string, manifest: Draft): void => {
  const dir = path.join(extra, folder, "curriculum");
  mkdirSync(dir, { recursive: true });
  writeFileSync(
    path.join(extra, folder, "course.json"),
    JSON.stringify(manifest)
  );
  writeFileSync(
    path.join(dir, "topics.json"),
    JSON.stringify([{ id: "basics", name: "Basics", prereqs: [] }])
  );
  writeFileSync(
    path.join(dir, "concepts.json"),
    JSON.stringify([
      {
        encompasses: [],
        id: "first-idea",
        key_idea: "The first idea.",
        name: `First Idea in ${folder}`,
        prereqs: [],
        solo: "first-task",
        topic: "basics",
      },
    ])
  );
  writeFileSync(
    path.join(dir, "exercises.json"),
    JSON.stringify([
      {
        concepts: ["first-idea"],
        difficulty: "easy",
        slug: "first-task",
        title: "First Task",
        topic: "basics",
      },
    ])
  );
};

const mini = { format: 2, id: "mini", initials: "Mi", name: "Mini" };

writeCourse("mini-old", { ...mini, version: 1 });

writeCourse("mini-new", { ...mini, version: 2 });

writeCourse("too-new", { ...mini, format: 99, id: "too-new", version: 1 });

writeCourse("too-old", { ...mini, format: 1, id: "too-old", version: 1 });

writeCourse("no-name", { format: 2, id: "no-name", initials: "X", version: 1 });

const content = await import("../src/content.ts");
const practice = await import("../src/practice.ts");
const scheduler = await import("../src/scheduler.ts");
const runner = await import("../src/runner.ts");
const program = await import("../src/program.ts");
const { functionCheck } = await import("../src/checks/function.ts");
const { valueCheck, valueChecker } = await import("../src/checks/value.ts");
const extras = await import("../src/extras.ts");
const command = await import("../src/checks/command.ts");
const exercises = await import("../src/exercises.ts");
const lessons = await import("../src/lessons.ts");
const database = await import("../src/db.ts");

type Course = ReturnType<typeof content.courseById>;

/** Most tests practise in the DSA course. */
const dsa = content.courseById("dsa");

/** Where a course keeps its progress. */
const progressFile = (id: string) => path.join(home, "progress", `${id}.db`);

afterAll(() => rmSync(home, { force: true, recursive: true }));

describe("courses", () => {
  const course = dsa;

  test("the app's own courses come first, then the ones beside it", () => {
    expect(content.courses().map((c) => c.id)).toEqual([
      "dsa",
      "javascript",
      "jq",
      "mini",
    ]);
    // With no choice saved yet, the first course is the open one.
    expect(content.savedCourse().id).toBe("dsa");
  });

  test("a renamed course keeps the saved choice and the progress of its old id", () => {
    mkdirSync(path.join(home, "progress"), { recursive: true });

    // An empty database, marked so the test can tell it is the same file.
    const old = new Database(progressFile("interview"), { create: true });
    old.exec("PRAGMA application_id = 42");
    old.close();
    writeFileSync(
      path.join(home, "state.json"),
      JSON.stringify({ course: "interview" })
    );

    expect(content.savedCourse().id).toBe("dsa");
    expect(database.open(dsa).query("PRAGMA application_id").get()).toEqual({
      application_id: 42,
    });
    expect(existsSync(progressFile("interview"))).toBe(false);

    const drafts = path.join(home, "workspace", "interview");
    mkdirSync(drafts, { recursive: true });
    writeFileSync(path.join(drafts, "two-sum.py"), "# draft");

    expect(
      readFileSync(path.join(content.solutionsDir(dsa), "two-sum.py"), "utf-8")
    ).toBe("# draft");
    expect(existsSync(drafts)).toBe(false);
  });

  test("the higher version of a course id is the one used", () => {
    const found = content.courses().find((c) => c.id === "mini");
    expect(found).toMatchObject({ builtin: false, version: 2 });
    expect(found?.dir).toBe(path.join(extra, "mini-new"));
  });

  test("a broken course is reported and skipped", () => {
    const errors = content.courseErrors();
    expect(errors).toHaveLength(3);
    // A course written for another format is skipped, whether newer or older.
    expect(errors.join("\n")).toContain("course format 99");
    expect(errors.join("\n")).toContain("course format 1,");
    expect(errors.join("\n")).toContain("`name`");
  });

  test("each course has its own curriculum and its own progress", () => {
    const small = content.courseById("mini");

    expect(content.validateCurriculum(small)).toEqual([]);
    scheduler.completeLesson(small, "first-idea");

    expect(content.concepts(small).map((c) => c.name)).toEqual([
      "First Idea in mini-new",
    ]);
    expect(scheduler.conceptStatus(small, "first-idea").stage).not.toBe(
      "available"
    );
    expect(content.concepts(course).length).toBeGreaterThan(1);
    expect(() => content.concept(course, "first-idea")).toThrow();
    expect(existsSync(path.join(home, "progress", "mini.db"))).toBe(true);
  });

  test("a course says what it calls its exercises and how to tutor it", () => {
    const jq = content.courseById("jq");

    expect([course.noun, jq.noun]).toEqual(["problems", "tasks"]);
    // A course that does not say gets the plain word.
    expect(content.courseById("mini").noun).toBe("exercises");
    expect(content.tutorGuide(jq)).toContain("new to jq");
    expect(content.tutorGuide(content.courseById("mini"))).toBeNull();
  });

  test("the chosen course is remembered for the app and the tutor", () => {
    expect(content.selectCourse("mini").id).toBe("mini");
    expect(content.savedCourse().id).toBe("mini");
    content.selectCourse("dsa");
    expect(content.savedCourse().id).toBe("dsa");
    expect(() => content.selectCourse("nope")).toThrow("Unknown course");
  });
});

/** Every TypeScript file under a folder, as paths from it. */
const sources = (dir: string): string[] =>
  readdirSync(dir, { recursive: true, withFileTypes: true })
    .filter((entry) => entry.isFile() && entry.name.endsWith(".ts"))
    .map((entry) =>
      path.relative(dir, path.join(entry.parentPath, entry.name))
    );

describe("architecture", () => {
  const src = path.join(import.meta.dir, "..", "src");

  /** Engine code outside the checkers and the harness they run. */
  const shared = sources(src).filter(
    (name) => !name.startsWith("checks/") && !name.startsWith("harness/")
  );

  const matching = (pattern: RegExp): string[] =>
    shared.filter((name) =>
      pattern.test(readFileSync(path.join(src, name), "utf-8"))
    );

  // How an answer is checked belongs to the checkers. Engine code that branched on the
  // type of a check would have to change for every new checker.
  test("only the checkers know how an exercise is checked", () => {
    expect(
      matching(
        /(?:===|!==|case)\s*"(?:function|command|value|arrange|answer|read)"/u
      )
    ).toEqual([]);
  });

  // A course is content. Engine code that named one would have to change for every course.
  test("the engine names no course and no kind of course", () => {
    expect(matching(/"(?:dsa|jq|interview)"|neetcode/iu)).toEqual([]);
  });

  test("the tutor's skill names no course", () => {
    const skill = readFileSync(
      path.join(src, "..", "..", "tutor", "skills", "tutor", "SKILL.md"),
      "utf-8"
    );

    expect(skill.match(/\bjq\b|\bDSA\b|NeetCode/gu)).toBeNull();
  });
});

describe("progress store", () => {
  test("writes made together are saved together or not at all", () => {
    const small = content.courseById("mini");
    const before = scheduler.conceptStatus(small, "first-idea").stage;

    expect(() =>
      database.atomically(small, () => {
        database.addNote(small, "first-idea", "kept only if all is kept", null);

        throw new Error("the second write failed");
      })
    ).toThrow("the second write failed");
    expect(database.notesFor(small, "first-idea")).toEqual([]);
    expect(scheduler.conceptStatus(small, "first-idea").stage).toBe(before);
  });

  test("an old database is copied, then brought up to date once", () => {
    mkdirSync(path.join(home, "progress"), { recursive: true });

    const old = new Database(progressFile("old-one"), { create: true });
    old.exec(
      "CREATE TABLE concept_state (concept_id TEXT PRIMARY KEY, stage TEXT NOT NULL DEFAULT 'unseen', card TEXT, introduced_at TEXT)"
    );
    old.exec(
      "INSERT INTO concept_state (concept_id, stage) VALUES ('dynamic-arrays', 'practicing')"
    );
    old.close();

    const course = { ...dsa, id: "old-one" };

    expect(database.conceptRow(course, "dynamic-arrays")).toMatchObject({
      fail_count: 0,
      stage: "passed",
    });
    expect(database.open(course).query("PRAGMA user_version").get()).toEqual({
      user_version: 2,
    });
    expect(existsSync(`${progressFile("old-one")}.before-v2.bak`)).toBe(true);
    // A new database has nothing to keep, so it gets no copy.
    expect(existsSync(`${progressFile("dsa")}.before-v2.bak`)).toBe(false);
  });

  test("the tutor's exercises from before checks are kept, closed", () => {
    mkdirSync(path.join(home, "progress"), { recursive: true });

    const old = new Database(progressFile("with-extras"), { create: true });
    old.exec(`
      CREATE TABLE exercises (
        id INTEGER PRIMARY KEY AUTOINCREMENT, kind TEXT NOT NULL, concepts TEXT NOT NULL,
        language TEXT NOT NULL, title TEXT NOT NULL, prompt TEXT NOT NULL, body TEXT NOT NULL,
        answer TEXT NOT NULL, created_at TEXT NOT NULL, response TEXT, confidence TEXT,
        submitted_at TEXT, results TEXT, graded_at TEXT, closed_at TEXT,
        max_hint_level INTEGER NOT NULL DEFAULT 0
      );
      CREATE TABLE reviews (
        id INTEGER PRIMARY KEY AUTOINCREMENT, concept_id TEXT NOT NULL,
        attempt_id INTEGER NOT NULL, rating INTEGER NOT NULL, reviewed_at TEXT NOT NULL,
        due TEXT NOT NULL, stability REAL NOT NULL, difficulty REAL NOT NULL,
        implicit_credit REAL, source_concept TEXT, exercise_id INTEGER
      );
      INSERT INTO exercises (kind, concepts, language, title, prompt, body, answer, created_at)
        VALUES ('predict', '["hash-set"]', 'typescript', 'Old', 'What prints?', 'console.log(1)',
          '{"kind":"predict","output":"1"}', '2026-01-01T00:00:00.000Z');
      INSERT INTO reviews (concept_id, attempt_id, rating, reviewed_at, due, stability, difficulty, exercise_id)
        VALUES ('hash-set', 0, 3, '2026-01-01T00:00:00.000Z', '2026-01-02T00:00:00.000Z', 1, 5, 1);
      PRAGMA user_version = 1;
    `);
    old.close();

    const course = { ...content.courseById("mini"), id: "with-extras" };

    // Nothing from before stays on screen, and the row and its review are still there.
    expect(database.openExtra(course)).toBeNull();
    expect(database.extraRow(course, 1)).toMatchObject({
      title: "Old",
    });
    expect(database.extraRow(course, 1).closed_at).not.toBeNull();
    expect(
      database.open(course).query("SELECT extra_id FROM reviews").all()
    ).toEqual([{ extra_id: 1 }]);
    // It cannot be handed in again: its answer is in the old form.
    expect(() => extras.submitExtra(course, 1, "1", null)).toThrow(
      "older version of the app"
    );
  });

  test("a database from a newer app is refused, not changed", () => {
    mkdirSync(path.join(home, "progress"), { recursive: true });

    const newer = new Database(progressFile("newer-one"), { create: true });
    newer.exec("PRAGMA user_version = 99");
    newer.close();

    expect(() => database.open({ ...dsa, id: "newer-one" })).toThrow(
      "newer version of the app"
    );
  });

  test("only the store writes SQL", () => {
    const src = path.join(import.meta.dir, "..", "src");

    const leaks = readdirSync(src)
      .filter((name) => name.endsWith(".ts") && name !== "db.ts")
      .filter((name) =>
        /\.query\(|\.exec\(\s*["`]/u.test(
          readFileSync(path.join(src, name), "utf-8")
        )
      );

    expect(leaks).toEqual([]);
  });
});

describe("curriculum", () => {
  const course = dsa;

  test("the index holds the NeetCode 150 with known topics and concepts", () => {
    const topicIds = new Set(content.topics(course).map((t) => t.id));
    const conceptIds = new Set(content.concepts(course).map((c) => c.id));
    expect(content.problemIndex(course).filter((p) => !p.source)).toHaveLength(
      150
    );
    expect(content.validateCurriculum(course)).toEqual([]);

    for (const p of content.problemIndex(course)) {
      expect(topicIds.has(p.topic)).toBe(true);

      for (const c of p.concepts) {
        expect(conceptIds.has(c)).toBe(true);
      }
    }
  });

  test("every concept has a written lesson, a guided problem and a solo problem", () => {
    const missing = content
      .concepts(course)
      .filter((c) => !exercises.hasLesson(course, c.id))
      .map((c) => c.id);

    expect(missing).toEqual([]);
  });

  test("a guided problem belongs to its lesson and is not a curriculum problem", () => {
    const slug = content.guidedSlug("canonical-key");
    expect(exercises.problemInfo(course, slug)).toMatchObject({
      concepts: ["canonical-key"],
      source: "guided",
      title: "Group Words by Length",
    });
    expect(content.problemIndex(course).some((p) => p.slug === slug)).toBe(
      false
    );
  });

  test("concept prerequisites resolve, prerequisites first", () => {
    const order = content.withPrereqs(course, ["window-counts"]);
    expect(order.at(-1)).toBe("window-counts");
    expect(order.indexOf("hash-set")).toBeLessThan(
      order.indexOf("variable-window")
    );
  });
});

describe("runner", () => {
  const course = dsa;

  test("compare modes", () => {
    expect(runner.equal([1, 0], [0, 1], "unordered")).toBe(true);
    expect(runner.equal([1, 0], [0, 1], "exact")).toBe(false);
    expect(
      runner.equal([["b", "a"], ["c"]], [["c"], ["a", "b"]], "deep-unordered")
    ).toBe(true);
    expect(runner.equal("aba", ["bab", "aba"], "one-of")).toBe(true);
    expect(runner.equal("abc", ["bab", "aba"], "one-of")).toBe(false);
  });

  const dir = mkdtempSync(path.join(tmpdir(), "tech-prep-solutions-"));

  const write = (name: string, source: string) => {
    const file = path.join(dir, name);
    writeFileSync(file, source);

    return file;
  };

  test("python: passing, failing, crashing and syntax errors", () => {
    const twoSum = "two-sum";

    const good = write(
      "good.py",
      "def two_sum(nums, target):\n    seen = {}\n    for i, n in enumerate(nums):\n        if target - n in seen:\n            return [seen[target - n], i]\n        seen[n] = i\n"
    );

    const goodRun = exercises.runTests(course, twoSum, "python", good);
    expect(goodRun.passed).toBe(goodRun.total);
    expect(goodRun.total).toBeGreaterThan(0);

    const bad = write(
      "bad.py",
      "def two_sum(nums, target):\n    print('debug')\n    return [0, 0]\n"
    );

    const badRun = exercises.runTests(course, twoSum, "python", bad);
    expect(badRun.passed).toBeLessThan(badRun.total);
    expect(badRun.cases.find((c) => !c.ok)?.stdout).toContain("debug");
    expect(
      exercises.runTests(
        course,
        twoSum,
        "python",
        write("crash.py", "def two_sum(nums, target):\n    return nums[999]\n")
      ).cases[0]?.error
    ).toContain("IndexError");
    expect(
      exercises.runTests(
        course,
        twoSum,
        "python",
        write("syntax.py", "def two_sum(nums target):\n    pass\n")
      ).fatal
    ).toContain("SyntaxError");
  });

  test("typescript: linked lists, design classes and wrong answers", () => {
    const reverse = "reverse-linked-list";

    const good = write(
      "rev.ts",
      'import { ListNode } from "./ds.ts";\nexport function reverseList(head: ListNode | null): ListNode | null {\n  let prev: ListNode | null = null;\n  while (head) { const next: ListNode | null = head.next; head.next = prev; prev = head; head = next; }\n  return prev;\n}\n'
    );

    const goodRun = exercises.runTests(course, reverse, "typescript", good);
    expect(goodRun.passed).toBe(goodRun.total);

    const identity = write(
      "same.ts",
      'import { ListNode } from "./ds.ts";\nexport function reverseList(head: ListNode | null) { return head; }\n'
    );

    expect(
      exercises.runTests(course, reverse, "typescript", identity).passed
    ).toBeLessThan(goodRun.total);

    const trie = "implement-trie-prefix-tree";

    const naive = write(
      "trie.ts",
      "export class Trie {\n  words: string[] = [];\n  insert(w: string) { this.words.push(w); }\n  search(w: string) { return this.words.includes(w); }\n  startsWith(p: string) { return this.words.some((w) => w.startsWith(p)); }\n}\n"
    );

    const naiveRun = exercises.runTests(course, trie, "typescript", naive);
    expect(naiveRun.passed).toBe(naiveRun.total);
  });
});

describe("javascript", () => {
  const dir = mkdtempSync(path.join(tmpdir(), "tech-prep-javascript-"));

  const write = (name: string, source: string) => {
    const file = path.join(dir, name);
    writeFileSync(file, source);

    return file;
  };

  const firstTest =
    "const add = once((a, b) => a + b); return [add(1, 2), add(5, 5)];";

  /** A check whose tests are code: each one uses what the file exports and returns a value. */
  const once = functionCheck.parse({
    calls: "script",
    stubs: { javascript: "export function once(fn) {}\n" },
    tests: [
      {
        args: [firstTest],
        expected: [3, 3],
      },
      {
        args: ["let n = 0; const f = once(() => ++n); f(); f(); return n;"],
        expected: 1,
      },
      {
        args: [
          "await new Promise((r) => setTimeout(r, 1)); return typeof this;",
        ],
        expected: "undefined",
      },
    ],
    type: "function",
  });

  test("a script test runs code on the file's exports", () => {
    const good = write(
      "once.js",
      "export function once(fn) {\n  let done = false;\n  let value;\n  return (...args) => {\n    if (!done) {\n      done = true;\n      value = fn(...args);\n    }\n    return value;\n  };\n}\n"
    );

    const run = runner.runCode(once, "javascript", good);
    expect(run.passed).toBe(run.total);

    const bad = runner.runCode(
      once,
      "javascript",
      write("bad.js", "export const once = (fn) => (...args) => fn(...args);\n")
    );

    expect(bad.passed).toBe(1);
    // The learner reads the test's code, not a list of arguments.
    expect(bad.cases[0]?.shown).toBe(firstTest);
    expect(runner.formatRun(bad)).toContain("input:    const add = once(");
  });

  test("a rejection nothing handles fails its own test, and the others still run", () => {
    const check = functionCheck.parse({
      calls: "script",
      stubs: { javascript: "export const load = (ok) => {};\n" },
      tests: [
        { args: ["load(false); return 1;"], expected: 1 },
        {
          args: [
            "const log = [1]; setTimeout(() => log.push(2), 0); return log;",
          ],
          expected: [1],
        },
      ],
      type: "function",
    });

    const file = write(
      "load.js",
      'export const load = (ok) => (ok ? Promise.resolve(1) : Promise.reject(new Error("offline")));\n'
    );

    const run = runner.runCode(check, "javascript", file);

    expect(run.cases[0]?.error).toContain("nothing handled it");
    expect(run.cases[0]?.error).toContain("offline");
    // What a test returns is kept as it was when the test ended.
    expect(run.cases[1]?.ok).toBe(true);
  });

  test("an error ends on what went wrong, and a syntax error names its line", () => {
    const thrown = runner.runCode(
      once,
      "javascript",
      write("null.js", "export const once = (fn) => fn.missing.value;\n")
    );

    expect(thrown.cases[0]?.error?.trim().split("\n").at(-1)).toStartWith(
      "TypeError: "
    );
    expect(
      runner.runCode(
        once,
        "javascript",
        write("syntax.js", "export function once(fn) {\n  return fn +;\n}\n")
      ).fatal
    ).toBe("SyntaxError: Unexpected ; (line 2)");
  });

  test("a script test works in python too", () => {
    const check = functionCheck.parse({
      calls: "script",
      stubs: { python: "def double(n):\n    pass\n" },
      tests: [
        { args: ["total = double(2) + double(3)\nreturn total"], expected: 10 },
      ],
      type: "function",
    });

    const run = runner.runCode(
      check,
      "python",
      write("double.py", "def double(n):\n    return n * 2\n")
    );

    expect(run.passed).toBe(1);
  });

  test("a script test reaches the default export through `exports`", () => {
    const check = functionCheck.parse({
      calls: "script",
      stubs: { javascript: "export default function greet() {}\n" },
      tests: [
        { args: ["return [exports.default(), answer];"], expected: ["hi", 42] },
      ],
      type: "function",
    });

    const run = runner.runCode(
      check,
      "javascript",
      write(
        "default.js",
        "export default function greet() {\n  return 'hi';\n}\nexport const answer = 42;\n"
      )
    );

    expect(run.passed).toBe(1);
  });

  test("a value exercise shows the files its code imports, and runs with them", () => {
    const check = valueCheck.parse({
      compare: "loose",
      source: {
        code: 'import { count, add } from "./counter.js";\nadd();\nconsole.log(count);',
        files: {
          "counter.js":
            "export let count = 0;\nexport function add() {\n  count += 1;\n}\n",
        },
        language: "javascript",
        main_file: "main.js",
        run: "code",
      },
      type: "value",
    });

    const built = valueChecker.build(check, { concepts: [], dir: null });

    expect(built.errors).toEqual([]);
    expect(built.check.expected).toBe("1");
    expect(valueChecker.view(check)).toMatchObject({
      shown: [{ label: "main.js" }, { label: "counter.js" }],
    });
  });

  test("a javascript program runs as a module, in strict mode", () => {
    const run = program.execute(
      "try {\n  leak = 1;\n} catch (error) {\n  console.log(error.name);\n}\nconsole.log(await Promise.resolve(2));",
      "javascript"
    );

    expect(run.stdout).toBe("ReferenceError\n2");
  });
});

const grading = await import("../src/grading.ts");
const fire = await import("../src/fire.ts");
const memory = await import("../src/memory.ts");

describe("grading", () => {
  const targets = ["sorting", "two-pointers-opposite"];

  const results = (overrides: Partial<Parameters<typeof grading.grade>[0]>) =>
    grading
      .grade({ correct: true, maxHintLevel: 0, targets, ...overrides })
      .map((r) => r.result);

  test("every target shares the result of the exercise", () => {
    expect(results({})).toEqual(["pass", "pass"]);
    expect(results({ correct: false })).toEqual(["fail", "fail"]);
  });

  test("a guiding question still counts as alone; a stronger hint fails", () => {
    expect(results({ maxHintLevel: 1 })).toEqual(["pass", "pass"]);
    expect(results({ maxHintLevel: 2 })).toEqual(["fail", "fail"]);
  });

  test("an open answer is graded per concept", () => {
    const verdicts = new Map([
      ["sorting", { result: "pass" as const }],
      ["two-pointers-opposite", { result: "fail" as const }],
    ]);

    expect(results({ correct: false, verdicts })).toEqual(["pass", "fail"]);
  });
});

describe("fractional implicit repetition", () => {
  const course = dsa;

  test("each course has its own encompassings", () => {
    // Read one course's edges first: the other course must not get them.
    expect(fire.creditBelow(course, "window-counts").size).toBeGreaterThan(0);

    const jqCourse = content.courseById("jq");
    expect(
      fire.creditBelow(jqCourse, "object-fields").get("reading-json")
    ).toBeCloseTo(0.3);
    expect(fire.creditBelow(jqCourse, "window-counts").size).toBe(0);
  });

  test("credit flows down encompassings as path products, penalties up", () => {
    const below = fire.creditBelow(course, "window-counts");
    expect(below.get("variable-window")).toBe(1);
    expect(below.get("hash-map-counting")).toBeCloseTo(0.7);
    expect(below.get("hash-set")).toBeCloseTo(0.5);
    expect(
      fire.encompassedBy(course, "hash-set").get("variable-window")
    ).toBeCloseTo(0.5);
    expect(
      fire.problemCredit(course, ["window-counts"], "variable-window")
    ).toBe(1);
  });
});

/** The problem a code lesson ends on. */
const soloOf = (course: Course, conceptId: string): string => {
  const [solo] = content.soloSlugs(course, conceptId);

  if (!solo) {
    throw new Error(`'${conceptId}' has no solo problem.`);
  }

  return solo;
};

/** Open a problem and write its reference solution as the learner's code. */
const solve = (
  course: Course,
  slug: string,
  mode: "guided" | "solo" | "review"
) => {
  const started = practice.startProblem(course, slug, mode, "python");
  const reference = exercises.referenceSolution(course, slug, "python");

  if (!reference) {
    throw new Error(`'${slug}' has no Python reference.`);
  }

  writeFileSync(started.file, reference);

  return started;
};

/** Do both steps of a lesson without help. */
const learn = (course: Course, conceptId: string) => {
  solve(course, content.guidedSlug(conceptId), "guided");
  practice.submitProblem(
    course,
    practice.attemptOn(course, content.guidedSlug(conceptId))
  );
  solve(course, soloOf(course, conceptId), "solo");

  return practice.submitProblem(
    course,
    practice.attemptOn(course, soloOf(course, conceptId))
  );
};

describe("lessons", () => {
  const course = dsa;

  const DAY = 86_400_000;

  test("the course starts with the first concept, and later ones are locked", () => {
    expect(scheduler.nextLesson(course)).toBe("dynamic-arrays");
    expect(scheduler.lessonStatus(course, "dynamic-arrays")).toBe("todo");
    expect(scheduler.lessonStatus(course, "hash-set")).toBe("locked");
    expect(scheduler.lessonStep(course, "dynamic-arrays")).toBe(1);
  });

  test("solving the guided problem teaches the concept without passing it", () => {
    const guided = content.guidedSlug("dynamic-arrays");
    solve(course, guided, "guided");

    const handed = practice.submitProblem(
      course,
      practice.attemptOn(course, guided)
    );

    expect(handed.finished).toBe(true);
    expect(handed.result?.outcome).toBe("solved");
    expect(scheduler.lessonStep(course, "dynamic-arrays")).toBe(2);
    expect(scheduler.displayStage(course, "dynamic-arrays")).toBe("learning");
    expect(memory.cardOf(course, "dynamic-arrays")).toBeNull();
  });

  test("a submit with failing tests keeps the attempt open", () => {
    const solo = soloOf(course, "dynamic-arrays");
    const started = practice.startProblem(course, solo, "solo", "python");

    const handed = practice.submitProblem(
      course,
      practice.attemptOn(course, solo)
    );

    expect(handed.finished).toBe(false);
    expect(practice.currentAttempt(course)?.id).toBe(started.attempt_id);
    expect(scheduler.displayStage(course, "dynamic-arrays")).toBe("learning");
  });

  test("an unaided solo solve passes the concept, starts its reviews and opens the next lesson", () => {
    const solo = soloOf(course, "dynamic-arrays");
    solve(course, solo, "solo");

    const handed = practice.submitProblem(
      course,
      practice.attemptOn(course, solo)
    );

    expect(handed.result?.outcome).toBe("solved");
    expect(scheduler.lessonStatus(course, "dynamic-arrays")).toBe("done");
    expect(memory.cardOf(course, "dynamic-arrays")).not.toBeNull();
    expect(scheduler.problemStatus(course, solo)).toBe("solved");
    expect(scheduler.lessonStatus(course, "hash-set")).toBe("todo");
    expect(scheduler.nextLesson(course)).toBe("hash-set");
  });

  test("help on the solo problem keeps the concept in learning, and the problem waits a day", () => {
    expect(learn(course, "hash-set").result?.outcome).toBe("solved");

    const guided = content.guidedSlug("hash-map-counting");
    solve(course, guided, "guided");
    practice.submitProblem(course, practice.attemptOn(course, guided));
    solve(course, "valid-anagram", "solo");
    practice.logHint(course, 2);

    const handed = practice.submitProblem(
      course,
      practice.attemptOn(course, "valid-anagram")
    );

    expect(handed.result?.outcome).toBe("solved_with_help");
    expect(scheduler.lessonStatus(course, "hash-map-counting")).toBe("partial");
    expect(memory.cardOf(course, "hash-map-counting")).toBeNull();
    expect(scheduler.soloWait(course, "hash-map-counting")).not.toBeNull();
    // The course moves on to the next open lesson while this one waits.
    expect(scheduler.nextLesson(course)).toBe("hash-map-index");
    expect(scheduler.nextLesson(course, new Date(Date.now() + 1.1 * DAY))).toBe(
      "hash-map-counting"
    );
  });

  test("giving up closes the attempt and returns a solution", () => {
    const guided = content.guidedSlug("hash-map-index");
    practice.startProblem(course, guided, "guided", "python");

    const { result, solution } = practice.giveUp(
      course,
      practice.attemptOn(course, guided)
    );

    expect(result.outcome).toBe("gave_up");
    expect(solution).toBe(
      exercises.referenceSolution(course, guided, "python")
    );
    expect(scheduler.lessonStep(course, "hash-map-index")).toBe(1);
    expect(practice.currentAttempt(course)).toBeNull();
  });

  test("opening another problem sets the open one aside with no grade", () => {
    const guided = content.guidedSlug("hash-map-index");
    practice.startProblem(course, guided, "guided", "python");
    practice.startProblem(course, "two-sum", "solo", "python");

    expect(practice.currentAttempt(course)?.slug).toBe("two-sum");
    practice.pauseAttempt(course, practice.attemptOn(course, "two-sum"));
    expect(practice.currentAttempt(course)).toBeNull();
    expect(scheduler.problemStatus(course, "two-sum")).toBe("unattempted");
  });
});

describe("reviews", () => {
  const course = dsa;

  const DAY = 86_400_000;

  test("nothing is due straight after learning", () => {
    expect(scheduler.dueCount(course)).toBe(0);
    expect(scheduler.nextReview(course)).toBeNull();
    expect(scheduler.nextDue(course)).not.toBeNull();
  });

  test("due concepts are reviewed with a problem whose concepts are all passed", () => {
    const later = new Date(Date.now() + 60 * DAY);
    const plan = scheduler.reviewPlan(course, later);

    expect(scheduler.dueCount(course, later)).toBe(2);
    expect(plan.flatMap((r) => r.covers).toSorted()).toEqual([
      "dynamic-arrays",
      "hash-set",
    ]);

    for (const review of plan) {
      expect(
        review.problem.concepts.every((id) => scheduler.isPassed(course, id))
      ).toBe(true);
    }
  });

  test("a review starts from the empty stub, even on a solved problem", () => {
    const solo = soloOf(course, "dynamic-arrays");
    const started = practice.startProblem(course, solo, "review", "python");

    expect(readFileSync(started.file, "utf-8").trim()).toBe(
      exercises.checkingOf(course, solo).start("python").trim()
    );
    expect(started.phase).toBe("review");
    practice.pauseAttempt(course, practice.attemptOn(course, solo));
  });

  test("practising an encompassing concept gives partial credit to the passed concept below", () => {
    const before = memory.cardOf(course, "hash-set");

    if (!before) {
      throw new Error("hash-set should have a card once passed.");
    }

    const later = new Date(Date.now() + 5 * DAY);

    const result = fire.propagate(
      course,
      {},
      new Map([["sequence-starts", 3 as const]]),
      later
    );

    const credited = result.credited.find((c) => c.concept === "hash-set");
    expect(credited?.credit).toBe(1);
    expect(memory.cardOf(course, "hash-set")?.due.getTime()).toBeGreaterThan(
      before.due.getTime()
    );
  });
});

const db = () => import("../src/db.ts");

describe("solution files", () => {
  test("the old statement banner is removed and the code is kept", () => {
    const rule = `// ${"═".repeat(40)}`;
    const code = "export function f(): number {\n  return 1;\n}\n";

    const old = [
      rule,
      "// PROBLEM · Example (easy)",
      rule,
      "// Return one.",
      "",
      rule,
      "// YOUR SOLUTION · write it below",
      rule,
      "",
      code,
    ].join("\n");

    expect(practice.withoutBanner(old)).toBe(code);
    expect(practice.withoutBanner(code)).toBe(code);
  });
});

/** Put an extra exercise on screen, as the tutor's `show_exercise` tool does. */
const showExercise = (
  course: Course,
  {
    conceptIds,
    prompt,
    title,
    ...draft
  }: Parameters<typeof extras.checkOfDraft>[0] & {
    conceptIds: string[];
    prompt: string;
    title: string;
  }
) =>
  extras.showExtra(course, {
    check: extras.checkOfDraft(draft),
    conceptIds,
    prompt,
    title,
  });

describe("extra exercises", () => {
  const course = dsa;

  test("predict: the engine runs the code to find the answer and hides it until graded", async () => {
    const shown = showExercise(course, {
      code: "const s = new Set([1, 1, 2]);\nconsole.log(s.size);",
      conceptIds: ["sequence-starts"],
      kind: "predict",
      prompt: "What does this print?",
      title: "Predict the output",
    });

    expect(shown.verified_output).toBe("2");

    const { extraRow } = await db();

    const before = extras.extraView(
      course,
      extraRow(course, shown.exercise_id)
    );

    expect(before.correct_answer).toBeNull();

    const result = extras.submitExtra(course, shown.exercise_id, " 2 ", "high");

    expect(result).toMatchObject({ correct: true, status: "graded" });
    expect(() =>
      extras.submitExtra(course, shown.exercise_id, "3", null)
    ).toThrow(/already submitted/u);

    const after = extras.extraView(course, extraRow(course, shown.exercise_id));

    expect(after.correct_answer).toBe("2");
    expect(after.concepts[0]?.result).toBe("pass");
  });

  test("a right answer on an untaught concept skips its lesson and its prerequisites' lessons", () => {
    // The predict above targeted sequence-starts, which needs hash-set (passed earlier).
    expect(scheduler.displayStage(course, "sequence-starts")).toBe("learning");
  });

  test("code that fails or prints nothing is rejected", () => {
    const base = {
      conceptIds: ["hash-set"],
      kind: "predict" as const,
      prompt: "x",
      title: "x",
    };

    expect(() =>
      showExercise(course, { ...base, code: "const a: number = ;" })
    ).toThrow(/does not run/u);
    expect(() =>
      showExercise(course, { ...base, code: "const a = 1;" })
    ).toThrow(/prints nothing/u);
    expect(() =>
      showExercise(course, {
        ...base,
        code: "console.log(1)",
        conceptIds: [],
      })
    ).toThrow(/1 to 3/u);
  });

  test("arrange: shuffled lines, and another order that prints the same also passes", async () => {
    const lines = [
      "const seen = new Set<number>();",
      "seen.add(2);",
      "seen.add(1);",
      "console.log(seen.size);",
    ];

    const make = () =>
      showExercise(course, {
        conceptIds: ["hash-set"],
        distractors: ["seen.clear();"],
        kind: "arrange",
        lines,
        prompt: "Order the lines.",
        title: "Arrange the lines",
      });

    const { extraRow } = await db();
    const first = make();

    const view = extras.extraView(course, extraRow(course, first.exercise_id));

    expect(view.check).toMatchObject({ type: "arrange" });
    expect("lines" in view.check ? view.check.lines.toSorted() : []).toEqual(
      [...lines, "seen.clear();"].toSorted()
    );

    const [a = "", b = "", c = "", d = ""] = lines;
    // Passing reviews hash-set; it was passed earlier, so this is the review phase.
    expect(
      extras.submitExtra(course, first.exercise_id, [a, c, b, d], "medium")
    ).toMatchObject({ correct: true });

    const second = make();
    expect(
      extras.submitExtra(
        course,
        second.exercise_id,
        [a, b, "seen.clear();", d],
        "high"
      )
    ).toMatchObject({ confident_miss: true, correct: false });
  });

  test("a concept is reviewed once a day: a same-day retry is practice only", async () => {
    const { extraRow } = await db();
    const { openExtra } = await db();
    const last = openExtra(course);

    if (!last) {
      throw new Error("An exercise should be on screen.");
    }

    const view = extras.extraView(course, extraRow(course, last.id));
    expect(view.status).toBe("graded");
    // SAFETY: results are written by the engine as a list of applied results.
    const applied = JSON.parse(last.results ?? "[]") as { effect: string }[];
    expect(applied[0]?.effect).toContain("practice only");
  });

  test("open answer: the tutor grades each concept, and a hint beyond a question fails", () => {
    const shown = showExercise(course, {
      conceptIds: ["hash-set", "hash-map-counting"],
      kind: "answer",
      modelAnswer: "A set gives O(1) membership checks.",
      prompt: "Why use a set here?",
      rubric: [
        { concept_id: "hash-set", points: ["O(1) membership"] },
        { concept_id: "hash-map-counting", points: ["counts per value"] },
      ],
      title: "Explain",
    });

    expect(() =>
      extras.gradeAnswer(course, shown.exercise_id, [
        { concept_id: "hash-set", result: "pass" },
      ])
    ).toThrow(/not submitted/u);

    expect(
      extras.submitExtra(
        course,
        shown.exercise_id,
        "Because lookups are O(1).",
        null
      )
    ).toMatchObject({ status: "submitted" });
    expect(() =>
      extras.gradeAnswer(course, shown.exercise_id, [
        { concept_id: "hash-set", result: "pass" },
      ])
    ).toThrow(/one verdict for each/u);

    const graded = extras.gradeAnswer(course, shown.exercise_id, [
      { concept_id: "hash-set", result: "pass" },
      {
        concept_id: "hash-map-counting",
        reason: "not mentioned",
        result: "fail",
      },
    ]);

    expect(graded.concepts.map((c) => c.result)).toEqual(["pass", "fail"]);
  });
});

/** Open a jq task and write its reference as the learner's answer. */
const answer = (
  course: Course,
  slug: string,
  mode: "guided" | "solo" | "review"
) => {
  const started = practice.startProblem(course, slug, mode, "jq");
  writeFileSync(
    started.file,
    exercises.referenceSolution(course, slug, "jq") ?? ""
  );

  return practice.submitProblem(course, practice.attemptOn(course, slug));
};

/** Run a typed command on a small input, as the command check does. */
const run = (text: string) =>
  command.runCommand({ file: "data.json", program: "jq" }, text, {
    input: { id: 7 },
  });

describe("javascript course", () => {
  const course = content.courseById("javascript");

  test("the curriculum is sound, and every lesson that is started is complete", () => {
    expect(content.validateCurriculum(course)).toEqual([]);

    const written = content
      .concepts(course)
      .filter((c) => content.lessonText(course, c.id) !== null);

    expect(written.map((c) => c.id).slice(0, 3)).toEqual([
      "primitive-types",
      "numbers",
      "special-numbers",
    ]);
    expect(
      written.filter((c) => !exercises.hasLesson(course, c.id)).map((c) => c.id)
    ).toEqual([]);

    for (const c of written) {
      const parts = lessons.lessonParts(course, c.id);

      expect(parts.map((p) => p.task)).toEqual(
        content.guidedSlugs(course, c.id)
      );
      expect(parts.filter((p) => p.text.includes("<!--"))).toEqual([]);
      expect(parts.at(-1)?.text).toContain("## Remember");
    }
  });

  test("code is written in JavaScript, and output is typed as text", () => {
    const languages = new Set(
      content
        .problemIndex(course)
        .filter((p) => exercises.isAuthored(course, p.slug))
        .map((p) => exercises.problemLanguage(course, p.slug))
    );

    expect([...languages].toSorted()).toEqual(["javascript", "text"]);
  });
});

describe("jq course", () => {
  const course = content.courseById("jq");
  const answers = mkdtempSync(path.join(tmpdir(), "tech-prep-jq-answers-"));

  /** Check a typed answer on every test of a task, as Submit does. */
  const check = (slug: string, text: string) => {
    const file = path.join(answers, "answer.jq");
    writeFileSync(file, text);

    return exercises.runTests(course, slug, "jq", file);
  };

  const preview = (slug: string, text: string) =>
    exercises.previewAnswer(course, slug, text);

  test("a command line splits the way a shell splits it", () => {
    expect(command.splitArgs("-r '.[] | .name'")).toEqual([
      "-r",
      ".[] | .name",
    ]);
    expect(command.splitArgs(`--arg who "Ada Lee" '.x == $who'`)).toEqual([
      "--arg",
      "who",
      "Ada Lee",
      ".x == $who",
    ]);
    expect(command.splitArgs("-n ''")).toEqual(["-n", ""]);
    expect(() => command.splitArgs("-r '.name")).toThrow("not closed");
  });

  test("JSON for reading keeps short values on one line", () => {
    expect(command.showJson({ items: [{ name: "pen" }], shop: "North" })).toBe(
      '{"items": [{"name": "pen"}], "shop": "North"}'
    );
    expect(
      command.showJson([
        { active: true, name: "Ada", team: "qa" },
        { active: false, name: "Bo", team: "ops" },
      ])
    ).toBe(
      '[\n  {"active": true, "name": "Ada", "team": "qa"},\n  {"active": false, "name": "Bo", "team": "ops"}\n]'
    );
  });

  test("the curriculum is sound, and every lesson that is started is complete", () => {
    expect(content.validateCurriculum(course)).toEqual([]);

    const written = content
      .concepts(course)
      .filter((c) => content.lessonText(course, c.id) !== null);

    expect(written).toHaveLength(content.concepts(course).length);
    expect(written.map((c) => c.id).slice(0, 6)).toEqual([
      "what-jq-does",
      "reading-json",
      "object-fields",
      "nested-paths",
      "array-items",
      "pipes",
    ]);
    expect(
      written.filter((c) => !exercises.hasLesson(course, c.id)).map((c) => c.id)
    ).toEqual([]);

    for (const c of written) {
      const parts = lessons.lessonParts(course, c.id);
      const guided = content.guidedSlugs(course, c.id);

      // One part for each guided task, named by its heading. The summary closes the last.
      expect(parts.map((p) => p.task)).toEqual(guided);
      expect(parts.filter((p) => /^Part \d+$/u.test(p.name))).toEqual([]);
      expect(parts.filter((p) => p.text.includes("<!--"))).toEqual([]);
      // The first part is headed by its own heading, or by the lesson's name.
      expect([c.name, parts[0]?.name]).toContain(parts[0]?.title);
      expect(parts.at(-1)?.text).toContain("## Remember");
    }
  });

  test("an exercise has a folder of its own, laid out the same in every course", () => {
    for (const each of [dsa, course]) {
      const lesson = path.join(each.dir, "lessons", "some-lesson");

      expect(content.exerciseDir(each, "guided-some-lesson")).toBe(
        path.join(lesson, "exercises", "1")
      );
      expect(content.exerciseDir(each, "guided-some-lesson.2")).toBe(
        path.join(lesson, "exercises", "2")
      );
      expect(content.exerciseDir(each, "some-exercise")).toBe(
        path.join(each.dir, "exercises", "some-exercise")
      );
    }
  });

  test("a course mixes checks, and each exercise names its own", () => {
    const types = new Set(
      content
        .problemIndex(course)
        .filter((p) => exercises.isAuthored(course, p.slug))
        .map((p) => exercises.checkingOf(course, p.slug).check.type)
    );

    expect([...types].toSorted()).toEqual(["command", "value"]);
    expect(exercises.checkingOf(dsa, "two-sum").check.type).toBe("function");
    // What an answer is written in comes from the exercise, not from the course.
    expect(exercises.problemLanguage(course, "pipes-solo-1")).toBe("jq");
    expect(["python", "typescript"]).toContain(
      exercises.problemLanguage(dsa, "two-sum")
    );
  });

  test("a lesson that is not split has one part, whatever the course", () => {
    const [part, ...rest] = lessons.lessonParts(dsa, "dynamic-arrays");

    expect(rest).toEqual([]);
    expect(part).toMatchObject({
      name: "Dynamic Arrays",
      task: "guided-dynamic-arrays",
      title: "Dynamic Arrays",
    });
  });

  test("every reference solves its task, and the starting text does not", () => {
    const slugs = [
      ...content.problemIndex(course).map((p) => p.slug),
      ...content
        .concepts(course)
        .flatMap((c) => content.guidedSlugs(course, c.id)),
    ].filter((slug) => exercises.isAuthored(course, slug));

    expect(slugs.length).toBeGreaterThan(40);

    const wrong = slugs.filter((slug) => {
      const solved = check(
        slug,
        exercises.referenceSolution(course, slug, "jq") ?? ""
      );

      const untouched = check(
        slug,
        exercises.checkingOf(course, slug).start("jq")
      );

      return (
        solved.passed !== solved.total || untouched.passed === untouched.total
      );
    });

    expect(wrong).toEqual([]);
  }, 60_000);

  test("a command is compared as JSON values or as text, as its check says", () => {
    const want = '{\n  "id": 7,\n  "name": "Ada"\n}';

    const passes = (compare: "json" | "text", text: string): boolean =>
      command.commandChecker.run(
        {
          compare,
          file: "data.json",
          program: "jq",
          reference: "",
          tests: [{ expected: want, input: {} }],
          type: "command",
        },
        { file: "", language: "jq", text }
      ).passed === 1;

    // The same values with another key order still match.
    expect(passes("json", `jq -n '{name: "Ada", id: 7}'`)).toBe(true);
    expect(passes("json", "jq -n '{}'")).toBe(false);
    expect(passes("text", `jq -n '{name: "Ada", id: 7}'`)).toBe(false);
    expect(passes("text", `jq -n '{id: 7, name: "Ada"}'`)).toBe(true);
  });

  test("the learner types the whole command, and the program reads the named file", () => {
    expect(run("jq -c '.' data.json").output).toBe('{"id":7}');
    expect(run("jq '.id' data.json")).toEqual({ error: null, output: "7" });
    // Double quotes around the filter work as in a shell.
    expect(run('jq ".id" data.json').output).toBe("7");
    expect(run("jq -n '1 + 1'").output).toBe("2");
    expect(run("'.id' data.json").error).toContain("Start the command with");
    expect(run("jq '.id'").error).toContain("Add `data.json`");
    expect(run("jq data.json").error).toContain("The filter is missing");
    expect(run("jq '.id' other.json").error).toContain("Add `data.json`");
    expect(run("jq '.id data.json").error).toContain("not closed");
  });

  test("a course cannot make the engine run a program it does not know", () => {
    const refused = command.runCommand(
      { file: "data.json", program: "rm" },
      "rm data.json",
      { input: {} }
    );

    expect(refused.error).toContain("The app cannot run 'rm'");
  });

  test("jq's own error text reaches the learner", () => {
    const slug = content.guidedSlug("nested-paths", 3);
    const start = exercises.checkingOf(course, slug).start("jq");
    const seen = preview(slug, start);

    expect(seen?.matches).toBe(false);
    expect(seen?.error).toBe(
      'jq: error: Cannot index string with string "name"'
    );
    // A filter task starts from a whole command to fix, or from an empty line.
    expect(start).toBe("jq '.server.host.name' data.json");
    expect(exercises.checkingOf(course, "pipes-solo-1").start("jq")).toBe("");
    expect(exercises.referenceSolution(course, "pipes-solo-1", "jq")).toBe(
      "jq '.results | length' data.json"
    );
    // Nothing typed yet is not an error.
    expect(preview(slug, "  ")).toEqual({
      error: null,
      matches: false,
      output: "",
    });
  });

  test("a predict task takes the value the learner types, and shows no output", () => {
    const task = "reading-json-solo-2";

    // It shows the input and, here, no command: the question is about the input alone.
    expect(exercises.checkView(course, task)).toMatchObject({
      shown: [{ file: "data.json", label: "Input" }],
      type: "value",
    });
    expect(check(task, "[ 5432,\n 6432 ]").passed).toBe(1);
    expect(check(task, "[5432]").passed).toBe(0);
    expect(check(task, "[5432, 6432").cases[0]?.error).toContain(
      "not valid JSON"
    );
    expect(preview(task, "[5432, 6432]")).toBeNull();
    // The answer key is the output, not the filter that made it.
    expect(
      exercises.referenceSolution(course, "reading-json-solo-2", "jq")
    ).toBe("[\n  5432,\n  6432\n]");
    expect(
      exercises.checkView(course, content.guidedSlug("what-jq-does", 3))
    ).toMatchObject({
      shown: [
        { label: "Input" },
        { label: "Command", text: "jq '.pages' data.json" },
      ],
    });
  });

  test("a lesson is taught after its three guided tasks and learned after both solo tasks", () => {
    const [first, second, third] = content.guidedSlugs(course, "what-jq-does");
    const [soloOne, soloTwo] = content.soloSlugs(course, "what-jq-does");

    if (!first || !second || !third || !soloOne || !soloTwo) {
      throw new Error("The first lesson is missing exercises.");
    }

    expect(content.guidedConcept(third)).toBe("what-jq-does");
    expect(answer(course, first, "guided").result?.outcome).toBe("solved");
    answer(course, second, "guided");
    expect(scheduler.lessonStep(course, "what-jq-does")).toBe(1);
    answer(course, third, "guided");
    expect(scheduler.lessonStep(course, "what-jq-does")).toBe(2);

    const one = answer(course, soloOne, "solo");
    expect(one.result?.outcome).toBe("solved");
    expect(one.result?.concepts).toEqual([]);
    expect(scheduler.isPassed(course, "what-jq-does")).toBe(false);

    const two = answer(course, soloTwo, "solo");
    expect(two.result?.outcome).toBe("solved");
    expect(scheduler.isPassed(course, "what-jq-does")).toBe(true);
    expect(scheduler.nextLesson(course)).toBe("reading-json");
  });

  test("a solo task solved with help holds the lesson back for a day", () => {
    for (const slug of content.guidedSlugs(course, "reading-json")) {
      answer(course, slug, "guided");
    }

    const [soloOne] = content.soloSlugs(course, "reading-json");

    if (!soloOne) {
      throw new Error("The second lesson has no solo task.");
    }

    practice.startProblem(course, soloOne, "solo", "jq");
    practice.logHint(course, 2);
    writeFileSync(
      content.solutionPath(course, soloOne, "jq"),
      exercises.referenceSolution(course, soloOne, "jq") ?? ""
    );

    expect(
      practice.submitProblem(course, practice.attemptOn(course, soloOne)).result
        ?.outcome
    ).toBe("solved_with_help");
    expect(scheduler.isPassed(course, "reading-json")).toBe(false);
    expect(scheduler.lessonStatus(course, "reading-json")).toBe("partial");
    expect(scheduler.soloWait(course, "reading-json")).not.toBeNull();

    // An attempt left open on a task the course no longer has is set aside.
    database
      .open(course)
      .query(
        "INSERT INTO attempts (slug, concept_id, language, started_at) VALUES ('guided-gone', 'gone', 'jq', ?)"
      )
      .run(new Date().toISOString());
    expect(practice.currentAttempt(course)?.slug).toBe("guided-gone");
    practice.pauseUnknownAttempts(course);
    expect(practice.currentAttempt(course)).toBeNull();
  });

  test("the engine decides what starts and what moves on", () => {
    // Nothing starts on a locked lesson, or on one that waits after a struggle.
    lessons.startLesson(course, "pipes", false);
    expect(practice.currentAttempt(course)).toBeNull();
    lessons.startLesson(course, "reading-json", false);
    expect(practice.currentAttempt(course)).toBeNull();

    // A learned lesson starts again only when the learner asks to practise it.
    lessons.startLesson(course, "what-jq-does", false);
    expect(practice.currentAttempt(course)).toBeNull();
    lessons.startLesson(course, "what-jq-does", true);

    const solo = practice.currentAttempt(course);

    if (!solo) {
      throw new Error("Practising a learned lesson starts its solo task.");
    }

    expect(solo.mode).toBe("solo");

    const guided = { ...solo, mode: "guided" as const };
    const review = { ...solo, mode: "review" as const };
    const lesson = "what-jq-does";

    // A right guided answer moves on, with or without help. A given-up one shows a solution.
    expect(lessons.movesOn(course, guided, lesson, "solved")).toBe(true);
    expect(lessons.movesOn(course, guided, lesson, "solved_with_help")).toBe(
      true
    );
    expect(lessons.movesOn(course, guided, lesson, "gave_up")).toBe(false);
    // A review moves on when it is solved alone.
    expect(lessons.movesOn(course, review, null, "solved")).toBe(true);
    expect(lessons.movesOn(course, review, null, "solved_with_help")).toBe(
      false
    );
    // Both solo tasks of this lesson are solved, so the last one stays with its verdict.
    expect(lessons.movesOn(course, solo, lesson, "solved")).toBe(false);
    practice.pauseAttempt(course, solo);
  });
});

/** Send request lines to a bridge process of its own, and read its replies. */
const ask = (requests: object[]) => {
  const proc = Bun.spawnSync(
    [process.execPath, path.join(import.meta.dir, "..", "src", "bridge.ts")],
    {
      env: { ...process.env, TECHPREP_HOME: home },
      stdin: Buffer.from(
        `${requests.map((r) => JSON.stringify(r)).join("\n")}\n`
      ),
    }
  );

  return proc.stdout
    .toString()
    .trim()
    .split("\n")
    .map((line): { id?: number; error?: string; result?: object } =>
      JSON.parse(line)
    );
};

describe("bridge", () => {
  test("it answers the contract's methods, with or without parameters", () => {
    const [course, reviews, problem] = ask([
      { id: 1, method: "course" },
      { id: 2, method: "reviews", params: null },
      { id: 3, method: "problem", params: { slug: "two-sum" } },
    ]);

    expect(course).toMatchObject({ id: 1, result: { subject: {} } });
    expect(reviews).toMatchObject({
      id: 2,
      result: { tracks: [{}, {}, {}, {}] },
    });
    expect(problem).toMatchObject({
      id: 3,
      result: { check: { type: "function" }, slug: "two-sum" },
    });
  });

  test("a request that does not fit is refused with the reason", () => {
    const [unknown, missing, wrong] = ask([
      { id: 1, method: "nope" },
      { id: 2, method: "problem", params: {} },
      { id: 3, method: "lesson.open", params: { concept: 7 } },
    ]);

    expect(unknown).toEqual({ error: "Unknown method 'nope'.", id: 1 });
    expect(missing?.error).toContain("'problem' was sent wrong parameters");
    expect(missing?.error).toContain("`slug`");
    expect(wrong?.error).toContain("`concept`");
  });
});
