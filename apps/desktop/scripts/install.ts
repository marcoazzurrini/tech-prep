// Installs the app electron-builder just made into /Applications, replacing the old copy.
// A copy built on this Mac carries no quarantine flag, so macOS opens it without asking.

import { existsSync, rmSync } from "node:fs";
import path from "node:path";

const NAME = "tech-prep.app";

const BUILT = path.join(
  import.meta.dir,
  "..",
  "dist",
  `mac-${process.arch}`,
  NAME
);

const TARGET = path.join("/Applications", NAME);

if (!existsSync(BUILT)) {
  throw new Error(`No app at ${BUILT}. Run electron-builder first.`);
}

// Quit the running copy, so the new one can take its place.
Bun.spawnSync(["osascript", "-e", 'quit app "tech-prep"']);

rmSync(TARGET, { force: true, recursive: true });

const copy = Bun.spawnSync(["ditto", BUILT, TARGET]);

if (copy.exitCode !== 0) {
  throw new Error(`Could not copy the app: ${copy.stderr.toString()}`);
}

console.log(`Installed ${TARGET}`);
