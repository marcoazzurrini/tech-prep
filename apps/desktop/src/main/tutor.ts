import { query } from "@anthropic-ai/claude-agent-sdk";
import type {
  Query,
  SDKMessage,
  SDKUserMessage,
} from "@anthropic-ai/claude-agent-sdk";

import { ENV, TUTOR_PLUGIN, WORKSPACE } from "./paths";

const ENGINE = "mcp__plugin_tech-prep_engine__";
const READ_ONLY = new Set([
  "Read",
  "Glob",
  "Grep",
  "Skill",
  "ToolSearch",
  "TodoWrite",
]);

/** What the learner sees while the tutor uses a tool. */
const ACTIVITY: Record<string, string> = {
  Read: "Reading your code",
  add_note: "Saving a note",
  complete_lesson: "Saving the lesson",
  finish_attempt: "Grading the attempt",
  get_concept: "Reading the concept",
  get_problem: "Reading the problem",
  get_progress: "Checking your progress",
  get_roadmap: "Checking your progress",
  log_hint: "Noting the hint",
  next_up: "Checking what is next",
  run_lesson_file: "Running your checks",
  run_tests: "Running your tests",
  start_problem: "Opening the problem",
  write_lesson_file: "Writing a lesson",
};

const APP_NOTE = `
You are running inside the tech-prep desktop app. The window has two panels: the problem
statement on the left and you on the right. The learner edits files in their own editor.
Your messages render as Markdown in a narrow panel: keep them short, avoid wide tables,
and never paste the learner's whole file back to them.
`.trim();

/** The first message of a session. */
const START =
  "Use the tutor skill. Start a practice session: call `next_up` and follow the action it returns.";

export type TutorEvent =
  | { type: "message"; text: string }
  | { type: "activity"; label: string }
  | { type: "busy"; busy: boolean }
  | { type: "error"; text: string };

/** Claude Code with the tech-prep plugin, driven through the Agent SDK. */
export class Tutor {
  private queue: SDKUserMessage[] = [];
  private wake: (() => void) | null = null;
  private session: Query | null = null;
  private engineCalls = new Set<string>();

  constructor(
    private emit: (event: TutorEvent) => void,
    private onEngineChanged: () => void
  ) {}

  start(): void {
    if (this.session) {
      return;
    }
    this.session = query({
      options: {
        canUseTool: async (name, input) =>
          name.startsWith(ENGINE) || READ_ONLY.has(name)
            ? { behavior: "allow", updatedInput: input }
            : {
                behavior: "deny",
                message:
                  "The tech-prep app allows only the engine tools and read-only tools. The learner writes all the code.",
              },
        cwd: WORKSPACE,
        env: ENV,
        permissionMode: "default",
        plugins: [{ type: "local", path: TUTOR_PLUGIN }],
        settingSources: ["user", "project", "local"],
        systemPrompt: {
          append: APP_NOTE,
          preset: "claude_code",
          type: "preset",
        },
        ...(process.env.TECHPREP_CLAUDE_PATH
          ? { pathToClaudeCodeExecutable: process.env.TECHPREP_CLAUDE_PATH }
          : {}),
      },
      prompt: this.input(),
    });
    void this.read(this.session);
    this.send(START);
  }

  /** Queue a message for the tutor. */
  send(text: string): void {
    this.queue.push({
      message: { content: text, role: "user" },
      parent_tool_use_id: null,
      type: "user",
    });
    this.emit({ busy: true, type: "busy" });
    this.wake?.();
  }

  stop(): void {
    this.session?.close();
    this.session = null;
  }

  private async *input(): AsyncGenerator<SDKUserMessage> {
    while (true) {
      const next = this.queue.shift();

      if (next) {
        yield next;
        continue;
      }

      await new Promise<void>((resolve) => (this.wake = resolve));
      this.wake = null;
    }
  }

  private async read(session: Query): Promise<void> {
    try {
      for await (const message of session) {
        this.handle(message);
      }
    } catch (error) {
      this.emit({
        text: error instanceof Error ? error.message : String(error),
        type: "error",
      });
    } finally {
      this.emit({ busy: false, type: "busy" });

      if (this.session === session) {
        this.session = null;
      }
    }
  }

  private handle(message: SDKMessage): void {
    if (message.type === "assistant" && message.parent_tool_use_id === null) {
      for (const block of message.message.content) {
        if (block.type === "text" && block.text.trim()) {
          this.emit({ type: "message", text: block.text.trim() });
        }
        if (block.type === "tool_use") {
          if (block.name.startsWith(ENGINE)) {
            this.engineCalls.add(block.id);
          }
          const label = ACTIVITY[block.name.replace(ENGINE, "")];

          if (label) {
            this.emit({ type: "activity", label });
          }
        }
      }
    }

    if (message.type === "user" && Array.isArray(message.message.content)) {
      const changed = message.message.content.some(
        (block) =>
          block.type === "tool_result" &&
          this.engineCalls.delete(block.tool_use_id)
      );

      if (changed) {
        this.onEngineChanged();
      }
    }

    if (message.type === "result") {
      this.emit({ busy: false, type: "busy" });

      if (message.subtype !== "success") {
        this.emit({
          type: "error",
          text: `The tutor stopped: ${message.subtype}.`,
        });
      }
      this.onEngineChanged();
    }
  }
}
