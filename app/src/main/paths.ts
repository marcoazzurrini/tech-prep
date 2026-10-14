import { execFileSync } from "node:child_process";
import { copyFileSync, existsSync, mkdirSync, writeFileSync } from "node:fs";
import { homedir } from "node:os";
import { join } from "node:path";
import { app } from "electron";

/** The tech-prep repo: the app lives in its `app/` folder. */
export const ROOT = process.env.TECHPREP_ROOT ?? join(app.getAppPath(), "..");
export const HOME_DIR = process.env.TECHPREP_HOME ?? join(homedir(), ".tech-prep");
export const WORKSPACE = join(HOME_DIR, "workspace");
/**
 * A socket of its own, so the app and a `tp` tmux session can run side by side.
 * macOS limits socket paths to 104 bytes, so a long TECHPREP_HOME falls back to /tmp.
 */
const socketInHome = join(HOME_DIR, "app-nvim.sock");
export const NVIM_SOCKET = socketInHome.length < 100 ? socketInHome : `/tmp/tech-prep-app-${process.getuid?.() ?? 0}.sock`;
/** `tp test` appends test runs here; the app watches it. */
export const EVENTS_FILE = join(HOME_DIR, "app-events.jsonl");

/**
 * The PATH of the user's login shell. An app opened from the Finder gets a bare PATH
 * without Homebrew, so bun, nvim and python3 would not be found.
 */
function loginPath(): string {
  try {
    const shell = process.env.SHELL ?? "/bin/zsh";
    return execFileSync(shell, ["-ilc", 'printf "%s" "$PATH"'], { encoding: "utf8", timeout: 5000 }).trim();
  } catch {
    return "";
  }
}

const PATH = [join(ROOT, "bin"), loginPath(), process.env.PATH ?? ""].filter(Boolean).join(":");

/** Environment for Neovim, the engine and the tutor. */
export const ENV: Record<string, string> = {
  ...(process.env as Record<string, string>),
  PATH,
  TECHPREP_APP: "1",
  TECHPREP_APP_EVENTS: EVENTS_FILE,
  TECHPREP_NVIM_SOCKET: NVIM_SOCKET,
};

/** The same workspace files `tp` creates, so the app also works on a fresh machine. */
export function ensureWorkspace(): void {
  mkdirSync(join(WORKSPACE, ".claude"), { recursive: true });
  const settings = join(WORKSPACE, ".claude", "settings.json");
  if (!existsSync(settings)) {
    writeFileSync(settings, JSON.stringify({ permissions: { allow: ["mcp__plugin_tech-prep_engine"] } }, null, 2));
  }
  copyFileSync(join(ROOT, "content", "welcome.md"), join(WORKSPACE, "WELCOME.md"));
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
