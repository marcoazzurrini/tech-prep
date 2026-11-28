// End-to-end checks of the built app, driven through its window. Run `bun run e2e` in
// apps/desktop. Each test starts the app on an empty profile, so real progress is not touched.

import assert from "node:assert/strict";
import { execFileSync } from "node:child_process";
import { mkdtempSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import path from "node:path";
import { after, before, describe, test } from "node:test";

import { _electron as electron } from "playwright-core";

const APP = path.join(import.meta.dirname, "..");
const ENGINE = path.join(APP, "..", "..", "packages", "engine");

/** Start the app on a new profile with one course open. */
const launch = async (course, prepare) => {
  const home = mkdtempSync(path.join(tmpdir(), "tech-prep-e2e-"));
  writeFileSync(path.join(home, "state.json"), JSON.stringify({ course }));
  prepare?.(home);

  const env = { ...process.env, TECHPREP_HOME: home };
  // Set when a tool runs Electron as plain Node. The app must start as an app.
  delete env.ELECTRON_RUN_AS_NODE;

  const app = await electron.launch({ args: ["."], cwd: APP, env });
  const page = await app.firstWindow();

  return {
    close: async () => {
      await app.close();
      rmSync(home, { force: true, recursive: true });
    },
    home,
    page,
  };
};

const SHOW = `
  const { checkOfDraft, showExtra } = await import("./src/extras.ts");
  const { savedCourse } = await import("./src/content.ts");
  const { conceptIds, prompt, title, ...draft } = JSON.parse(process.env.DRAFT);
  showExtra(savedCourse(), { check: checkOfDraft(draft), conceptIds, prompt, title });
`;

/** Put an extra exercise on screen, as the tutor does, and wait for the app to show it. */
const showExtra = async ({ home, page }, draft) => {
  execFileSync("bun", ["-e", SHOW], {
    cwd: ENGINE,
    env: {
      ...process.env,
      DRAFT: JSON.stringify({
        conceptIds: ["dynamic-arrays"],
        prompt: "Do this one.",
        ...draft,
      }),
      TECHPREP_HOME: home,
    },
  });
  await page.reload();
  await page.getByRole("button", { name: "Close exercise" }).waitFor();
};

/** Replace the editor's text, as typing would. */
const type = async (page, text) => {
  await page.locator(".cm-content").click();
  await page.keyboard.press("Escape");
  await page.evaluate((value) => {
    const el = document.querySelector(".cm-content");
    const { view } = el.cmView ?? el.cmTile;
    view.dispatch({
      changes: { from: 0, insert: value, to: view.state.doc.length },
    });
  }, text);
};

const button = (page, name) => page.getByRole("button", { name });

/** Start the session from the Today screen. */
const start = async (page) => {
  await button(page, "Start session").click();
};

/** Read the part on screen, then go on to its task. */
const read = async (page) => {
  await page.locator(".tp-lesson-text").waitFor();
  await button(page, "Continue").click();
  await page.locator(".cm-content").waitFor();
};

/** Leave a finished task. The result is on screen until the learner goes on. */
const proceed = async (page) => {
  await button(page, "Why does this work?").waitFor();
  await button(page, "Continue").click();
  await button(page, "Why does this work?").waitFor({ state: "detached" });
};

/** Mark the first concepts of the open course as learned yesterday, so they are due today. */
const LEARNED = `
  const { concepts, savedCourse } = await import("./src/content.ts");
  const { pass } = await import("./src/scheduler.ts");
  const course = savedCourse();
  const yesterday = new Date(Date.now() - 30 * 3_600_000);

  for (const c of concepts(course).slice(0, 3)) {
    pass(course, c.id, yesterday);
  }
`;

describe("a jq session", () => {
  let app;

  before(async () => {
    app = await launch("jq");
  });

  after(() => app.close());

  test("today names the next concept and what the session holds", async () => {
    const { page } = app;

    await page.getByRole("heading", { name: "What jq Does" }).waitFor();
    await page.getByText("See the example, then 3 short tasks.").waitFor();
    await page.getByText("2 tasks with the lesson closed.").waitFor();
    // Nothing is learned yet, so nothing is due and no review is planned.
    assert.equal(await page.getByText("Review", { exact: true }).count(), 0);
  });

  test("a concept starts with its first part, alone on screen", async () => {
    const { page } = app;

    await start(page);
    await page.getByRole("heading", { name: "The problem" }).waitFor();
    await page.getByText("New concept").waitFor();
    assert.equal(await page.locator(".cm-content").count(), 0);
    await read(page);
  });

  test("a wrong answer stays, and says which input it failed", async () => {
    const { page } = app;

    await type(page, "jq '.name' data.json");
    await page.getByText("Differs").waitFor();
    await button(page, "Submit").click();
    await page.getByText("inputs pass").waitFor();
  });

  test("a right answer shows how it went, then the next part", async () => {
    const { page } = app;

    await type(page, "jq '.' data.json");
    await page.getByText("Matches").waitFor();
    await button(page, "Submit").click();
    await page.getByText("Right on try 2.").waitFor();
    await proceed(page);
    await read(page);
  });

  test("the lesson can be opened beside a task done with it", async () => {
    const { page } = app;

    await button(page, "Open the lesson").click();
    await page.getByRole("heading", { name: "What jq Does" }).waitFor();
    await button(page, "Back to the task").click();
    await page.getByText("Wanted output").waitFor();
  });

  test("not knowing shows a solution, and the task comes again", async () => {
    const { page } = app;

    await button(page, "I don't know").click();
    await page.getByText("A solution is shown.").waitFor();
    await page.getByText("Output of the solution").waitFor();
    await proceed(page);
    // The part was read already, so its task opens at once, with an empty answer area.
    await page.locator(".cm-content").waitFor();
    assert.equal(await page.getByText("Output of the solution").count(), 0);
  });

  test("a part can ask what comes out, and takes the value as its answer", async () => {
    const { page } = app;

    await type(page, "jq '.city' data.json");
    await page.getByText("Matches").waitFor();
    await button(page, "Submit").click();
    await proceed(page);
    await read(page);
    // The task shows the input and the command, and no output while typing.
    await page.getByText("jq '.pages' data.json").waitFor();
    assert.equal(await page.getByText("Wanted output").count(), 0);
    await type(page, "413");
    await button(page, "Submit").click();
    await page.getByText("That is not what comes out").waitFor();
    await type(page, "412");
    await button(page, "Submit").click();
    await proceed(page);
  });

  test("the tasks done alone make the concept learned", async () => {
    const { page } = app;

    await page.getByText("On your own").waitFor();
    await type(page, "jq '.status' data.json");
    await page.getByText("Matches").waitFor();
    await button(page, "Submit").click();
    await page.getByText("Right first time.").waitFor();
    await proceed(page);
    await type(page, '{"ok": true, "count": 2}');
    await button(page, "Submit").click();
    await page.getByText("learned · comes back tomorrow").waitFor();
    await proceed(page);
    // The session goes on with the next concept.
    await page.getByRole("heading", { name: "Simple values" }).waitFor();
  });

  test("ending the session shows what it did", async () => {
    const { page } = app;

    await button(page, "End session").click();
    await page.getByRole("heading", { name: "Done." }).waitFor();
    await page.getByText("new concept", { exact: true }).waitFor();
    await page
      .getByText("What jq Does comes back tomorrow, inside a review.")
      .waitFor();
    await button(page, "Finish").click();
    await button(page, "Start session").waitFor();
  });

  test("the concepts list shows where each stands, and a learned one can be read", async () => {
    const { page } = app;

    await button(page, "All concepts").click();
    await page.getByText("Learned · review tomorrow").waitFor();
    await button(page, "Read").click();
    await page.getByRole("heading", { name: "What jq Does" }).waitFor();
    assert.equal(await page.locator(".cm-content").count(), 0);
    await button(page, "Back to concepts").click();
    await button(page, "Back to today").click();
    await button(page, "Start session").waitFor();
  });
});

describe("a session with reviews due", () => {
  let app;

  before(async () => {
    app = await launch("jq", (home) =>
      execFileSync("bun", ["-e", LEARNED], {
        cwd: ENGINE,
        env: { ...process.env, TECHPREP_HOME: home },
      })
    );
  });

  after(() => app.close());

  test("today plans the reviews before the new concept", async () => {
    const { page } = app;

    await page.getByText("3 concepts to review, then this new one.").waitFor();
    await page.getByText("3 concepts are due.").waitFor();
  });

  test("a review names no concept until it is answered", async () => {
    const { page } = app;

    await start(page);
    await page.locator(".cm-content").waitFor();
    await page
      .locator(".tp-session-bar__block", { hasText: "Review" })
      .waitFor();
    assert.equal(await button(page, "Open the lesson").count(), 0);
    assert.equal(await page.getByText("What jq Does").count(), 0);
    await button(page, "Give up").click();
    await page.getByText("This task practised").waitFor();
    await page.getByText("comes back tomorrow").first().waitFor();
  });
});

describe("an extra exercise from the tutor", () => {
  let app;

  before(async () => {
    app = await launch("dsa");
    await app.page.getByRole("button", { name: "Start session" }).waitFor();
  });

  after(() => app.close());

  test("an example is only read", async () => {
    const { page } = app;

    await showExtra(app, {
      code: "console.log([1, 2].length);",
      kind: "example",
      title: "Read this",
    });
    await page.getByText("console.log([1, 2].length);").waitFor();
    assert.equal(await page.getByRole("button", { name: "Submit" }).count(), 0);
  });

  test("predicting the output is graded by the engine", async () => {
    const { page } = app;

    await showExtra(app, {
      code: "console.log([1, 2, 3].length);",
      kind: "predict",
      title: "Predict it",
    });
    await page.getByLabel("Your answer").fill("3");
    await page.getByRole("button", { name: "Submit" }).click();
    await page.getByText("It prints 3").waitFor();
    await page.getByText("Answered").waitFor();
  });

  test("lines are arranged, and the order is graded", async () => {
    const { page } = app;

    await showExtra(app, {
      distractors: ["xs.pop();"],
      kind: "arrange",
      lines: ["const xs = [1];", "xs.push(2);", "console.log(xs.length);"],
      title: "Order the lines",
    });
    await page.getByText("xs.push(2);").waitFor();
    await page.getByRole("button", { name: "Submit" }).click();
    // The lines start mixed, so the order as it stands is not the right one.
    await page.getByText("Not in order").waitFor();
    await page.getByText("An order that works:").waitFor();
  });

  test("an open answer waits for the tutor", async () => {
    const { page } = app;

    await showExtra(app, {
      kind: "answer",
      modelAnswer: "Appending is fast because spare room is kept.",
      rubric: [{ concept_id: "dynamic-arrays", points: ["spare room"] }],
      title: "Explain it",
    });
    await page.getByLabel("Your answer").fill("There is spare room.");
    await page.getByRole("button", { name: "Submit" }).click();
    await page.getByText("The tutor is reading your answer.").waitFor();
  });

  test("closing it goes back to today", async () => {
    const { page } = app;

    const close = page.getByRole("button", { name: "Close exercise" });

    await close.click();
    await close.waitFor({ state: "detached" });
    await page.getByRole("button", { name: "Start session" }).waitFor();
    assert.equal(await page.getByText("Extra practice").count(), 0);
  });
});

describe("a session of code problems", () => {
  let app;

  before(async () => {
    app = await launch("dsa");
  });

  after(() => app.close());

  test("the lesson is read, then its problem is solved in the editor", async () => {
    const { page } = app;

    await start(page);
    await read(page);
    await type(
      page,
      "export function firstAndLastLetters(words: string[]): string[] {\n  return words.map((w) => w[0]);\n}\n"
    );
    // Writing the file with :w runs the tests without handing the problem in.
    await page.keyboard.type(":w\n");
    await page.getByText("Tests · 1 of 8 passed").waitFor();
    await type(
      page,
      "export function firstAndLastLetters(words: string[]): string[] {\n  return words.map((w) => w[0] + w[w.length - 1]);\n}\n"
    );
    await button(page, "Submit").click();
    await page.getByText("Right first time.").waitFor();
  });

  test("Enter goes on to the problem solved alone", async () => {
    const { page } = app;

    await page.keyboard.press("Enter");
    await page.getByText("On your own").waitFor();
    await page
      .getByRole("heading", { name: "Concatenation of Array" })
      .waitFor();
  });
});

describe("when the engine fails", () => {
  let app;

  before(async () => {
    // A file where the progress folder belongs: the engine cannot open any course's progress.
    app = await launch("jq", (home) =>
      writeFileSync(path.join(home, "progress"), "not a folder")
    );
  });

  after(() => app.close());

  test("the app says so and offers to reload, and does not stay blank", async () => {
    const { page } = app;

    await page.getByRole("heading", { name: "Something went wrong" }).waitFor();
    await page.getByRole("button", { name: "Reload" }).waitFor();
  });
});
