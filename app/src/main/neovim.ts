import { rmSync } from "node:fs";
import { join } from "node:path";
import { spawn, type IPty } from "node-pty";
import { ENV, NVIM_SOCKET, ROOT, WORKSPACE } from "./paths";

/**
 * The learner's own Neovim, with their config, in a pseudo-terminal that the renderer
 * draws with xterm.js. It listens on NVIM_SOCKET so the engine can open files in it.
 */
export class Neovim {
  private pty: IPty | null = null;

  constructor(
    private onData: (data: string) => void,
    private onExit: (error?: string) => void,
  ) {}

  start(cols: number, rows: number): void {
    if (this.pty) return;
    rmSync(NVIM_SOCKET, { force: true });
    let pty: IPty;
    try {
      pty = spawn(
        "nvim",
        ["--listen", NVIM_SOCKET, "-c", `luafile ${join(ROOT, "nvim", "tech-prep.lua")}`, "WELCOME.md"],
        {
          name: "xterm-256color",
          cols,
          rows,
          cwd: WORKSPACE,
          env: { ...ENV, TERM: "xterm-256color", COLORTERM: "truecolor" },
        },
      );
    } catch (error) {
      this.onExit(`Neovim could not start: ${error instanceof Error ? error.message : String(error)}`);
      return;
    }
    pty.onData(this.onData);
    pty.onExit(() => {
      this.pty = null;
      this.onExit();
    });
    this.pty = pty;
  }

  write(data: string): void {
    this.pty?.write(data);
  }

  resize(cols: number, rows: number): void {
    if (this.pty) this.pty.resize(cols, rows);
    else this.start(cols, rows);
  }

  stop(): void {
    this.pty?.kill();
  }
}
