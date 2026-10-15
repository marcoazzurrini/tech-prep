# Starters

Ready-made subjects. `interview/` is the Blind 75.

## Adding or changing a problem

1. Add the problem to `interview/curriculum/problems.json` with its topic and concepts.
2. Create `interview/problems/<slug>/` with `problem.md` (in your own words), `spec.json`, `reference.py` and `reference.ts`. Copy the shape of a similar problem.
3. Leave `expected` out of new tests. Then run `bun scripts/build-problem.ts <slug>` in `packages/engine`. It fills `expected` from `reference.py` and checks that both references pass.

Run `bun scripts/build-problem.ts --all` in `packages/engine` and `bun run test` before committing.
