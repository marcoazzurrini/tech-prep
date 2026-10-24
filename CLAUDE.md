# CLAUDE.md

How we work in this repo. The code is the source of truth for how things work; this file covers process only.

## Docs

- `PRODUCT.md`: who the app is for, what it does, and the product principles.
- `DESIGN.md`: design tokens and visual rules, mirrored from the penna design.
- `docs/learning-model.md`: the learning model the engine implements.
- `README.md`: what the project is and how to run it.

Keep them current. When a change makes a doc wrong, fix the doc in the same PR.

Keep them lean:

- Write only what the code can't tell you: intent, principles and rules.
- Leave out file layouts, counts, dates, technical decisions and implementation notes. They go stale, and the code already says them.
- Say each thing in one doc and link to it from the others.
- Delete anything that is no longer true or useful.
- Write short, plain sentences. Easy reading is a product requirement, and it applies to docs too.

## Design

- The penna design in `.penna/` is the source of truth for visual design. Read its variables and components with the penna MCP tools before building UI.
- Prototype new screens and components in penna first, using its variables and components. Build them in code after the user approves.
- Build UI from the components in `packages/ui`. A new component goes there with a Storybook story, and a new screen gets a story in `apps/demo`.
- Keep the penna design, `DESIGN.md` and the code in sync. A design change in one lands in the others in the same task.
- penna writes every edit to `.penna/` straight away. Commit `.penna/` with the change it belongs to.

## Workflow

- `main` is protected. Work on a branch, open a PR and wait for CI. Merges are rebase-only. Ask before merging.
- Run `bun run check` before pushing. It runs what CI runs.
- Git hooks format, lint, typecheck and scan for secrets on commit, and run tests on push. Don't bypass them.
- The repo is public. Keep personal details out of code, docs and commits.
