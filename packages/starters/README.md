# Starters

The courses that ship with the app. `dsa/` teaches data structures and algorithms concept by concept, with the NeetCode 150 problems as exercises. `jq/` teaches the jq command-line tool.

## Courses

A course is a folder with a `course.json` manifest, a `curriculum/` folder, and its lessons and problems.

```json
{
  "id": "dsa",
  "name": "DSA",
  "initials": "DSA",
  "version": 1,
  "format": 1
}
```

- `id` never changes. Progress is stored under it. If it must change, add the old id to `RENAMED_COURSES` in the engine, so progress moves to the new id.
- `version` goes up with every content change.
- `kind` says what a task is: `"code"` (the default) is code checked by tests, and `"jq"` is a jq filter checked by its output.
- `format` is the course format the content is written for. The app skips a course that needs a newer format than it reads.

The app looks for courses in two places when it starts: the ones it ships with, and the `courses` folder in its data folder. It lists every course it finds. When both places hold the same `id`, the higher `version` is used; on a tie, the one in the data folder wins. A course that cannot be read is skipped, and the others still load.

`bun run sync-courses` copies the courses here into the installed app's data folder. Restart the app to see them. So a content change needs no reinstall. Pass course ids to copy only those.

The scripts below work on the open course. Pass `--course <id>` first to work on another one.

Each concept in `dsa/curriculum/concepts.json` has a lesson in `dsa/lessons/<concept id>/` and a `solo` problem, the one its lesson ends on. Problems that no lesson ends on are used for reviews. A problem with `"source": "extra"` is not on the NeetCode list; it fills a concept the list has no fitting problem for.

The sections "Adding or changing a problem" and "Adding or changing a lesson" describe a code course. "A jq course" describes the other kind.

## Adding or changing a problem

1. Add the problem to `dsa/curriculum/problems.json` with its topic and concepts.
2. Create `dsa/problems/<slug>/` with `problem.md` (in your own words), `spec.json`, `reference.py` and `reference.ts`. Copy the shape of a similar problem.
3. Leave `expected` out of new tests. Then run `bun scripts/build-problem.ts <slug>` in `packages/engine`. It fills `expected` from `reference.py` and checks that both references pass.

## Adding or changing a lesson

A lesson folder holds `lesson.md` and a guided problem: `problem.md`, `spec.json` (with a `title`), `reference.py` and `reference.ts`. Copy the shape of `dsa/lessons/canonical-key/`.

- `lesson.md` has the concept's name as its title, the idea in a few sentences, then three sections: "Worked example" with one TypeScript block, "Why it works" and "When to use it".
- The guided problem is small and needs exactly this concept. It is solved with the lesson beside it, so the worked example must not solve it line by line. Neither may solve the concept's solo problem.
- Build the guided problem with `bun scripts/build-problem.ts guided-<concept id>`.
- A lesson may have several guided problems, so reading and doing alternate. Set `guided` to their number on the concept in `concepts.json`, and split `lesson.md` into parts as "A jq course" describes. The first guided problem stays in the lesson folder. Put the later ones in `task-2/`, `task-3/` inside it, and build them as `guided-<concept id>.2`, and so on.

Run `bun scripts/build-problem.ts --all` in `packages/engine` and `bun run test` before committing.

## A jq course

The course takes a learner who has never seen jq to fluent use. A lesson starts from a real situation, assumes only the lessons before it, and explains every new word.

Tasks are short, so a lesson has several: a concept in `curriculum/concepts.json` sets how many guided tasks it has in `"guided"` and lists its solo tasks in `"solo"`. The other tasks in `curriculum/problems.json` are for reviews. A concept can be listed before its lesson is written; the app shows it as not written yet.

- `lessons/<concept id>/lesson.md`: the lesson, written in parts. Each part teaches one small idea and ends with a line that holds only `<!-- task -->`. The first part goes with the first guided task, and so on. The text after the last marker is the summary; the app shows it under the last part. The app shows one part at a time, beside its task, so reading and doing alternate. A part is named by its first `## ` heading, and the app lists these names in the top bar. Start every part after the first with that heading, and keep it short.
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
- The learner always types the whole command, as in a terminal: `jq 'filter' data.json`. The task file holds only the filter; the engine adds `jq`, the quotes and the file name to make the answer key and the starting text.
- `file` names the file the input is in. It is `data.json` when left out.
- `flags` are flags the command needs, such as `["-r"]`. The learner types them, and the output text must then match exactly.
- `"mode": "command"` is for tasks about flags: `reference` and `stub` then hold everything between `jq` and the file name, such as `-r '.[] | .name'`. The output text must match exactly. Otherwise outputs are compared as JSON values.
- `"mode": "predict"` makes the learner type the value that comes out, with nothing running while they type. The reference filter makes the answer from the first test's input. `"show_filter": true` shows that filter; leave it out to ask a question about the input alone.
- `stub` is a filter to change or fix; the editor then starts with the whole command around it. Left out, the editor starts empty. It must not solve the task.
- A solo or review statement says what to produce, never which filter to use.

Run `bun scripts/build-jq.ts <concept id>` in `packages/engine`, or `--all`. It runs each reference on each input and writes `expected`.
