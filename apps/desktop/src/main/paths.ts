import { execFileSync } from "node:child_process";
import { existsSync, mkdirSync, writeFileSync } from "node:fs";
import { createRequire } from "node:module";
import { homedir } from "node:os";
import { dirname, join } from "node:path";

const require = createRequire(import.meta.url);
const packageDir = (name: string) => dirname(require.resolve(`${name}/package.json`));

/** The Claude Code plugin the tutor loads: skills and the engine's MCP server. */
export const TUTOR_PLUGIN = packageDir("@tech-prep/tutor");
/** The engine package; the app runs its read-only bridge. */
export const ENGINE_DIR = packageDir("@tech-prep/engine");
export const HOME_DIR = process.env.TECHPREP_HOME ?? join(homedir(), ".tech-prep");
export const WORKSPACE = join(HOME_DIR, "workspace");

/**
 * The PATH of the user's login shell. An app opened from the Finder gets a bare PATH
 * without Homebrew, so bun and python3 would not be found.
 */
function loginPath(): string {
  try {
    const shell = process.env.SHELL ?? "/bin/zsh";
    return execFileSync(shell, ["-ilc", 'printf "%s" "$PATH"'], { encoding: "utf8", timeout: 5000 }).trim();
  } catch {
    return "";
  }
}

const PATH = [loginPath(), process.env.PATH ?? ""].filter(Boolean).join(":");

/** Environment for the engine and the tutor. */
export const ENV: Record<string, string> = {
  ...(process.env as Record<string, string>),
  PATH,
  TECHPREP_APP: "1",
};

/** Workspace files the tutor needs, so the app also works on a fresh machine. */
export function ensureWorkspace(): void {
  mkdirSync(join(WORKSPACE, ".claude"), { recursive: true });
  const settings = join(WORKSPACE, ".claude", "settings.json");
  if (!existsSync(settings)) {
    writeFileSync(settings, JSON.stringify({ permissions: { allow: ["mcp__plugin_tech-prep_engine"] } }, null, 2));
  }
  const tsconfig = join(WORKSPACE, "tsconfig.json");
  if (!existsSync(tsconfig)) {
    writeFileSync(
      tsconfig,
      JSON.stringify(
        {
          compilerOptions: {
            target: "ESNext",
            module: "ESNext",
            moduleResolution: "bundler",
            strict: true,
            noEmit: true,
            allowImportingTsExtensions: true,
            lib: ["ESNext"],
          },
        },
        null,
        2,
      ),
    );
  }
}
