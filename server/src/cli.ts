#!/usr/bin/env bun
// Small CLI for use from Neovim or a shell, e.g. `tp test %` on the current buffer.

import { basename, resolve } from "node:path";
import { parseSolutionPath, validateCurriculum } from "./content.ts";
import { orphans } from "./db.ts";
import { LESSONS_DIR, runLessonFile } from "./lessons.ts";
import { testSolution } from "./practice.ts";
import { formatRun } from "./runner.ts";
import { notifyApp, notifyTutor } from "./notify.ts";
import { nextUp, topicProgress } from "./scheduler.ts";

const [command, arg] = process.argv.slice(2);

switch (command) {
  case "test": {
    if (!arg) throw new Error("usage: tp test <solution-file>");
    const file = resolve(arg);
    notifyApp({ type: "test_start", file });
    if (file.startsWith(LESSONS_DIR)) {
      // Lesson files check themselves and print ✓ or ✗ per check.
      const run = runLessonFile(file, file.endsWith(".py") ? "python" : "typescript");
      console.log(run.output);
      const failed = run.output.split("\n").filter((l) => l.startsWith("✗"));
      const crashed = run.exitCode !== 0 ? ` | did not run: ${run.output.split("\n").slice(-3).join(" ")}` : "";
      notifyTutor(
        `[tp] I ran ${basename(file)}: ${run.passed}/${run.passed + run.failed} checks passed${failed.length ? ` | ${failed.join(" | ")}` : ""}${crashed}`,
        {
          type: "test_result",
          file,
          passed: run.passed,
          total: run.passed + run.failed,
          ...(crashed ? { fatal: run.output.split("\n").slice(-3).join("\n") } : {}),
          ...(failed.length ? { failure: { args: [], expected: null, error: failed[0]!.replace(/^✗\s*/, "") } } : {}),
        },
      );
      process.exit(run.exitCode ?? 1);
    }
    const { slug, language } = parseSolutionPath(file);
    const { run } = testSolution(slug, language, file);
    console.log(formatRun(run, 5));
    const firstFailure = run.cases.find((c) => !c.ok);
    notifyTutor(
      run.fatal
        ? `[tp] I ran the tests for ${slug}: the file did not run (${run.fatal.split("\n")[0]})`
        : `[tp] I ran the tests for ${slug}: ${run.passed}/${run.total} passed${firstFailure ? ` (first failure: case ${firstFailure.index + 1})` : ""}`,
      {
        type: "test_result",
        file,
        passed: run.passed,
        total: run.total,
        ...(run.fatal ? { fatal: run.fatal } : {}),
        ...(firstFailure
          ? {
              failure: {
                args: firstFailure.args,
                expected: firstFailure.expected,
                actual: firstFailure.actual,
                error: firstFailure.error,
              },
            }
          : {}),
      },
    );
    process.exit(run.fatal || run.passed !== run.total ? 1 : 0);
  }
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
    console.log("usage: tp [start] | tp test <file> | tp next | tp progress | tp check");
    process.exit(command ? 1 : 0);
}
