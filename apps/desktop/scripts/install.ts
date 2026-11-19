// Installs the app electron-builder just made into /Applications, replacing the old copy.
// Progress lives outside the app, so it survives every install. It is still backed up first,
// in case a new version changes the database.
//
// Usage: bun run install-app [--open]
//
// A copy built on this Mac carries no quarantine flag, so macOS opens it without asking.

import { cpSync, existsSync, mkdirSync, readdirSync, rmSync } from "node:fs";
import { homedir } from "node:os";
import path from "node:path";

import { $ } from "bun";

const NAME = "tech-prep";

const BUILT = path.join(
  import.meta.dir,
  "..",
  "dist",
  `mac-${process.arch}`,
  `${NAME}.app`
);

const TARGET = path.join("/Applications", `${NAME}.app`);

/** Where the installed app keeps the learner's progress. */
const DATA_DIR = path.join(homedir(), "Library", "Application Support", NAME);
const BACKUPS_DIR = path.join(DATA_DIR, "backups");

/** One database per course. */
const PROGRESS = "progress";

/** The single database of earlier versions. The app moves it into `progress/` when it opens. */
const OLD_DATABASE = "progress.db";

const PROGRESS_FILES = [
  PROGRESS,
  OLD_DATABASE,
  `${OLD_DATABASE}-wal`,
  `${OLD_DATABASE}-shm`,
];

const BACKUPS_TO_KEEP = 10;

const step = (message: string): void => {
  process.stdout.write(`\n→ ${message}\n`);
};

const isRunning = async (): Promise<boolean> => {
  const result = await $`pgrep -x ${NAME}`.quiet().nothrow();

  return result.exitCode === 0;
};

/** Polls every 200 ms, for up to 10 seconds, until the app has exited. */
const waitUntilQuit = async (attemptsLeft = 50): Promise<boolean> => {
  if (!(await isRunning())) {
    return true;
  }

  if (attemptsLeft === 0) {
    return false;
  }

  await Bun.sleep(200);

  return waitUntilQuit(attemptsLeft - 1);
};

/** Asks the app to quit, so SQLite finishes writing before anything is copied. */
const quitApp = async (): Promise<void> => {
  if (!(await isRunning())) {
    return;
  }

  step(`Quitting ${NAME}`);
  await $`osascript -e ${`quit app "${NAME}"`}`.quiet().nothrow();

  if (!(await waitUntilQuit())) {
    throw new Error(`${NAME} did not quit. Close it and run the script again.`);
  }
};

/** Copies the progress databases into backups/<timestamp>/ and keeps the newest few. */
const backUpProgress = (): string | null => {
  if (!PROGRESS_FILES.some((file) => existsSync(path.join(DATA_DIR, file)))) {
    return null;
  }

  // Local time, so folder names match the clock: 2026-10-24 09-30-05.
  const stamp = new Date().toLocaleString("sv-SE").replaceAll(":", "-");
  const target = path.join(BACKUPS_DIR, stamp);
  mkdirSync(target, { recursive: true });

  for (const file of PROGRESS_FILES) {
    const source = path.join(DATA_DIR, file);

    if (existsSync(source)) {
      cpSync(source, path.join(target, file), { recursive: true });
    }
  }

  const old = readdirSync(BACKUPS_DIR)
    .toSorted()
    .toReversed()
    .slice(BACKUPS_TO_KEEP);

  for (const folder of old) {
    rmSync(path.join(BACKUPS_DIR, folder), { force: true, recursive: true });
  }

  return target;
};

if (process.platform !== "darwin") {
  throw new Error("install-app installs the macOS app and only runs on a Mac.");
}

if (!existsSync(BUILT)) {
  throw new Error(`No app at ${BUILT}. Run electron-builder first.`);
}

await quitApp();

step("Backing up your progress");

const backup = backUpProgress();

process.stdout.write(
  backup === null
    ? "No progress yet, nothing to back up.\n"
    : `Saved to ${backup}\n`
);

step(`Installing ${TARGET}`);

rmSync(TARGET, { force: true, recursive: true });

await $`ditto ${BUILT} ${TARGET}`;

process.stdout.write(
  `\n✓ ${NAME} is installed. Your progress stays in ${DATA_DIR}\n`
);

if (process.argv.includes("--open")) {
  // `open` passes this shell's environment to the app. With ELECTRON_RUN_AS_NODE set,
  // Electron would start as plain Node and quit.
  const { ELECTRON_RUN_AS_NODE: _, ...env } = process.env;

  await $`open ${TARGET}`.env(env);
}
