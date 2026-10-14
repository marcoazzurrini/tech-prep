import { appendFileSync } from "node:fs";
import { spawnSync } from "node:child_process";

const SESSION = process.env.TECHPREP_SESSION ?? "tech-prep-dojo";
/** Set by the desktop app: a JSON-lines file it watches for test runs. */
const APP_EVENTS = process.env.TECHPREP_APP_EVENTS;

/** Structured data for the desktop app's test panel. The tmux session only gets the line. */
export type AppEvent =
  | { type: "test_start"; file: string }
  | {
      type: "test_result";
      file: string;
      passed: number;
      total: number;
      fatal?: string;
      failure?: { args: unknown[]; expected: unknown; actual?: unknown; error?: string };
    };

/**
 * Tell the tutor about a test run made in Neovim. Inside the desktop app, append the event
 * and the one-line message to the app's events file. Inside a `tp` tmux session, type the
 * line into the tutor's Claude Code pane and submit it. Otherwise do nothing.
 */
export function notifyTutor(message: string, event?: AppEvent): void {
  const line = message.replace(/\s+/g, " ").slice(0, 400);
  if (APP_EVENTS) {
    appendFileSync(APP_EVENTS, `${JSON.stringify({ ...event, tutor: line })}\n`);
    return;
  }
  const pane = spawnSync("tmux", ["show-options", "-t", SESSION, "-v", "@tutor_pane"], { encoding: "utf8" });
  const target = pane.status === 0 ? pane.stdout.trim() : "";
  if (!target) return;
  spawnSync("tmux", ["send-keys", "-t", target, "-l", line]);
  spawnSync("tmux", ["send-keys", "-t", target, "Enter"]);
}

/** Tell the desktop app that a test run started, so it can show progress. */
export function notifyApp(event: AppEvent): void {
  if (APP_EVENTS) appendFileSync(APP_EVENTS, `${JSON.stringify(event)}\n`);
}
