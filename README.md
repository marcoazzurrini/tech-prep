# tech-prep

An AI tutor that follows learning science. It runs as a desktop app: a chat with the tutor beside the problem. The first subject is the Blind 75.

The design splits the work in two:

- **The engine is the harness.** It stores the curriculum and the learner's state, and the tutor queries it through MCP tools:
  - a **roadmap** of 18 topics with prerequisites, like NeetCode's;
  - **62 concepts**: small skills inside topics, each with a key idea and prerequisites;
  - the **Blind 75**, each problem tagged with the concepts it needs, with hidden tests and reference solutions in Python and TypeScript;
  - progress, FSRS schedules per concept, attempts and tutor notes.
- **The tutor is the teacher.** When a problem needs a concept you haven't learned, the tutor writes a worked example and a fill-in exercise on the spot, fitted to you. The engine runs them and rejects them if any check fails, so you only see verified code.

The full model (phases, per-concept grading, fractional implicit repetition, how the next task is chosen) is specified in [docs/learning-model.md](docs/learning-model.md).

Learning science in practice:

- **Worked examples first**, then a faded exercise, then the real problem.
- **Hint ladder**: guiding question, concept name, approach outline, code (on request). Every hint is logged and lowers the grade.
- **Teach-back grading**: after a solve you explain the approach, why it works and its complexity. The grade combines tests, hints, time and explanation quality.
- **FSRS on concepts, with fractional implicit repetition**: practising a concept also refreshes the simpler concepts it encompasses, and reviews pick the problem that covers the most due concepts.
- **Mastery-based unlocking**: a concept unlocks when its prerequisites are passed (solved once without real help). Struggles while learning never count against you; they bring the problem back a day later, and two in a row trigger re-teaching.
- **Unlabelled reviews**: you name the approach before coding, so pattern recognition is trained and tracked.

## Layout

A Bun workspace monorepo. Apps depend on packages; packages never import apps.

- `apps/desktop/`: the Electron app. The problem on the left, the tutor chat on the right, and a Roadmap screen.
- `packages/engine/`: the engine, served over MCP. It owns curriculum loading, progress in SQLite, FSRS scheduling, grading and the test runner.
  - `src/index.ts`: the MCP tools.
  - `src/bridge.ts`: read-only queries for the desktop app.
  - `src/cli.ts`: `next`, `progress` and `check` from a shell.
  - `scripts/build-problem.ts`: fills expected test values and verifies references.
- `packages/tutor/`: the Claude Code plugin the tutor loads. `skills/tutor/SKILL.md` is the teaching method; `.mcp.json` starts the engine.
- `packages/starters/`: ready-made subjects. `interview/` is the Blind 75: the curriculum JSON and one folder per problem (`problem.md`, `spec.json`, references).
- `docs/learning-model.md`: the learning model.
- `PRODUCT.md`, `DESIGN.md`, `.impeccable/`: product and design notes and mockups.

Your data lives in `~/.tech-prep` (override with `TECHPREP_HOME`): `progress.db` and `workspace/`, where your solution and lesson files go.

## Setup

Requires Bun, Python 3 and a Claude Code login.

```sh
bun install       # all packages; also downloads Electron
bun run dev       # open the desktop app
bun run test      # every package's tests
bun run typecheck
```

The tutor is Claude Code with the tutor plugin, run through the Claude Agent SDK, so it uses your Claude Code login. In the app it may only use the engine tools and read-only tools; it never edits files. You edit the files in your own editor and say "test".

Solutions default to TypeScript. Set `TECHPREP_LANG=python` for Python, or ask the tutor for a language per problem.

Keys: `⌘1` Today, `⌘2` Roadmap, `⌘L` the tutor input.

## How grading works

`finish_attempt` re-runs the tests, then derives grades.

Each concept of a problem is graded separately, and only in the review phase:

| Grade | When |
| --- | --- |
| Again | gave up because of this concept, or a level 3-4 hint on it |
| Hard | a level 1-2 hint on it, a struggle the tutor saw, wrong recognition, or a weak explanation |
| Good | solved with no hints on it |
| Easy | as Good, fast, no hints at all, full explanation, pattern recognised |

The tutor's judgements and your self-rating can lower a grade but never raise it. `bun run check` (in `packages/engine`) validates the curriculum and your progress data.

## Adding or changing problems

1. Add the problem to `packages/starters/interview/curriculum/problems.json` with its topic and concepts.
2. Create `packages/starters/interview/problems/<slug>/` with `problem.md` (in your own words), `spec.json`, `reference.py` and `reference.ts`. Copy the shape of a similar problem.
3. Leave `expected` out of new tests, then run `cd packages/engine && bun scripts/build-problem.ts <slug>`. It fills `expected` from `reference.py` and checks that both references pass.

Run `bun scripts/build-problem.ts --all` and `bun run test` before committing.
