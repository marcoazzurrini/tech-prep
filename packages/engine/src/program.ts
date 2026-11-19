// Runs a small program on its own and captures what it prints. The checks that are built
// from code use it: a value to predict, lines to arrange, an example to read.

import { spawnSync } from "node:child_process";
import { mkdtempSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import path from "node:path";

import { extension } from "./content.ts";
import type { Language } from "./content.ts";
import { ensureDataStructures } from "./runner.ts";

const TIMEOUT_MS = 10_000;

/** The languages a program can be written in. */
export const PROGRAM_LANGUAGES = ["typescript", "python"];

/** The language a program is in when it is not named. */
export const DEFAULT_LANGUAGE: Language =
  process.env.TECHPREP_LANG === "python" ? "python" : "typescript";

/** Run a small program on its own and capture what it prints. */
export const execute = (source: string, language: Language) => {
  if (!PROGRAM_LANGUAGES.includes(language)) {
    throw new Error(
      `Code in '${language}' cannot be run. Use one of: ${PROGRAM_LANGUAGES.join(", ")}.`
    );
  }

  const dir = mkdtempSync(path.join(tmpdir(), "tp-exercise-"));

  try {
    ensureDataStructures(dir, language);
    const file = path.join(dir, `exercise.${extension(language)}`);
    writeFileSync(file, source);

    const [cmd, args]: [string, string[]] =
      language === "python"
        ? ["python3", ["-I", "-B", file]]
        : [process.execPath, [file]];

    const proc = spawnSync(cmd, args, {
      encoding: "utf-8",
      timeout: TIMEOUT_MS,
    });

    return {
      ok: proc.status === 0 && !proc.signal,
      stderr: (proc.stderr ?? "").trim(),
      stdout: (proc.stdout ?? "").trimEnd(),
      timedOut: proc.signal === "SIGTERM",
    };
  } finally {
    rmSync(dir, { force: true, recursive: true });
  }
};

/** The output of code that must run cleanly and print something. */
export const outputOf = (
  source: string,
  language: Language,
  what: string
): string => {
  const run = execute(source, language);

  if (run.timedOut) {
    throw new Error(`${what} does not finish. Remove the endless loop.`);
  }

  if (!run.ok) {
    throw new Error(`${what} does not run:\n${run.stderr}`);
  }

  if (!run.stdout.trim()) {
    throw new Error(
      `${what} prints nothing. Print the result, so there is an output to check.`
    );
  }

  return run.stdout;
};

/** Outputs are compared the way a person reads them: spacing and quote style do not matter. */
const tidy = (text: string): string =>
  text.replaceAll(/\s+/gu, "").replaceAll(/['`]/gu, '"').toLowerCase();

export const sameReading = (a: string, b: string): boolean =>
  tidy(a) === tidy(b);
