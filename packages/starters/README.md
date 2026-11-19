# Starters

The courses that ship with the app. `dsa/` teaches data structures and algorithms concept by concept, with the NeetCode 150 problems as exercises. `jq/` teaches the jq command-line tool.

Every course is written the same way. Nothing in the app is written for one course.

## A course

A course is a folder:

```
course.json     the manifest
tutor.md        how to tutor this course (optional)
curriculum/     topics.json, concepts.json, exercises.json
lessons/        one folder per concept
exercises/      one folder per exercise
```

```json
{
  "id": "dsa",
  "name": "DSA",
  "initials": "DSA",
  "noun": "problems",
  "formerly": ["interview"],
  "version": 2,
  "format": 2
}
```

- `id` never changes. Progress is stored under it. If it must change, list the old id in `formerly`, so progress moves to the new id.
- `version` goes up with every content change.
- `noun` is what the course calls its exercises on screen: `"problems"`, `"tasks"` or `"exercises"`.
- `format` is the course format the content is written for. The app skips a course written for another format.

The app looks for courses in two places when it starts: the ones it ships with, and the `courses` folder in its data folder. It lists every course it finds. When both places hold the same `id`, the higher `version` is used; on a tie, the one in the data folder wins. A course that cannot be read is skipped, and the others still load.

`bun run sync-courses` copies the courses here into the installed app's data folder. Restart the app to see them. So a content change needs no reinstall. Pass course ids to copy only those.

## The curriculum

- `topics.json`: the chapters, in order.
- `concepts.json`: the lessons. A concept lists its `solo` exercises, the ones its lesson ends on, and sets how many guided exercises it has in `guided` (one when left out). A concept can be listed before its lesson is written; the app shows it as not written yet.
- `exercises.json`: every exercise that is not guided, with its topic, difficulty and concepts. The ones no lesson ends on are used for reviews. An exercise with `"source": "extra"` is left out of the count that names the course.

## An exercise

An exercise is a folder with two files:

- `statement.md`: what to do, in your own words. A solo or review statement says what to produce, never which approach to use.
- `exercise.json`: a `title`, and a `check` that says how the answer is checked.

A lesson's guided exercises are in `lessons/<concept id>/exercises/1`, `2` and so on. Their slugs are `guided-<concept id>`, `guided-<concept id>.2` and so on. Every other exercise is in `exercises/<slug>/`.

The `check` names its checker in `type`. One course can mix them.

### `function`: tests call the learner's code

```json
{
  "check": {
    "type": "function",
    "function": { "python": "two_sum", "typescript": "twoSum" },
    "compare": "unordered",
    "stubs": {
      "python": "def two_sum(nums, target):\n    pass\n",
      "typescript": "…"
    },
    "tests": [{ "args": [[2, 7, 11, 15], 9] }]
  }
}
```

- `stubs` holds the starting code for each language the exercise can be solved in. Put a `reference.py` or `reference.ts` beside it for each one.
- Leave `expected` out of new tests. The build fills it in from the reference.
- Copy a similar exercise for a class (`"calls": "design"`), linked lists or trees.

### `command`: the learner types a whole command

```json
{
  "title": "Products in stock",
  "check": {
    "type": "command",
    "program": "jq",
    "compare": "json",
    "file": "data.json",
    "reference": "jq '.items[] | select(.stock > 0) | .name' data.json",
    "tests": [{ "input": { "items": [{ "name": "pen", "stock": 3 }] } }]
  }
}
```

- The learner types the command as in a terminal, and sees what it prints on the first test's input as they type. The other tests are hidden and checked on Submit.
- `file` names the file the input is in. Use `input_text` in place of `input` for raw text, such as one JSON value per line.
- `compare` is `"json"` to compare outputs as JSON values, or `"text"` when the exact text is the point, as with flags such as `-r`.
- `start` is a command to change or fix. Left out, the editor starts empty. It must not solve the exercise.
- `program` must be one the app can run. A course cannot make the app run anything else.

### `value`: the learner types what comes out

```json
{
  "title": "What comes out?",
  "check": {
    "type": "value",
    "compare": "json",
    "source": {
      "run": "command",
      "program": "jq",
      "command": "jq '.pages' data.json",
      "file": "data.json",
      "input": { "title": "Dune", "pages": 412 },
      "show_command": true
    }
  }
}
```

Nothing runs while the learner types. The build runs the source and writes the answer in `expected`. Leave `show_command` out to ask a question about the input alone.

The checkers `arrange`, `answer` and `read` are for the tutor's extra exercises. A course cannot hold them yet.

## A lesson

`lessons/<concept id>/lesson.md` holds the lesson text. A lesson starts from a real situation, assumes only the lessons before it, and explains every new word.

- A guided exercise is small and needs exactly this concept. It is solved with the lesson beside it, so the lesson must not solve it line by line. Neither may it solve the concept's solo exercises.
- A lesson with several guided exercises is written in parts, so reading and doing alternate. Each part teaches one small idea and ends with a line that holds only `<!-- task -->`. The first part goes with the first guided exercise, and so on. The text after the last marker is the summary; the app shows it under the last part.
- A part is named by its first `## ` heading, and the app lists these names in the top bar. Start every part after the first with that heading, and keep it short.

## Tutoring

`tutor.md` tells the tutor how to teach this course: what the learner knows, the usual mistakes, and what to avoid. The tutor's own skill names no course, so anything specific to yours goes here.

## Building

In `packages/engine`:

- `bun scripts/build.ts <slug>` builds one exercise. It fills in the answers from the reference and reports what is wrong.
- `bun scripts/build.ts --all` builds every exercise and checks every lesson.
- Pass `--course <id>` first to work on a course other than the open one.

Run `bun run test` before committing.
