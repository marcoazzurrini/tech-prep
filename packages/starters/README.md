# Starters

The courses that ship with the app. `interview/` is the NeetCode 150, taught concept by concept. `jq/` teaches the jq command-line tool.

## Courses

A course is a folder with a `course.json` manifest, a `curriculum/` folder, and its lessons and problems.

```json
{
  "id": "interview",
  "name": "NeetCode 150",
  "initials": "150",
  "version": 1,
  "format": 1
}
```

- `id` never changes. Progress is stored under it.
- `version` goes up with every content change.
- `kind` says what a task is: `"code"` (the default) is code checked by tests, and `"jq"` is a jq filter checked by its output.
- `format` is the course format the content is written for. The app skips a course that needs a newer format than it reads.

The app looks for courses in two places when it starts: the ones it ships with, and the `courses` folder in its data folder. It lists every course it finds. When both places hold the same `id`, the higher `version` is used; on a tie, the one in the data folder wins. A course that cannot be read is skipped, and the others still load.

`bun run sync-courses` copies the courses here into the installed app's data folder. Restart the app to see them. So a content change needs no reinstall. Pass course ids to copy only those.

The scripts below work on the open course. Pass `--course <id>` first to work on another one.

Each concept in `interview/curriculum/concepts.json` has a lesson in `interview/lessons/<concept id>/` and a `solo` problem, the one its lesson ends on. Problems that no lesson ends on are used for reviews. A problem with `"source": "extra"` is not on the NeetCode list; it fills a concept the list has no fitting problem for.

The sections "Adding or changing a problem" and "Adding or changing a lesson" describe a code course. "A jq course" describes the other kind.

## Adding or changing a problem

1. Add the problem to `interview/curriculum/problems.json` with its topic and concepts.
2. Create `interview/problems/<slug>/` with `problem.md` (in your own words), `spec.json`, `reference.py` and `reference.ts`. Copy the shape of a similar problem.
3. Leave `expected` out of new tests. Then run `bun scripts/build-problem.ts <slug>` in `packages/engine`. It fills `expected` from `reference.py` and checks that both references pass.

## Adding or changing a lesson

A lesson folder holds `lesson.md` and a guided problem: `problem.md`, `spec.json` (with a `title`), `reference.py` and `reference.ts`. Copy the shape of `interview/lessons/canonical-key/`.

- `lesson.md` has the concept's name as its title, the idea in a few sentences, then three sections: "Worked example" with one TypeScript block, "Why it works" and "When to use it".
- The guided problem is small and needs exactly this concept. It is solved with the lesson beside it, so the worked example must not solve it line by line. Neither may solve the concept's solo problem.
- Build the guided problem with `bun scripts/build-problem.ts guided-<concept id>`.

Run `bun scripts/build-problem.ts --all` in `packages/engine` and `bun run test` before committing.

## A jq course

Tasks are short, so a lesson has several: a concept in `curriculum/concepts.json` sets `"guided": 3` and lists its solo tasks in `"solo"`. The other tasks in `curriculum/problems.json` are for reviews.

- `lessons/<concept id>/lesson.md`: the lesson text, with the same sections as a code lesson. The worked example shows an input, a filter and the output.
- `lessons/<concept id>/guided.json`: the guided tasks, in order.
- `problems/<slug>.json`: one solo or review task.

A task:

```json
{
  "title": "Products in stock",
  "statement": "Give the name of every product that is in stock.",
  "reference": ".items[] | select(.stock > 0) | .name",
  "tests": [{ "input": { "items": [{ "name": "pen", "stock": 3 }] } }]
}
```

- The first test is the one the learner sees. The others are hidden and checked on Submit. Use `input_text` in place of `input` for raw text, such as one JSON value per line.
- `flags` are flags the task itself passes to jq, such as `["-r"]`.
- `"mode": "command"` makes the learner write everything after `jq`, flags included. The output text must then match exactly. Otherwise outputs are compared as JSON values.
- `stub` is what the editor starts with. It must not solve the task.
- A solo or review statement says what to produce, never which filter to use.

Run `bun scripts/build-jq.ts <concept id>` in `packages/engine`, or `--all`. It runs each reference on each input and writes `expected`.
