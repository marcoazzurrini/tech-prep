import { spawnSync } from "node:child_process";
import { existsSync } from "node:fs";
import { join } from "node:path";
import { HOME_DIR } from "./content.ts";

/** `tp` starts Neovim with `--listen` on this socket so the engine can open files in it. */
export const NVIM_SOCKET = process.env.TECHPREP_NVIM_SOCKET ?? join(HOME_DIR, "nvim.sock");

/**
 * Open a file in the learner's Neovim. Returns false when no Neovim is listening,
 * e.g. when Claude Code runs outside `tp`. `reload` discards the buffer's unsaved
 * changes, which is only safe for files the engine owns, like lesson pages.
 */
export function openInEditor(file: string, { reload = false } = {}): boolean {
  if (!existsSync(NVIM_SOCKET)) return false;
  const escaped = file.replace(/([ \\%#|"])/g, "\\$1");
  // Close extra windows such as a test-results split, so the file fills the left pane.
  const keys = `<C-\\><C-N>:silent! only | ${reload ? "edit!" : "edit"} ${escaped}<CR>`;
  const result = spawnSync("nvim", ["--server", NVIM_SOCKET, "--remote-send", keys], { timeout: 3000 });
  return result.status === 0;
}
