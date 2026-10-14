import { spawn } from "node:child_process";
import type { ChildProcessWithoutNullStreams } from "node:child_process";
import path from "node:path";
import { createInterface } from "node:readline";

import { ENGINE_DIR, ENV } from "./paths";

/** A value the bridge sends back: whatever its method returned, as JSON. */
export type Json =
  | string
  | number
  | boolean
  | null
  | Json[]
  | { [key: string]: Json };

interface Pending {
  resolve: (value: Json | undefined) => void;
  reject: (error: Error) => void;
}

/**
 * Client for the engine's `src/bridge.ts`, a Bun process that answers read-only questions
 * (the current session, the roadmap) from the engine's SQLite state.
 */
export class Engine {
  private child: ChildProcessWithoutNullStreams | null = null;
  private pending = new Map<number, Pending>();
  private nextId = 1;

  private start(): ChildProcessWithoutNullStreams {
    const child = spawn("bun", [path.join(ENGINE_DIR, "src", "bridge.ts")], {
      env: ENV,
    });

    createInterface({ input: child.stdout }).on("line", (line) => {
      let reply: { id: number; result?: Json; error?: string };

      try {
        reply = JSON.parse(line);
      } catch {
        return;
      }

      const waiting = this.pending.get(reply.id);

      if (!waiting) {
        return;
      }

      this.pending.delete(reply.id);

      if (reply.error) {
        waiting.reject(new Error(reply.error));
      } else {
        waiting.resolve(reply.result);
      }
    });
    child.stderr.on("data", (chunk) =>
      process.stderr.write(`[engine] ${chunk}`)
    );
    child.on("exit", () => {
      for (const waiting of this.pending.values()) {
        waiting.reject(new Error("The engine stopped."));
      }

      this.pending.clear();
      this.child = null;
    });

    return child;
  }

  request(method: string): Promise<Json | undefined> {
    this.child ??= this.start();
    const { child } = this;
    const id = this.nextId;
    this.nextId += 1;

    // oxlint-disable-next-line promise/avoid-new -- the reply arrives later as a line on the child's stdout, so a pending promise is the bridge between the two.
    return new Promise((resolve, reject) => {
      this.pending.set(id, { reject, resolve });
      child.stdin.write(`${JSON.stringify({ id, method })}\n`);
    });
  }

  stop(): void {
    this.child?.kill();
  }
}
