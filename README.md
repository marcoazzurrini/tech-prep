# tech-prep

An AI tutor for the Blind 75. You solve problems in Neovim. Claude Code sits in the next
tmux pane as a tutor that follows learning science.

The design splits the work in two:

- **The engine is the harness.** It stores the curriculum and the learner's state, and
  the tutor queries it through MCP tools:
  - a **roadmap** of 18 topics with prerequisites, like NeetCode's;
  - **62 concepts**: small skills inside topics, each with a key idea and prerequisites;
  - the **Blind 75**, each problem tagged with the concepts it needs, with hidden tests
    and reference solutions in Python and TypeScript;
  - progress, FSRS schedules per concept, attempts and tutor notes.
- **The tutor is the teacher.** When a problem needs a concept you haven't learned, the
  tutor writes a worked example and a fill-in exercise on the spot, fitted to you. The
  engine runs them and rejects them if any check fails, so you only see verified code.

The full model (phases, per-concept grading, fractional implicit repetition, how the
next task is chosen) is specified in [docs/learning-model.md](docs/learning-model.md).

Learning science in practice:

- **Worked examples first**, then a faded exercise, then the real problem.
- **Hint ladder**: guiding question, concept name, approach outline, code (on request).
  Every hint is logged and lowers the grade.
- **Teach-back grading**: after a solve you explain the approach, why it works and its
  complexity. The grade combines tests, hints, time and explanation quality.
- **FSRS on concepts, with fractional implicit repetition**: practising a concept also
  refreshes the simpler concepts it encompasses, and reviews pick the problem that covers
  the most due concepts.
- **Mastery-based unlocking**: a concept unlocks when its prerequisites are passed (solved
  once without real help). Struggles while learning never count against you; they bring
  the problem back a day later, and two in a row trigger re-teaching.
- **Unlabelled reviews**: you name the approach before coding, so pattern recognition is
  trained and tracked.

## Layout

```
.claude-plugin/plugin.json      Claude Code plugin manifest
.mcp.json                       starts the engine MCP server
skills/tutor/SKILL.md           the teaching method the tutor follows
commands/                       /tech-prep:practice, :progress, :roadmap
content/curriculum/
  topics.json                   roadmap topics and their prerequisites
  concepts.json                 concepts: topic, prerequisites, key idea
  problems.json                 Blind 75 in roadmap order, tagged with concepts
content/problems/<slug>/        problem.md, spec.json (call shape + tests),
                                reference.py, reference.ts (the tutor's answer key)
server/                         engine: Bun + TypeScript, SQLite, ts-fsrs
  src/index.ts                  MCP tools
  src/scheduler.ts              FSRS, grading, what-to-do-next planner
  src/lessons.ts                verifies and writes generated lesson files
  src/runner.ts, src/harness/   test runner (lists, trees, graphs, design classes)
  scripts/build-problem.ts      fills expected values and verifies references
nvim/tech-prep.lua              <leader>tt and autoread for the tp Neovim
bin/tp                          tmux launcher and CLI wrapper
app/                            desktop app (Electron): problem, Neovim, tests and tutor
server/src/bridge.ts            read-only engine queries for the desktop app
```

State lives in `~/.tech-prep` (override with `TECHPREP_HOME`):
`progress.db` (SQLite) and `workspace/` (your solution files, e.g. `two-sum.py`).

## Setup

Requires Bun, Python 3, tmux, Neovim and Claude Code.

```sh
cd server && bun install && cd ..
ln -s "$PWD/bin/tp" ~/.local/bin/tp   # or anywhere on your PATH
tp                                    # Neovim left, tutor right
```

`tp` starts Claude Code with `--plugin-dir`, so nothing is installed globally. It also
writes `~/.tech-prep/workspace/.claude/settings.json` so the engine tools run without
permission prompts.

Solutions default to TypeScript. Set `TECHPREP_LANG=python` for Python, or ask the
tutor for a language per problem.

## Desktop app

`tp app` opens the same session in one window instead of tmux:

- left: the problem statement, the lesson step, and (for reviews) a locked concept count;
- centre: your own Neovim and config, with a test panel under it;
- right: the tutor chat;
- a Roadmap screen with the topic graph and each topic's concepts and problems.

The first run installs the app's packages. The tutor is Claude Code with this plugin,
run through the Claude Agent SDK, so it uses your Claude Code login. In the app it may
only use the engine tools and read-only tools; it never edits files.

Keys: `⌘1` Today, `⌘2` Roadmap, `⌘E` the editor, `⌘L` the tutor input. `<leader>tt`
runs the tests as before; the app shows the result and tells the tutor.

The app's Neovim listens on `~/.tech-prep/app-nvim.sock`, so it can run beside a `tp`
tmux session. Test runs reach the app through `~/.tech-prep/app-events.jsonl`.

## Neovim

`tp` starts Neovim with `--listen ~/.tech-prep/nvim.sock`. The engine uses that socket
to open lessons, exercises and problems in the left pane, so content is read in Neovim
and the chat stays short. Without `tp`, the tutor gives you file paths instead.

It also loads `nvim/tech-prep.lua` into that Neovim only. It maps `<leader>tt` to save
and run the tests (or a lesson file's checks) in a bottom split, and turns on autoread.

## Commands

- `/tech-prep:practice [concept or slug]` starts a session: due reviews first, then the
  guided path.
- `/tech-prep:progress` summarises recall per concept and upcoming reviews.
- `/tech-prep:roadmap` shows the topics and your progress through them.
- Or just talk to the tutor: "teach me sliding window", "hint", "I give up".

## How grading works

`finish_attempt` re-runs the tests, then derives grades.

Each concept of a problem is graded separately, and only in the review phase:

| Grade | When |
| --- | --- |
| Again | gave up because of this concept, or a level 3-4 hint on it |
| Hard | a level 1-2 hint on it, a struggle the tutor saw, wrong recognition, or a weak explanation |
| Good | solved with no hints on it |
| Easy | as Good, fast, no hints at all, full explanation, pattern recognised |

The tutor's judgements and your self-rating can lower a grade but never raise it.
`tp check` validates the curriculum and your progress data.

## Adding or changing problems

1. Add the problem to `content/curriculum/problems.json` with its topic and concepts.
2. Create `content/problems/<slug>/` with `problem.md` (in your own words), `spec.json`,
   `reference.py` and `reference.ts`. Copy the shape of a similar problem.
3. Leave `expected` out of new tests, then run `cd server && bun scripts/build-problem.ts <slug>`.
   It fills `expected` from `reference.py` and checks that both references pass.

Run `bun scripts/build-problem.ts --all` and `bun test` before committing.
