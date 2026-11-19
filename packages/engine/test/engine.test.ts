import { afterAll, describe, expect, test } from "bun:test";
import {
  existsSync,
  mkdirSync,
  mkdtempSync,
  readFileSync,
  rmSync,
  writeFileSync,
} from "node:fs";
import { tmpdir } from "node:os";
import path from "node:path";

// Point the engine at a throwaway home before any module reads it.
const home = mkdtempSync(path.join(tmpdir(), "tech-prep-test-"));

process.env.TECHPREP_HOME = home;

// Courses beside the app: a small one, a newer copy of it, and one with a broken manifest.
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
    path.join(dir, "problems.json"),
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

const mini = { format: 1, id: "mini", initials: "Mi", name: "Mini" };

writeCourse("mini-old", { ...mini, version: 1 });

writeCourse("mini-new", { ...mini, version: 2 });

writeCourse("too-new", { ...mini, format: 99, id: "too-new", version: 1 });

writeCourse("no-name", { format: 1, id: "no-name", initials: "X", version: 1 });

const content = await import("../src/content.ts");
const practice = await import("../src/practice.ts");
const scheduler = await import("../src/scheduler.ts");
const runner = await import("../src/runner.ts");
const exercises = await import("../src/exercises.ts");
const jq = await import("../src/jq.ts");
const database = await import("../src/db.ts");

afterAll(() => rmSync(home, { force: true, recursive: true }));

describe("courses", () => {
  test("the app's own courses come first, then the ones beside it", () => {
    expect(content.courses().map((c) => c.id)).toEqual([
      "interview",
      "jq",
      "mini",
    ]);
    expect(content.course().id).toBe("interview");
  });

  test("the higher version of a course id is the one used", () => {
    const found = content.courses().find((c) => c.id === "mini");
    expect(found).toMatchObject({ builtin: false, version: 2 });
    expect(found?.dir).toBe(path.join(extra, "mini-new"));
  });

  test("a broken course is reported and skipped", () => {
    const errors = content.courseErrors();
    expect(errors).toHaveLength(2);
    expect(errors.join("\n")).toContain("course format 99");
    expect(errors.join("\n")).toContain("`name`");
  });

  test("each course has its own curriculum and its own progress", () => {
    const practised = content.inCourse("mini", () => {
      expect(content.validateCurriculum()).toEqual([]);
      scheduler.completeLesson("first-idea");

      return {
        names: content.concepts().map((c) => c.name),
        status: scheduler.conceptStatus("first-idea").stage,
      };
    });

    expect(practised.names).toEqual(["First Idea in mini-new"]);
    expect(practised.status).not.toBe("available");
    expect(content.course().id).toBe("interview");
    expect(content.concepts().length).toBeGreaterThan(1);
    expect(() => content.concept("first-idea")).toThrow();
    expect(existsSync(path.join(home, "progress", "mini.db"))).toBe(true);
  });

  test("the chosen course is remembered for the app and the tutor", () => {
    content.selectCourse("mini");
    expect(content.course().id).toBe("mini");
    content.setCourse("interview");
    content.followSavedCourse();
    expect(content.course().id).toBe("mini");
    content.selectCourse("interview");
    expect(() => content.selectCourse("nope")).toThrow("Unknown course");
  });
});

describe("curriculum", () => {
  test("the index holds the NeetCode 150 with known topics and concepts", () => {
    const topicIds = new Set(content.topics().map((t) => t.id));
    const conceptIds = new Set(content.concepts().map((c) => c.id));
    expect(content.problemIndex().filter((p) => !p.source)).toHaveLength(150);
    expect(content.validateCurriculum()).toEqual([]);

    for (const p of content.problemIndex()) {
      expect(topicIds.has(p.topic)).toBe(true);

      for (const c of p.concepts) {
        expect(conceptIds.has(c)).toBe(true);
      }
    }
  });

  test("every concept has a written lesson, a guided problem and a solo problem", () => {
    const missing = content
      .concepts()
      .filter((c) => !content.hasLesson(c.id))
      .map((c) => c.id);

    expect(missing).toEqual([]);
  });

  test("a guided problem belongs to its lesson and is not a curriculum problem", () => {
    const slug = content.guidedSlug("canonical-key");
    expect(content.problemInfo(slug)).toMatchObject({
      concepts: ["canonical-key"],
      source: "guided",
      title: "Group Words by Length",
    });
    expect(content.problemIndex().some((p) => p.slug === slug)).toBe(false);
  });

  test("concept prerequisites resolve, prerequisites first", () => {
    const order = content.withPrereqs(["window-counts"]);
    expect(order.at(-1)).toBe("window-counts");
    expect(order.indexOf("hash-set")).toBeLessThan(
      order.indexOf("variable-window")
    );
  });
});

describe("runner", () => {
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
    const twoSum = content.problem("two-sum");

    const good = write(
      "good.py",
      "def two_sum(nums, target):\n    seen = {}\n    for i, n in enumerate(nums):\n        if target - n in seen:\n            return [seen[target - n], i]\n        seen[n] = i\n"
    );

    expect(runner.runTests(twoSum, "python", good).passed).toBe(
      twoSum.tests.length
    );

    const bad = write(
      "bad.py",
      "def two_sum(nums, target):\n    print('debug')\n    return [0, 0]\n"
    );

    const badRun = runner.runTests(twoSum, "python", bad);
    expect(badRun.passed).toBeLessThan(badRun.total);
    expect(badRun.cases.find((c) => !c.ok)?.stdout).toContain("debug");
    expect(
      runner.runTests(
        twoSum,
        "python",
        write("crash.py", "def two_sum(nums, target):\n    return nums[999]\n")
      ).cases[0]?.error
    ).toContain("IndexError");
    expect(
      runner.runTests(
        twoSum,
        "python",
        write("syntax.py", "def two_sum(nums target):\n    pass\n")
      ).fatal
    ).toContain("SyntaxError");
  });

  test("typescript: linked lists, design classes and wrong answers", () => {
    const reverse = content.problem("reverse-linked-list");

    const good = write(
      "rev.ts",
      'import { ListNode } from "./ds.ts";\nexport function reverseList(head: ListNode | null): ListNode | null {\n  let prev: ListNode | null = null;\n  while (head) { const next: ListNode | null = head.next; head.next = prev; prev = head; head = next; }\n  return prev;\n}\n'
    );

    expect(runner.runTests(reverse, "typescript", good).passed).toBe(
      reverse.tests.length
    );

    const identity = write(
      "same.ts",
      'import { ListNode } from "./ds.ts";\nexport function reverseList(head: ListNode | null) { return head; }\n'
    );

    expect(
      runner.runTests(reverse, "typescript", identity).passed
    ).toBeLessThan(reverse.tests.length);

    const trie = content.problem("implement-trie-prefix-tree");

    const naive = write(
      "trie.ts",
      "export class Trie {\n  words: string[] = [];\n  insert(w: string) { this.words.push(w); }\n  search(w: string) { return this.words.includes(w); }\n  startsWith(p: string) { return this.words.some((w) => w.startsWith(p)); }\n}\n"
    );

    expect(runner.runTests(trie, "typescript", naive).passed).toBe(
      trie.tests.length
    );
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
  test("credit flows down encompassings as path products, penalties up", () => {
    const below = fire.creditBelow("window-counts");
    expect(below.get("variable-window")).toBe(1);
    expect(below.get("hash-map-counting")).toBeCloseTo(0.7);
    expect(below.get("hash-set")).toBeCloseTo(0.5);
    expect(fire.encompassedBy("hash-set").get("variable-window")).toBeCloseTo(
      0.5
    );
    expect(fire.problemCredit(["window-counts"], "variable-window")).toBe(1);
  });
});

/** The problem a code lesson ends on. */
const soloOf = (conceptId: string): string => {
  const [solo] = content.soloSlugs(conceptId);

  if (!solo) {
    throw new Error(`'${conceptId}' has no solo problem.`);
  }

  return solo;
};

/** Open a problem and write its reference solution as the learner's code. */
const solve = (slug: string, mode: "guided" | "solo" | "review") => {
  const started = practice.startProblem(slug, "python", mode);
  const reference = content.referenceSolution(slug, "python");

  if (!reference) {
    throw new Error(`'${slug}' has no Python reference.`);
  }

  writeFileSync(started.file, reference);

  return started;
};

/** Do both steps of a lesson without help. */
const learn = (conceptId: string) => {
  solve(content.guidedSlug(conceptId), "guided");
  practice.submitProblem(content.guidedSlug(conceptId), "python");
  solve(soloOf(conceptId), "solo");

  return practice.submitProblem(soloOf(conceptId), "python");
};

describe("lessons", () => {
  const DAY = 86_400_000;

  test("the course starts with the first concept, and later ones are locked", () => {
    expect(scheduler.nextLesson()).toBe("dynamic-arrays");
    expect(scheduler.lessonStatus("dynamic-arrays")).toBe("todo");
    expect(scheduler.lessonStatus("hash-set")).toBe("locked");
    expect(scheduler.lessonStep("dynamic-arrays")).toBe(1);
  });

  test("solving the guided problem teaches the concept without passing it", () => {
    const guided = content.guidedSlug("dynamic-arrays");
    solve(guided, "guided");
    const handed = practice.submitProblem(guided, "python");

    expect(handed.finished).toBe(true);
    expect(handed.result?.outcome).toBe("solved");
    expect(scheduler.lessonStep("dynamic-arrays")).toBe(2);
    expect(scheduler.displayStage("dynamic-arrays")).toBe("learning");
    expect(memory.cardOf("dynamic-arrays")).toBeNull();
  });

  test("a submit with failing tests keeps the attempt open", () => {
    const solo = soloOf("dynamic-arrays");
    const started = practice.startProblem(solo, "python", "solo");
    const handed = practice.submitProblem(solo, "python");

    expect(handed.finished).toBe(false);
    expect(practice.currentAttempt()?.id).toBe(started.attempt_id);
    expect(scheduler.displayStage("dynamic-arrays")).toBe("learning");
  });

  test("an unaided solo solve passes the concept, starts its reviews and opens the next lesson", () => {
    const solo = soloOf("dynamic-arrays");
    solve(solo, "solo");
    const handed = practice.submitProblem(solo, "python");

    expect(handed.result?.outcome).toBe("solved");
    expect(scheduler.lessonStatus("dynamic-arrays")).toBe("done");
    expect(memory.cardOf("dynamic-arrays")).not.toBeNull();
    expect(scheduler.problemStatus(solo)).toBe("solved");
    expect(scheduler.lessonStatus("hash-set")).toBe("todo");
    expect(scheduler.nextLesson()).toBe("hash-set");
  });

  test("help on the solo problem keeps the concept in learning, and the problem waits a day", () => {
    expect(learn("hash-set").result?.outcome).toBe("solved");

    const guided = content.guidedSlug("hash-map-counting");
    solve(guided, "guided");
    practice.submitProblem(guided, "python");
    solve("valid-anagram", "solo");
    practice.logHint(2);
    const handed = practice.submitProblem("valid-anagram", "python");

    expect(handed.result?.outcome).toBe("solved_with_help");
    expect(scheduler.lessonStatus("hash-map-counting")).toBe("partial");
    expect(memory.cardOf("hash-map-counting")).toBeNull();
    expect(scheduler.soloWait("hash-map-counting")).not.toBeNull();
    // The course moves on to the next open lesson while this one waits.
    expect(scheduler.nextLesson()).toBe("hash-map-index");
    expect(scheduler.nextLesson(new Date(Date.now() + 1.1 * DAY))).toBe(
      "hash-map-counting"
    );
  });

  test("giving up closes the attempt and returns a solution", () => {
    const guided = content.guidedSlug("hash-map-index");
    practice.startProblem(guided, "python", "guided");
    const { result, solution } = practice.giveUp(guided, "python");

    expect(result.outcome).toBe("gave_up");
    expect(solution).toBe(content.referenceSolution(guided, "python"));
    expect(scheduler.lessonStep("hash-map-index")).toBe(1);
    expect(practice.currentAttempt()).toBeNull();
  });

  test("opening another problem sets the open one aside with no grade", () => {
    const guided = content.guidedSlug("hash-map-index");
    practice.startProblem(guided, "python", "guided");
    practice.startProblem("two-sum", "python", "solo");

    expect(practice.currentAttempt()?.slug).toBe("two-sum");
    practice.pauseAttempt("two-sum", "python");
    expect(practice.currentAttempt()).toBeNull();
    expect(scheduler.problemStatus("two-sum")).toBe("unattempted");
  });
});

describe("reviews", () => {
  const DAY = 86_400_000;

  test("nothing is due straight after learning", () => {
    expect(scheduler.dueCount()).toBe(0);
    expect(scheduler.nextReview()).toBeNull();
    expect(scheduler.nextDue()).not.toBeNull();
  });

  test("due concepts are reviewed with a problem whose concepts are all passed", () => {
    const later = new Date(Date.now() + 60 * DAY);
    const plan = scheduler.reviewPlan(later);

    expect(scheduler.dueCount(later)).toBe(2);
    expect(plan.flatMap((r) => r.covers).toSorted()).toEqual([
      "dynamic-arrays",
      "hash-set",
    ]);

    for (const review of plan) {
      expect(review.problem.concepts.every(scheduler.isPassed)).toBe(true);
    }
  });

  test("a review starts from the empty stub, even on a solved problem", () => {
    const solo = soloOf("dynamic-arrays");
    const started = practice.startProblem(solo, "python", "review");

    expect(readFileSync(started.file, "utf-8").trim()).toBe(
      content.problem(solo).stubs.python.trim()
    );
    expect(started.phase).toBe("review");
    practice.pauseAttempt(solo, "python");
  });

  test("practising an encompassing concept gives partial credit to the passed concept below", () => {
    const before = memory.cardOf("hash-set");

    if (!before) {
      throw new Error("hash-set should have a card once passed.");
    }

    const later = new Date(Date.now() + 5 * DAY);

    const result = fire.propagate(
      {},
      new Map([["sequence-starts", 3 as const]]),
      later
    );

    const credited = result.credited.find((c) => c.concept === "hash-set");
    expect(credited?.credit).toBe(1);
    expect(memory.cardOf("hash-set")?.due.getTime()).toBeGreaterThan(
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

describe("exercises", () => {
  test("predict: the engine runs the code to find the answer and hides it until graded", async () => {
    const shown = exercises.showExercise({
      code: "const s = new Set([1, 1, 2]);\nconsole.log(s.size);",
      conceptIds: ["sequence-starts"],
      kind: "predict",
      prompt: "What does this print?",
      title: "Predict the output",
    });

    expect(shown.verified_output).toBe("2");

    const { exerciseRow } = await db();
    const before = exercises.exerciseView(exerciseRow(shown.exercise_id));
    expect(before.correct_answer).toBeNull();

    const result = exercises.submitExercise(shown.exercise_id, " 2 ", "high");
    expect(result).toMatchObject({ correct: true, status: "graded" });
    expect(() =>
      exercises.submitExercise(shown.exercise_id, "3", null)
    ).toThrow(/already submitted/u);

    const after = exercises.exerciseView(exerciseRow(shown.exercise_id));
    expect(after.correct_answer).toBe("2");
    expect(after.concepts[0]?.result).toBe("pass");
  });

  test("a right answer on an untaught concept skips its lesson and its prerequisites' lessons", () => {
    // The predict above targeted sequence-starts, which needs hash-set (passed earlier).
    expect(scheduler.displayStage("sequence-starts")).toBe("learning");
  });

  test("code that fails or prints nothing is rejected", () => {
    const base = {
      conceptIds: ["hash-set"],
      kind: "predict" as const,
      prompt: "x",
      title: "x",
    };

    expect(() =>
      exercises.showExercise({ ...base, code: "const a: number = ;" })
    ).toThrow(/does not run/u);
    expect(() =>
      exercises.showExercise({ ...base, code: "const a = 1;" })
    ).toThrow(/prints nothing/u);
    expect(() =>
      exercises.showExercise({
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
      exercises.showExercise({
        conceptIds: ["hash-set"],
        distractors: ["seen.clear();"],
        kind: "arrange",
        lines,
        prompt: "Order the lines.",
        title: "Arrange the lines",
      });

    const { exerciseRow } = await db();
    const first = make();
    const view = exercises.exerciseView(exerciseRow(first.exercise_id));
    expect(view.lines?.toSorted()).toEqual(
      [...lines, "seen.clear();"].toSorted()
    );

    const [a = "", b = "", c = "", d = ""] = lines;
    // Passing reviews hash-set; it was passed earlier, so this is the review phase.
    expect(
      exercises.submitExercise(first.exercise_id, [a, c, b, d], "medium")
    ).toMatchObject({ correct: true });

    const second = make();
    expect(
      exercises.submitExercise(
        second.exercise_id,
        [a, b, "seen.clear();", d],
        "high"
      )
    ).toMatchObject({ confident_miss: true, correct: false });
  });

  test("a concept is reviewed once a day: a same-day retry is practice only", async () => {
    const { exerciseRow } = await db();
    const { openExercise } = await db();
    const last = openExercise();

    if (!last) {
      throw new Error("An exercise should be on screen.");
    }

    const view = exercises.exerciseView(exerciseRow(last.id));
    expect(view.status).toBe("graded");
    // SAFETY: results are written by the engine as a list of applied results.
    const applied = JSON.parse(last.results ?? "[]") as { effect: string }[];
    expect(applied[0]?.effect).toContain("practice only");
  });

  test("open answer: the tutor grades each concept, and a hint beyond a question fails", () => {
    const shown = exercises.showExercise({
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
      exercises.gradeAnswer(shown.exercise_id, [
        { concept_id: "hash-set", result: "pass" },
      ])
    ).toThrow(/not submitted/u);

    expect(
      exercises.submitExercise(
        shown.exercise_id,
        "Because lookups are O(1).",
        null
      )
    ).toMatchObject({ status: "submitted" });
    expect(() =>
      exercises.gradeAnswer(shown.exercise_id, [
        { concept_id: "hash-set", result: "pass" },
      ])
    ).toThrow(/one verdict for each/u);

    const graded = exercises.gradeAnswer(shown.exercise_id, [
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
const answer = (slug: string, mode: "guided" | "solo" | "review") => {
  const started = practice.startProblem(slug, "jq", mode);
  writeFileSync(started.file, content.referenceSolution(slug, "jq") ?? "");

  return practice.submitProblem(slug, "jq");
};

describe("jq course", () => {
  test("a command line splits the way a shell splits it", () => {
    expect(jq.splitArgs("-r '.[] | .name'")).toEqual(["-r", ".[] | .name"]);
    expect(jq.splitArgs(`--arg who "Ada Lee" '.x == $who'`)).toEqual([
      "--arg",
      "who",
      "Ada Lee",
      ".x == $who",
    ]);
    expect(jq.splitArgs("-n ''")).toEqual(["-n", ""]);
    expect(() => jq.splitArgs("-r '.name")).toThrow("not closed");
  });

  test("JSON for reading keeps short values on one line", () => {
    expect(jq.showJson({ items: [{ name: "pen" }], shop: "North" })).toBe(
      '{"items": [{"name": "pen"}], "shop": "North"}'
    );
    expect(
      jq.showJson([
        { active: true, name: "Ada", team: "qa" },
        { active: false, name: "Bo", team: "ops" },
      ])
    ).toBe(
      '[\n  {"active": true, "name": "Ada", "team": "qa"},\n  {"active": false, "name": "Bo", "team": "ops"}\n]'
    );
  });

  test("the curriculum is sound, and every lesson that is started is complete", () => {
    content.inCourse("jq", () => {
      expect(content.validateCurriculum()).toEqual([]);

      const written = content
        .concepts()
        .filter((c) => content.lessonText(c.id) !== null);

      expect(written).toHaveLength(content.concepts().length);
      expect(written.map((c) => c.id).slice(0, 6)).toEqual([
        "what-jq-does",
        "reading-json",
        "object-fields",
        "nested-paths",
        "array-items",
        "pipes",
      ]);
      expect(
        written.filter((c) => !content.hasLesson(c.id)).map((c) => c.id)
      ).toEqual([]);

      for (const c of written) {
        const parts = content.lessonText(c.id)?.split(content.TASK_MARKER);

        // One part of text for each guided task, then the summary.
        expect(parts).toHaveLength(content.guidedSlugs(c.id).length + 1);
      }
    });
  });

  test("every reference solves its task, and the starting text does not", () => {
    content.inCourse("jq", () => {
      const slugs = [
        ...content.problemIndex().map((p) => p.slug),
        ...content.concepts().flatMap((c) => content.guidedSlugs(c.id)),
      ].filter(content.isAuthored);

      expect(slugs.length).toBeGreaterThan(40);

      const wrong = slugs.filter((slug) => {
        const task = content.problem(slug);

        const solved = jq.runJq(
          task,
          content.referenceSolution(slug, "jq") ?? ""
        );

        const untouched = jq.runJq(task, task.stubs.jq);

        return (
          solved.passed !== solved.total || untouched.passed === untouched.total
        );
      });

      expect(wrong).toEqual([]);
    });
  }, 60_000);

  test("a filter task compares values, and a command task compares text", () => {
    const want = '{\n  "id": 7,\n  "name": "Ada"\n}';
    const tests = [{ expected: want, input: {} }];
    const filter = { filter: null, flags: [], mode: "filter" as const, tests };
    const command = { ...filter, mode: "command" as const };

    // The same values with another key order and spacing still match.
    expect(jq.sameOutput(filter, '{"name":"Ada","id":7}', want)).toBe(true);
    expect(jq.sameOutput(filter, "{}", want)).toBe(false);
    expect(jq.sameOutput(command, '{"name":"Ada","id":7}', want)).toBe(false);
    expect(jq.runOnce(command, "-c '.'", { input: { id: 7 } }).output).toBe(
      '{"id":7}'
    );
    expect(jq.runOnce(command, "'.'", { input: { id: 7 } }).output).toBe(
      '{\n  "id": 7\n}'
    );
  });

  test("jq's own error text reaches the learner", () => {
    content.inCourse("jq", () => {
      const task = content.problem(content.guidedSlug("nested-paths", 3));
      const seen = jq.previewJq(task, task.stubs.jq);

      expect(seen.matches).toBe(false);
      expect(seen.error).toBe(
        'jq: error: Cannot index string with string "name"'
      );
      // Nothing typed yet is not an error.
      expect(jq.previewJq(task, "  ")).toEqual({
        error: null,
        matches: false,
        output: "",
      });
    });
  });

  test("a predict task takes the value the learner types, and shows no output", () => {
    content.inCourse("jq", () => {
      const task = content.problem("reading-json-solo-2");

      expect(task.jq?.filter).toBeNull();
      expect(jq.runJq(task, "[ 5432,\n 6432 ]").passed).toBe(1);
      expect(jq.runJq(task, "[5432]").passed).toBe(0);
      expect(jq.runJq(task, "[5432, 6432").cases[0]?.error).toContain(
        "not valid JSON"
      );
      expect(jq.previewJq(task, "[5432, 6432]").output).toBe("");
      // The answer key is the output, not the filter that made it.
      expect(content.referenceSolution("reading-json-solo-2", "jq")).toBe(
        "[\n  5432,\n  6432\n]"
      );
      expect(
        content.problem(content.guidedSlug("what-jq-does", 3)).jq?.filter
      ).toBe(".pages");
    });
  });

  test("a lesson is taught after its three guided tasks and learned after both solo tasks", () => {
    content.setCourse("jq");

    try {
      const [first, second, third] = content.guidedSlugs("what-jq-does");
      const [soloOne, soloTwo] = content.soloSlugs("what-jq-does");

      if (!first || !second || !third || !soloOne || !soloTwo) {
        throw new Error("The first lesson is missing tasks.");
      }

      expect(content.guidedConcept(third)).toBe("what-jq-does");
      expect(answer(first, "guided").result?.outcome).toBe("solved");
      answer(second, "guided");
      expect(scheduler.lessonStep("what-jq-does")).toBe(1);
      answer(third, "guided");
      expect(scheduler.lessonStep("what-jq-does")).toBe(2);

      const one = answer(soloOne, "solo");
      expect(one.result?.outcome).toBe("solved");
      expect(one.result?.concepts).toEqual([]);
      expect(scheduler.isPassed("what-jq-does")).toBe(false);

      const two = answer(soloTwo, "solo");
      expect(two.result?.outcome).toBe("solved");
      expect(scheduler.isPassed("what-jq-does")).toBe(true);
      expect(scheduler.nextLesson()).toBe("reading-json");
    } finally {
      content.setCourse("interview");
    }
  });

  test("a solo task solved with help holds the lesson back for a day", () => {
    content.setCourse("jq");

    try {
      for (const slug of content.guidedSlugs("reading-json")) {
        answer(slug, "guided");
      }

      const [soloOne] = content.soloSlugs("reading-json");

      if (!soloOne) {
        throw new Error("The second lesson has no solo task.");
      }

      practice.startProblem(soloOne, "jq", "solo");
      practice.logHint(2);
      writeFileSync(
        content.solutionPath(soloOne, "jq"),
        content.referenceSolution(soloOne, "jq") ?? ""
      );

      expect(practice.submitProblem(soloOne, "jq").result?.outcome).toBe(
        "solved_with_help"
      );
      expect(scheduler.isPassed("reading-json")).toBe(false);
      expect(scheduler.lessonStatus("reading-json")).toBe("partial");
      expect(scheduler.soloWait("reading-json")).not.toBeNull();

      // An attempt left open on a task the course no longer has is set aside.
      database
        .open()
        .query(
          "INSERT INTO attempts (slug, concept_id, language, started_at) VALUES ('guided-gone', 'gone', 'jq', ?)"
        )
        .run(new Date().toISOString());
      expect(practice.currentAttempt()?.slug).toBe("guided-gone");
      practice.pauseUnknownAttempts();
      expect(practice.currentAttempt()).toBeNull();
    } finally {
      content.setCourse("interview");
    }
  });
});
