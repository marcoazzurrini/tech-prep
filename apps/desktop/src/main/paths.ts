import { execFileSync } from "node:child_process";
import { cpSync, existsSync, mkdirSync, writeFileSync } from "node:fs";
import { createRequire } from "node:module";
import { homedir } from "node:os";
import path from "node:path";

import { app } from "electron";

const require = createRequire(import.meta.url);

const packageDir = (name: string) =>
  path.dirname(require.resolve(`${name}/package.json`));

// A development build keeps its own data, so trying out changes never touches real progress.
if (!app.isPackaged) {
  app.setPath("userData", path.join(app.getPath("appData"), "tech-prep-dev"));
}

/**
 * Where everything the app runs comes from. The packaged app is self-contained: its
 * resources folder holds Bun, Claude Code, the bundled engine, the starters and the tutor
 * plugin. A development build runs the same pieces from the repo instead.
 */
const RESOURCES = app.isPackaged ? process.resourcesPath : null;

/** The Bun runtime that runs the engine and the learner's TypeScript. */
export const BUN = RESOURCES ? path.join(RESOURCES, "bin", "bun") : "bun";

/** Claude Code, for the Agent SDK. Undefined means the SDK's own copy. */
export const CLAUDE =
  process.env.TECHPREP_CLAUDE_PATH ??
  (RESOURCES ? path.join(RESOURCES, "bin", "claude") : undefined);

/** The engine: bundled JavaScript when packaged, the TypeScript sources in development. */
const ENGINE_DIR = RESOURCES
  ? path.join(RESOURCES, "engine")
  : path.join(packageDir("@tech-prep/engine"), "src");

/** One of the engine's entry points, `index` (the MCP server) or `bridge`. */
export const engineEntry = (name: "bridge" | "index"): string =>
  path.join(ENGINE_DIR, `${name}.${RESOURCES ? "js" : "ts"}`);

/** The ready-made subjects. */
const STARTERS_DIR = RESOURCES
  ? path.join(RESOURCES, "starters")
  : packageDir("@tech-prep/starters");

/** The Claude Code plugin the tutor loads: skills and the engine's MCP server. */
export const TUTOR_PLUGIN = RESOURCES
  ? path.join(RESOURCES, "tutor")
  : packageDir("@tech-prep/tutor");

/** The learner's data: progress database and workspace. */
export const HOME_DIR = process.env.TECHPREP_HOME ?? app.getPath("userData");

export const WORKSPACE = path.join(HOME_DIR, "workspace");

/** Where data lived before the app had its own folder. */
const LEGACY_HOME = path.join(homedir(), ".tech-prep");

/**
 * The PATH of the user's login shell. An app opened from the Finder gets a bare PATH
 * without Homebrew, so python3 from Homebrew would not be found.
 */
const loginPath = (): string => {
  try {
    const shell = process.env.SHELL ?? "/bin/zsh";

    return execFileSync(shell, ["-ilc", 'printf "%s" "$PATH"'], {
      encoding: "utf-8",
      timeout: 5000,
    }).trim();
  } catch {
    return "";
  }
};

const PATH = [loginPath(), process.env.PATH ?? ""].filter(Boolean).join(":");

/** Environment for the engine and the tutor. The packaged plugin reads the TECHPREP_ paths. */
export const ENV = {
  ...process.env,
  PATH,
  TECHPREP_APP: "1",
  TECHPREP_BUN: BUN,
  TECHPREP_ENGINE: ENGINE_DIR,
  TECHPREP_HOME: HOME_DIR,
  TECHPREP_STARTERS: STARTERS_DIR,
};

/**
 * Bring progress from `~/.tech-prep` into the app's own folder on the first run of the
 * installed app. The old folder stays as it was, so nothing is lost.
 */
const adoptLegacyHome = (): void => {
  const progress = path.join(HOME_DIR, "progress.db");

  if (
    !app.isPackaged ||
    process.env.TECHPREP_HOME ||
    existsSync(progress) ||
    !existsSync(path.join(LEGACY_HOME, "progress.db"))
  ) {
    return;
  }

  for (const name of [
    "progress.db",
    "progress.db-wal",
    "progress.db-shm",
    "workspace",
  ]) {
    const from = path.join(LEGACY_HOME, name);

    if (existsSync(from)) {
      cpSync(from, path.join(HOME_DIR, name), { recursive: true });
    }
  }
};

/** Workspace files the tutor needs, so the app also works on a fresh machine. */
export const ensureWorkspace = (): void => {
  adoptLegacyHome();
  mkdirSync(path.join(WORKSPACE, ".claude"), { recursive: true });
  const settings = path.join(WORKSPACE, ".claude", "settings.json");

  if (!existsSync(settings)) {
    writeFileSync(
      settings,
      JSON.stringify(
        { permissions: { allow: ["mcp__plugin_tech-prep_engine"] } },
        null,
        2
      )
    );
  }

  const tsconfig = path.join(WORKSPACE, "tsconfig.json");

  if (!existsSync(tsconfig)) {
    writeFileSync(
      tsconfig,
      JSON.stringify(
        {
          compilerOptions: {
            allowImportingTsExtensions: true,
            lib: ["ESNext"],
            module: "ESNext",
            moduleResolution: "bundler",
            noEmit: true,
            strict: true,
            target: "ESNext",
          },
        },
        null,
        2
      )
    );
  }
};
