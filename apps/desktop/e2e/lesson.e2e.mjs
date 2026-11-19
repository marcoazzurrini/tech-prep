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

const trail = (page) => page.locator(".tp-trail__item");

/** Wait until the trail shows this stop in this state. The screen reloads after an answer. */
const stop = (page, index, state) =>
  page.waitForFunction(
    ([at, name]) => {
      const stops = document.querySelectorAll(".tp-trail__item");

      return stops[at]?.classList.contains(name);
    },
    [index, `tp-trail__item--${state}`],
    { timeout: 10_000 }
  );

describe("a jq lesson", () => {
  let app;

  before(async () => {
    app = await launch("jq");
  });

  after(() => app.close());

  test("opens on its first part, with the later parts not reachable", async () => {
    const { page } = app;

    await page.getByRole("heading", { name: "What jq Does" }).waitFor();
    assert.equal(await trail(page).count(), 4);
    await stop(page, 0, "current");
    assert.equal(await trail(page).nth(1).isDisabled(), true);
  });

  test("a wrong answer stays, and says which input it failed", async () => {
    const { page } = app;

    await type(page, "jq '.name' data.json");
    await page.getByText("Differs").waitFor();
    await page.getByRole("button", { name: "Submit" }).click();
    await page.getByText("inputs pass").waitFor();
    await stop(page, 0, "current");
  });

  test("a right answer opens the next part by itself", async () => {
    const { page } = app;

    await type(page, "jq '.' data.json");
    await page.getByText("Matches").waitFor();
    await page.getByRole("button", { name: "Submit" }).click();
    await page.getByText("Part 1 was right.").waitFor();
    await stop(page, 1, "current");
    await stop(page, 0, "done");
  });

  test("a finished part can be read again, and not changed", async () => {
    const { page } = app;

    await trail(page).nth(0).click();
    await page.getByText("You solved this part.").waitFor();
    assert.equal(await page.getByRole("button", { name: "Submit" }).count(), 0);
    await page.getByRole("button", { name: "Back to part 2" }).click();
    await page.getByRole("button", { name: "Submit" }).waitFor();
  });

  test("giving up shows a solution and asks for the task again", async () => {
    const { page } = app;

    await page.getByRole("button", { name: "Give up" }).click();
    await page.getByText("A solution is shown.").waitFor();
    await page.getByRole("button", { name: "Try again" }).click();
    await page.getByRole("button", { name: "Submit" }).waitFor();
    await stop(page, 1, "current");
    // The new attempt has an answer area of its own: the solution is gone.
    await page.locator(".cm-content").waitFor();
    assert.equal(await page.getByText("Output of the solution").count(), 0);
  });

  test("a part can ask what comes out, and takes the value as its answer", async () => {
    const { page } = app;

    await type(page, "jq '.city' data.json");
    await page.getByText("Matches").waitFor();
    await page.getByRole("button", { name: "Submit" }).click();
    await stop(page, 2, "current");

    // The exercise shows the input and the command, and no output while typing.
    await page.getByText("jq '.pages' data.json").waitFor();
    assert.equal(await page.getByText("Wanted output").count(), 0);

    await type(page, "413");
    await page.getByRole("button", { name: "Submit" }).click();
    await page.getByText("That is not what comes out").waitFor();

    await type(page, "412");
    await page.getByRole("button", { name: "Submit" }).click();
    // The last part was right, so the lesson goes on to the tasks solved alone.
    await stop(page, 3, "current");
  });
});

describe("an extra exercise from the tutor", () => {
  let app;

  before(async () => {
    app = await launch("dsa");
    await app.page.getByText("Step 1 of 2").waitFor();
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

  test("closing it goes back to the lesson", async () => {
    const { page } = app;

    const close = page.getByRole("button", { name: "Close exercise" });

    await close.click();
    await close.waitFor({ state: "detached" });
    // The lesson's own exercise is back, with its editor.
    await page.getByRole("button", { name: "Give up" }).waitFor();
    assert.equal(await page.getByText("Extra practice").count(), 0);
  });
});

describe("a code lesson", () => {
  let app;

  before(async () => {
    app = await launch("dsa");
  });

  after(() => app.close());

  test("solving the guided problem opens the solo problem by itself", async () => {
    const { page } = app;

    await page.getByText("Step 1 of 2").waitFor();
    await type(
      page,
      "export function firstAndLastLetters(words: string[]): string[] {\n  return words.map((w) => w[0] + w[w.length - 1]);\n}\n"
    );
    await page.getByRole("button", { name: "Submit" }).click();
    await page.getByText("Step 2 of 2").waitFor();
    await page.getByText("That was right.").waitFor();
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
