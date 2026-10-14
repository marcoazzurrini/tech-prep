import { query, type Query, type SDKMessage, type SDKUserMessage } from "@anthropic-ai/claude-agent-sdk";
import { ENV, ROOT, WORKSPACE } from "./paths";

const ENGINE = "mcp__plugin_tech-prep_engine__";
const READ_ONLY = new Set(["Read", "Glob", "Grep", "Skill", "ToolSearch", "TodoWrite"]);

/** What the learner sees while the tutor uses a tool. */
const ACTIVITY: Record<string, string> = {
  next_up: "Checking what is next",
  get_problem: "Reading the problem",
  get_concept: "Reading the concept",
  get_roadmap: "Checking your progress",
  get_progress: "Checking your progress",
  start_problem: "Opening the problem",
  write_lesson_file: "Writing a lesson",
  complete_lesson: "Saving the lesson",
  run_tests: "Running your tests",
  log_hint: "Noting the hint",
  finish_attempt: "Grading the attempt",
  add_note: "Saving a note",
  Read: "Reading your code",
};

const APP_NOTE = `
You are running inside the tech-prep desktop app, not tmux. The window has three panels:
the problem statement on the left, the learner's Neovim in the centre with a test panel
under it, and you on the right. Neovim shows one file at a time, exactly as with tmux, and
the engine tools still open files in it. When the learner presses <leader>tt, the test
panel shows the result and a line starting with [tp] arrives in chat, as before.
Your messages render as Markdown in a narrow panel: keep them short, avoid wide tables,
and never paste the learner's whole file back to them.
`.trim();

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
    private onEngineChanged: () => void,
  ) {}

  start(): void {
    if (this.session) return;
    this.session = query({
      prompt: this.input(),
      options: {
        cwd: WORKSPACE,
        env: ENV,
        plugins: [{ type: "local", path: ROOT }],
        settingSources: ["user", "project", "local"],
        systemPrompt: { type: "preset", preset: "claude_code", append: APP_NOTE },
        permissionMode: "default",
        canUseTool: async (name, input) =>
          name.startsWith(ENGINE) || READ_ONLY.has(name)
            ? { behavior: "allow", updatedInput: input }
            : {
                behavior: "deny",
                message: "The tech-prep app allows only the engine tools and read-only tools. The learner writes all the code.",
              },
        ...(process.env.TECHPREP_CLAUDE_PATH ? { pathToClaudeCodeExecutable: process.env.TECHPREP_CLAUDE_PATH } : {}),
      },
    });
    void this.read(this.session);
    this.send("/tech-prep:practice");
  }

  /** Queue a message for the tutor. Hidden messages (e.g. [tp] test lines) are not shown in chat. */
  send(text: string): void {
    this.queue.push({ type: "user", message: { role: "user", content: text }, parent_tool_use_id: null });
    this.emit({ type: "busy", busy: true });
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
      for await (const message of session) this.handle(message);
    } catch (error) {
      this.emit({ type: "error", text: error instanceof Error ? error.message : String(error) });
    } finally {
      this.emit({ type: "busy", busy: false });
      if (this.session === session) this.session = null;
    }
  }

  private handle(message: SDKMessage): void {
    if (message.type === "assistant" && message.parent_tool_use_id === null) {
      for (const block of message.message.content) {
        if (block.type === "text" && block.text.trim()) this.emit({ type: "message", text: block.text.trim() });
        if (block.type === "tool_use") {
          if (block.name.startsWith(ENGINE)) this.engineCalls.add(block.id);
          const label = ACTIVITY[block.name.replace(ENGINE, "")];
          if (label) this.emit({ type: "activity", label });
        }
      }
    }
    if (message.type === "user" && Array.isArray(message.message.content)) {
      const changed = message.message.content.some(
        (block) => block.type === "tool_result" && this.engineCalls.delete(block.tool_use_id),
      );
      if (changed) this.onEngineChanged();
    }
    if (message.type === "result") {
      this.emit({ type: "busy", busy: false });
      if (message.subtype !== "success") this.emit({ type: "error", text: `The tutor stopped: ${message.subtype}.` });
      this.onEngineChanged();
    }
  }
}
