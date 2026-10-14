#!/usr/bin/env bun
// Small CLI for checking the engine from a shell, e.g. `bun src/cli.ts check`.

import { validateCurriculum } from "./content.ts";
import { orphans } from "./db.ts";
import { nextUp, topicProgress } from "./scheduler.ts";

const [command] = process.argv.slice(2);

switch (command) {
  case "check": {
    const problems = [...validateCurriculum(), ...orphans()];
    console.log(problems.length ? problems.map((p) => `✗ ${p}`).join("\n") : "✓ curriculum and progress are consistent");
    process.exit(problems.length ? 1 : 0);
  }
  case "next":
    console.log(JSON.stringify(nextUp(), null, 2));
    break;
  case "progress":
    for (const t of topicProgress()) {
      const taught = t.concepts.filter((c) => c.stage !== "locked" && c.stage !== "available").length;
      console.log(`${t.name.padEnd(26)} ${`${t.solved}/${t.total}`.padStart(5)} solved   ${taught}/${t.concepts.length} concepts taught`);
    }
    break;
  default:
    console.log("usage: bun src/cli.ts next | progress | check");
    process.exit(command ? 1 : 0);
}
