#!/usr/bin/env bun
// Small CLI for checking the engine from a shell, e.g. `bun src/cli.ts check`.

import { courseErrors, setCourse, validateCurriculum } from "./content.ts";
import { orphans } from "./db.ts";
import { nextLesson, nextReview, topicProgress } from "./scheduler.ts";

const args = process.argv.slice(2);

// `--course <id>` reads another course. The default is the course that is open.
if (args[0] === "--course") {
  setCourse(args[1] ?? "");
  args.splice(0, 2);
}

const [command] = args;

switch (command) {
  case "check": {
    const problems = [...courseErrors(), ...validateCurriculum(), ...orphans()];
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
        { lesson: nextLesson(), review: nextReview()?.problem.slug ?? null },
        null,
        2
      )
    );
    break;
  }

  case "progress": {
    for (const t of topicProgress()) {
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
