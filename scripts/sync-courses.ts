#!/usr/bin/env bun
// Copies the repo's courses into the installed app's courses folder. The app reads that
// folder when it starts, so new lessons show up after a restart, with no reinstall.
//
// Usage: bun run sync-courses [<course id> ...]
//
// With no ids, every course in packages/starters is copied. A course is checked first, and
// one with errors is not copied.

import {
  cpSync,
  existsSync,
  mkdirSync,
  mkdtempSync,
  readdirSync,
  rmSync,
} from "node:fs";
import { homedir, tmpdir } from "node:os";
import path from "node:path";

const STARTERS = path.join(import.meta.dir, "..", "packages", "starters");
const ENGINE = path.join(import.meta.dir, "..", "packages", "engine");

/** The installed app's data folder, as Electron names it on each platform. */
const dataDir = (): string => {
  if (process.platform === "darwin") {
    return path.join(homedir(), "Library", "Application Support", "tech-prep");
  }

  if (process.platform === "win32") {
    return path.join(
      process.env.APPDATA ?? path.join(homedir(), "AppData", "Roaming"),
      "tech-prep"
    );
  }

  return path.join(
    process.env.XDG_CONFIG_HOME ?? path.join(homedir(), ".config"),
    "tech-prep"
  );
};

const TARGET = process.env.TECHPREP_COURSES ?? path.join(dataDir(), "courses");

const all = readdirSync(STARTERS).filter((name) =>
  existsSync(path.join(STARTERS, name, "course.json"))
);

const wanted = process.argv.slice(2);
const unknown = wanted.filter((name) => !all.includes(name));

if (unknown.length) {
  console.log(
    `✗ No such course: ${unknown.join(", ")}. Found: ${all.join(", ")}.`
  );
  process.exit(1);
}

// The check opens a progress database, so it gets a home of its own.
const scratch = mkdtempSync(path.join(tmpdir(), "tech-prep-sync-"));
let failed = 0;

for (const name of wanted.length ? wanted : all) {
  // The engine's own check, run against the repo's copy with a throwaway home.
  const check = Bun.spawnSync(
    ["bun", "src/cli.ts", "--course", name, "check"],
    {
      cwd: ENGINE,
      env: {
        ...process.env,
        TECHPREP_COURSES: path.join(scratch, "courses"),
        TECHPREP_HOME: scratch,
        TECHPREP_STARTERS: STARTERS,
      },
    }
  );

  if (check.exitCode === 0) {
    const to = path.join(TARGET, name);

    mkdirSync(TARGET, { recursive: true });
    rmSync(to, { force: true, recursive: true });
    cpSync(path.join(STARTERS, name), to, { recursive: true });
    console.log(`✓ ${name} copied to ${to}`);
  } else {
    failed += 1;
    console.log(`✗ ${name} was not copied:\n${check.stdout.toString().trim()}`);
  }
}

rmSync(scratch, { force: true, recursive: true });

console.log("\nRestart tech-prep to see the changes.");

process.exit(failed ? 1 : 0);
