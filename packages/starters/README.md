# Starters

The courses that ship with the app. `interview/` is the NeetCode 150, taught concept by concept.

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
- `format` is the course format the content is written for. The app skips a course that needs a newer format than it reads.

The app looks for courses in two places when it starts: the ones it ships with, and the `courses` folder in its data folder. It lists every course it finds. When both places hold the same `id`, the higher `version` is used; on a tie, the one in the data folder wins. A course that cannot be read is skipped, and the others still load.

`bun run sync-courses` copies the courses here into the installed app's data folder. Restart the app to see them. So a content change needs no reinstall. Pass course ids to copy only those.

The scripts below work on the open course. Pass `--course <id>` first to work on another one.

Each concept in `interview/curriculum/concepts.json` has a lesson in `interview/lessons/<concept id>/` and a `solo` problem, the one its lesson ends on. Problems that no lesson ends on are used for reviews. A problem with `"source": "extra"` is not on the NeetCode list; it fills a concept the list has no fitting problem for.

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
