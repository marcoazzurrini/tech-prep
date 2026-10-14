import { spawn, type ChildProcessWithoutNullStreams } from "node:child_process";
import { join } from "node:path";
import { createInterface } from "node:readline";
import { ENV, ROOT } from "./paths";

type Pending = { resolve: (value: unknown) => void; reject: (error: Error) => void };

/**
 * Client for `server/src/bridge.ts`, a Bun process that answers read-only questions
 * (the current session, the roadmap) from the engine's SQLite state.
 */
export class Engine {
  private child: ChildProcessWithoutNullStreams | null = null;
  private pending = new Map<number, Pending>();
  private nextId = 1;

  private start(): ChildProcessWithoutNullStreams {
    const child = spawn("bun", [join(ROOT, "server", "src", "bridge.ts")], { env: ENV });
    createInterface({ input: child.stdout }).on("line", (line) => {
      let reply: { id: number; result?: unknown; error?: string };
      try {
        reply = JSON.parse(line);
      } catch {
        return;
      }
      const waiting = this.pending.get(reply.id);
      if (!waiting) return;
      this.pending.delete(reply.id);
      if (reply.error) waiting.reject(new Error(reply.error));
      else waiting.resolve(reply.result);
    });
    child.stderr.on("data", (chunk) => process.stderr.write(`[engine] ${chunk}`));
    child.on("exit", () => {
      for (const waiting of this.pending.values()) waiting.reject(new Error("The engine stopped."));
      this.pending.clear();
      this.child = null;
    });
    return child;
  }

  request(method: string): Promise<unknown> {
    this.child ??= this.start();
    const id = this.nextId++;
    return new Promise((resolve, reject) => {
      this.pending.set(id, { resolve, reject });
      this.child!.stdin.write(`${JSON.stringify({ id, method })}\n`);
    });
  }

  stop(): void {
    this.child?.kill();
  }
}
