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
const lessons = await import("../src/lessons.ts");

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

const hint = (concept_id: string | null, level: number) => ({
  attempt_id: 0,
  concept_id,
  created_at: "",
  id: 0,
  level,
});

describe("grading", () => {
  const base = {
    concepts: ["sorting", "two-pointers-opposite", "skip-duplicates"],
    diagnosis: new Map<string, "ok" | "struggled" | "failed">(),
    difficulty: "medium" as const,
    explanationScore: 2,
    gaveUp: false,
    hints: [],
    minutes: 10,
    recognition: "correct" as const,
    solved: true,
  };

  const grades = (
    overrides: Partial<Parameters<typeof grading.gradeAttempt>[0]>
  ) =>
    Object.fromEntries(
      grading
        .gradeAttempt({ ...base, ...overrides })
        .map((g) => [g.concept, g.grade])
    );

  test("a clean solve is Good for every concept, Easy when fast with a full explanation", () => {
    expect(grades({})).toEqual({
      "skip-duplicates": 3,
      sorting: 3,
      "two-pointers-opposite": 3,
    });
    expect(grades({ explanationScore: 3 })["sorting"]).toBe(4);
  });

  test("hints only lower the concept they were about", () => {
    expect(grades({ hints: [hint("skip-duplicates", 2)] })).toEqual({
      "skip-duplicates": 2,
      sorting: 3,
      "two-pointers-opposite": 3,
    });
    expect(
      grades({ hints: [hint("skip-duplicates", 3)] })["skip-duplicates"]
    ).toBe(1);
    expect(grades({ hints: [hint(null, 2)] })).toEqual({
      "skip-duplicates": 2,
      sorting: 2,
      "two-pointers-opposite": 2,
    });
  });

  test("giving up blames only the diagnosed culprit", () => {
    const diagnosis = new Map([["skip-duplicates", "failed" as const]]);
    expect(grades({ diagnosis, gaveUp: true, solved: false })).toEqual({
      "skip-duplicates": 1,
      sorting: 2,
      "two-pointers-opposite": 2,
    });
  });

  test("judgements and the self-rating only lower grades", () => {
    expect(grades({ recognition: "wrong" })["sorting"]).toBe(2);
    expect(grades({ explanationScore: 1 })["sorting"]).toBe(2);
    expect(
      grades({ diagnosis: new Map([["sorting", "struggled" as const]]) })[
        "sorting"
      ]
    ).toBe(2);
    expect(grading.gradeAttempt({ ...base, selfRating: 2 })[0]?.grade).toBe(2);
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
      explanationScore: 2,
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
    practice.logHint(started.attempt_id, 2, "hash-map-counting");

    const result = practice.finishAttempt({
      attemptId: started.attempt_id,
      explanationScore: 2,
    });

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

    practice.finishAttempt({
      attemptId: started.attempt_id,
      explanationScore: 1,
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
        explanationScore: 0,
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
      0,
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

describe("generated lessons", () => {
  const code =
    "export function countEven(nums: number[]): number {\n  return nums.filter((n) => n % 2 === 0).length;\n}";

  const checks =
    'check("mixed", countEven([1, 2, 4]), 2);\ncheck("empty", countEven([]), 0);';

  test("a correct example is written with banners and the helper", async () => {
    const out = lessons.writeLessonFile({
      checks,
      code,
      conceptIds: ["dynamic-arrays"],
      kind: "example",
      language: "typescript",
      title: "Count even numbers.",
    });

    const text = await Bun.file(out.file).text();
    expect(text).toContain("STEP 1 OF 3 · EXAMPLE");
    expect(text).toContain("function check(");
    expect(out.verified).toContain("2/2");
  });

  test("a wrong example, a practice-problem name, or a broken exercise is rejected", () => {
    const wrong =
      'check("mixed", countEven([1, 2, 4]), 3);\ncheck("empty", countEven([]), 0);';

    expect(() =>
      lessons.writeLessonFile({
        checks: wrong,
        code,
        conceptIds: ["dynamic-arrays"],
        kind: "example",
        language: "typescript",
        title: "x",
      })
    ).toThrow(/does not pass/u);

    const reused =
      "export function twoSum(a: number[]): number[] { return a; }";

    expect(() =>
      lessons.writeLessonFile({
        checks: 'check("a", twoSum([1]), [1]);\ncheck("b", twoSum([]), []);',
        code: reused,
        conceptIds: ["hash-set"],
        kind: "example",
        language: "typescript",
        title: "x",
      })
    ).toThrow(/practice problem/u);

    const broken =
      "export function countEven(nums: number[]): number {\n  return nums.filter((n) => // TODO\n}";

    expect(() =>
      lessons.writeLessonFile({
        checks,
        code: broken,
        conceptIds: ["dynamic-arrays"],
        kind: "exercise",
        language: "typescript",
        solution: code,
        title: "x",
      })
    ).toThrow(/must still run/u);
  });

  test("a sound python exercise is written and never overwrites an earlier one", () => {
    const solution =
      "def count_even(nums):\n    return sum(1 for n in nums if n % 2 == 0)";

    const blank =
      "def count_even(nums):\n    return 0  # TODO: count the even numbers";

    const pyChecks =
      'check("mixed", count_even([1, 2, 4]), 2)\ncheck("empty", count_even([]), 0)';

    const input = {
      checks: pyChecks,
      code: blank,
      conceptIds: ["dynamic-arrays"],
      kind: "exercise" as const,
      language: "python" as const,
      solution,
      title: "Count even numbers.",
    };

    const first = lessons.writeLessonFile(input);
    const second = lessons.writeLessonFile(input);
    expect(first.file).not.toBe(second.file);
    expect(lessons.runLessonFile(first.file, "python").failed).toBe(1);
  });
});

describe("reserved names", () => {
  test("only definitions of distinctive practice names are blocked", () => {
    const base = {
      conceptIds: ["dynamic-arrays"],
      kind: "example" as const,
      language: "typescript" as const,
      title: "x",
    };

    const arrow = "export const twoSum = (a: number[]) => a;";
    expect(() =>
      lessons.writeLessonFile({
        ...base,
        checks: 'check("a", twoSum([1]), [1]);\ncheck("b", twoSum([]), []);',
        code: arrow,
      })
    ).toThrow(/practice problem/u);

    const generic =
      "export function search(a: number[], t: number): number { return a.indexOf(t); }";

    expect(() =>
      lessons.writeLessonFile({
        ...base,
        checks:
          'check("a", search([1, 2], 2), 1);\ncheck("b", search([], 1), -1);',
        code: generic,
      })
    ).not.toThrow();
  });
});
