#!/usr/bin/env bun
// Small CLI for checking the engine from a shell, e.g. `bun src/cli.ts check`.

import {
  courseById,
  courseErrors,
  savedCourse,
  validateCurriculum,
} from "./content.ts";
import { orphans } from "./db.ts";
import { nextLesson, nextReview, topicProgress } from "./scheduler.ts";

const args = process.argv.slice(2);

// `--course <id>` reads another course. The default is the course that is open.
const course =
  args[0] === "--course" ? courseById(args[1] ?? "") : savedCourse();

if (args[0] === "--course") {
  args.splice(0, 2);
}

const [command] = args;

switch (command) {
  case "check": {
    const problems = [
      ...courseErrors(),
      ...validateCurriculum(course),
      ...orphans(course),
    ];

    console.log(
      problems.length
        ? problems.map((p) => `✗ ${p}`).join("\n")
        : "✓ curriculum and progress are consistent"
    );
    process.exit(problems.length ? 1 : 0);
    break;
  }

  case "next": {
    console.log(
      JSON.stringify(
        {
          lesson: nextLesson(course),
          review: nextReview(course)?.problem.slug ?? null,
        },
        null,
        2
      )
    );
    break;
  }

  case "progress": {
    for (const t of topicProgress(course)) {
      const taught = t.concepts.filter(
        (c) => c.stage !== "locked" && c.stage !== "available"
      ).length;

      console.log(
        `${t.name.padEnd(26)} ${`${t.solved}/${t.total}`.padStart(5)} solved   ${taught}/${t.concepts.length} concepts taught`
      );
    }

    break;
  }

  default: {
    console.log(
      "usage: bun src/cli.ts [--course <id>] next | progress | check"
    );
    process.exit(command ? 1 : 0);
  }
}
