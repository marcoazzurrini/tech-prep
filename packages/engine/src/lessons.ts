import { spawnSync } from "node:child_process";
import {
  existsSync,
  mkdirSync,
  mkdtempSync,
  rmSync,
  writeFileSync,
} from "node:fs";
import { tmpdir } from "node:os";
import path from "node:path";

import {
  EXTENSIONS,
  WORKSPACE_DIR,
  concept,
  reservedNames,
} from "./content.ts";
import type { Language } from "./content.ts";
import { ensureDataStructures } from "./runner.ts";

export const LESSONS_DIR = path.join(WORKSPACE_DIR, "lessons");

export type LessonKind = "example" | "exercise";

const TIMEOUT_MS = 10_000;

const HEADERS: Record<LessonKind, string> = {
  example: "STEP 1 OF 3 · EXAMPLE · already solved, just read it",
  exercise: "STEP 2 OF 3 · EXERCISE · fill in the TODO lines",
};

const CHECK_HELPER: Record<Language, string> = {
  python: `# (test helper, ignore)
def check(label, actual, expected):
    ok = actual == expected
    print(f"{'✓' if ok else '✗'} {label}: got {actual!r}" + ("" if ok else f", expected {expected!r}"))`,
  typescript: `// (test helper, ignore)
function check(label: string, actual: unknown, expected: unknown): void {
  const ok = JSON.stringify(actual) === JSON.stringify(expected);
  console.log(\`\${ok ? "✓" : "✗"} \${label}: got \${JSON.stringify(actual)}\${ok ? "" : \`, expected \${JSON.stringify(expected)}\`}\`);
}`,
};

const banner = (language: Language, lines: string[]): string => {
  const c = language === "python" ? "#" : "//";
  const rule = `${c} ${"═".repeat(59)}`;

  return [rule, ...lines.map((l) => `${c}  ${l}`), rule].join("\n");
};

/** Lay out a lesson file: header, code, tests. Python needs the helper defined before the checks run. */
const compose = (
  kind: LessonKind,
  language: Language,
  title: string,
  code: string,
  checks: string
): string => {
  const parts = [
    banner(language, [
      kind === "exercise" ? `${HEADERS[kind]}` : HEADERS[kind],
      title,
    ]),
    "",
    code.trim(),
    "",
  ];

  if (language === "python") {
    parts.push(CHECK_HELPER.python, "", "");
  }

  parts.push(
    banner(language, [
      kind === "exercise"
        ? "TESTS · do not edit"
        : "TESTS · they show the example works",
    ]),
    "",
    checks.trim(),
    ""
  );

  if (language === "typescript") {
    parts.push(CHECK_HELPER.typescript, "");
  }

  return parts.join("\n");
};

/** Run a lesson file on its own; lesson files print one ✓ or ✗ line per check. */
export const runLessonFile = (file: string, language: Language) => {
  const [cmd, args]: [string, string[]] =
    language === "python"
      ? ["python3", ["-B", file]]
      : [process.execPath, [file]];

  const proc = spawnSync(cmd, args, {
    encoding: "utf-8",
    timeout: TIMEOUT_MS,
  });

  const output = `${proc.stdout ?? ""}${proc.stderr ?? ""}`.trim();
  const lines = output.split("\n");

  return {
    exitCode: proc.status,
    failed: lines.filter((l) => l.startsWith("✗")).length,
    output,
    passed: lines.filter((l) => l.startsWith("✓")).length,
    timedOut: proc.signal === "SIGTERM",
  };
};

const verify = (source: string, language: Language) => {
  const dir = mkdtempSync(path.join(tmpdir(), "tp-lesson-"));

  try {
    ensureDataStructures(dir, language);
    const file = path.join(dir, `lesson.${EXTENSIONS[language]}`);
    writeFileSync(file, source);

    return runLessonFile(file, language);
  } finally {
    rmSync(dir, { force: true, recursive: true });
  }
};

export interface LessonInput {
  conceptIds: string[];
  kind: LessonKind;
  language: Language;
  /** One line: what the example or exercise is about. */
  title: string;
  /** The function(s). For an exercise, with 2-3 key lines replaced by TODO placeholders that still parse. */
  code: string;
  /** check("label", call(...), expected) lines, one per line. */
  checks: string;
  /** Exercise only: the complete code, used to prove the checks pass when the TODOs are filled. */
  solution?: string;
}

/** Lessons never define a practice problem's function, so they never solve one. */
const rejectProblemNames = (language: Language, body: string): void => {
  const definition = (name: string) =>
    language === "python"
      ? new RegExp(`\\bdef\\s+${name}\\b`, "u")
      : new RegExp(`\\bfunction\\s+${name}\\b|\\b${name}\\s*=(?!=)`, "u");

  const reused = [...reservedNames(language)].filter((name) =>
    definition(name).test(body)
  );

  if (reused.length) {
    throw new Error(
      `The code uses ${reused.join(", ")}, the name of a practice problem. Use a different problem so lessons never solve practice problems.`
    );
  }
};

/**
 * Verify a generated lesson file and, only if it is sound, write it to the workspace.
 * Throws with the reason when verification fails, so the
 * tutor can fix the content and try again.
 */
export const writeLessonFile = (input: LessonInput) => {
  for (const id of input.conceptIds) {
    concept(id);
  }

  const { kind, language } = input;

  const checkCount = (input.checks.match(/\bcheck\(/gu) ?? []).length;

  if (checkCount < 2) {
    throw new Error("Add at least two check(...) lines.");
  }

  rejectProblemNames(language, `${input.code}\n${input.solution ?? ""}`);

  const reference = kind === "exercise" ? input.solution : input.code;

  if (!reference) {
    throw new Error(
      "An exercise needs `solution`: the complete code with the TODO lines filled in."
    );
  }

  const proof = verify(
    compose(kind, language, input.title, reference, input.checks),
    language
  );

  if (
    proof.timedOut ||
    proof.exitCode !== 0 ||
    proof.failed > 0 ||
    proof.passed !== checkCount
  ) {
    throw new Error(
      `The ${kind === "exercise" ? "solution" : "example"} does not pass its checks:\n${proof.output}`
    );
  }

  const source = compose(kind, language, input.title, input.code, input.checks);

  if (kind === "exercise") {
    if (!/TODO/u.test(input.code)) {
      throw new Error("The exercise code has no TODO lines.");
    }

    const blank = verify(source, language);

    if (blank.timedOut) {
      throw new Error(
        "The unfilled exercise hangs. Make the TODO placeholders terminate."
      );
    }

    if (blank.exitCode !== 0) {
      throw new Error(
        `The unfilled exercise must still run (placeholders that parse):\n${blank.output}`
      );
    }
  }

  mkdirSync(LESSONS_DIR, { recursive: true });
  ensureDataStructures(LESSONS_DIR, language);
  const step = kind === "example" ? 1 : 2;

  let file = path.join(
    LESSONS_DIR,
    `${input.conceptIds[0]}-${step}-${kind}.${EXTENSIONS[language]}`
  );

  if (kind === "exercise") {
    for (let n = 2; existsSync(file); n += 1) {
      file = path.join(
        LESSONS_DIR,
        `${input.conceptIds[0]}-${step}-${kind}-${n}.${EXTENSIONS[language]}`
      );
    }
  }

  writeFileSync(file, source);

  return {
    file,
    verified: `${proof.passed}/${checkCount} checks pass with the ${kind === "exercise" ? "solution" : "example code"}`,
  };
};
