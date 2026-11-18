import { afterAll, describe, expect, test } from "bun:test";
import { mkdtempSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import path from "node:path";

// Point the engine at a throwaway home before any module reads it.
const home = mkdtempSync(path.join(tmpdir(), "tech-prep-test-"));

process.env.TECHPREP_HOME = home;

const content = await import("../src/content.ts");
const practice = await import("../src/practice.ts");
const scheduler = await import("../src/scheduler.ts");
const runner = await import("../src/runner.ts");
const exercises = await import("../src/exercises.ts");

afterAll(() => rmSync(home, { force: true, recursive: true }));

describe("curriculum", () => {
  test("the index holds the Blind 75 with known topics and concepts", () => {
    const topicIds = new Set(content.topics().map((t) => t.id));
    const conceptIds = new Set(content.concepts().map((c) => c.id));
    expect(content.problemIndex()).toHaveLength(75);

    for (const p of content.problemIndex()) {
      expect(topicIds.has(p.topic)).toBe(true);

      for (const c of p.concepts) {
        expect(conceptIds.has(c)).toBe(true);
      }
    }
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

const solve = (slug: string, source: string) => {
  const started = practice.startProblem(slug, "python");
  writeFileSync(started.file, source);

  return started;
};

describe("session flow", () => {
  const DAY = 86_400_000;

  const CONTAINS =
    "def contains_duplicate(nums):\n    return len(set(nums)) != len(nums)\n";

  const ANAGRAM =
    "from collections import Counter\ndef is_anagram(s, t):\n    return Counter(s) == Counter(t)\n";

  test("the first problem teaches its untaught concepts, prerequisites first", () => {
    const first = scheduler.nextUp();
    expect(first).toMatchObject({
      action: "learn",
      problem: "contains-duplicate",
    });
    expect(first.action === "learn" && first.new_concepts).toEqual([
      "dynamic-arrays",
      "hash-set",
    ]);
    expect(scheduler.displayStage("hash-set")).toBe("locked");

    // dynamic-arrays has no problems of its own, so its lesson passes it and unlocks hash-set.
    expect(scheduler.completeLesson("dynamic-arrays")).toBe("passed");
    expect(scheduler.displayStage("hash-set")).toBe("available");
    expect(scheduler.completeLesson("hash-set")).toBe("learning");
    expect(scheduler.nextUp()).toMatchObject({
      action: "practice",
      problem: "contains-duplicate",
    });
  });

  test("an independent solve passes the concept and starts its reviews", () => {
    const started = solve("contains-duplicate", CONTAINS);
    expect(started.phase).toBe("learning");
    expect(scheduler.nextUp()).toMatchObject({
      action: "resume",
      problem: "contains-duplicate",
    });

    const result = practice.finishAttempt({
      attemptId: started.attempt_id,
      recognition: "skipped",
    });

    expect(result.outcome).toBe("solved");
    expect(scheduler.displayStage("hash-set")).toBe("passed");
    expect(memory.cardOf("hash-set")).not.toBeNull();
    expect(scheduler.problemStatus("contains-duplicate")).toBe("solved");
  });

  test("help in the learning phase does not touch FSRS, and the problem waits a day", () => {
    scheduler.completeLesson("hash-map-counting");
    const started = solve("valid-anagram", ANAGRAM);
    practice.logHint(2);

    const result = practice.finishAttempt({ attemptId: started.attempt_id });

    expect(result.outcome).toBe("solved_with_help");
    expect(scheduler.displayStage("hash-map-counting")).toBe("learning");
    expect(memory.cardOf("hash-map-counting")).toBeNull();
    expect(scheduler.nextUp()).not.toMatchObject({ problem: "valid-anagram" });
    expect(scheduler.nextUp(new Date(Date.now() + 1.1 * DAY))).toMatchObject({
      problem: "valid-anagram",
    });
  });

  test("a second struggle triggers re-teaching; a new lesson resets it", () => {
    const started = solve(
      "valid-anagram",
      "def is_anagram(s, t):\n    return False\n"
    );

    expect(() =>
      practice.finishAttempt({ attemptId: started.attempt_id })
    ).toThrow(/do not pass/u);
    practice.finishAttempt({
      attemptId: started.attempt_id,
      stopped: "gave_up",
    });
    expect(scheduler.nextUp()).toMatchObject({
      action: "reteach",
      concept: "hash-map-counting",
    });
    scheduler.completeLesson("hash-map-counting");
    expect(scheduler.nextUp()).not.toMatchObject({ action: "reteach" });
  });

  test("a paused attempt records no grade", () => {
    const started = solve("two-sum", "def two_sum(nums, target):\n    pass\n");
    expect(
      practice.finishAttempt({
        attemptId: started.attempt_id,
        stopped: "paused",
      }).outcome
    ).toBe("paused");
    expect(scheduler.problemStatus("two-sum")).toBe("unattempted");
  });

  test("due concepts are reviewed with the problem that covers them best", () => {
    const next = scheduler.nextUp(new Date(Date.now() + 60 * DAY));
    expect(next).toMatchObject({
      action: "review",
      problem: "contains-duplicate",
    });
    expect(next.action === "review" && next.covers).toContain("hash-set");
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
