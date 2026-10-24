// Assembles out/resources: everything the packaged app runs besides its own code.
// electron-builder copies the folder into the app's Contents/Resources.
//   bin/bun      the Bun runtime this script runs on
//   bin/claude   Claude Code, from the Agent SDK's package for this platform
//   engine/      the bundled engine (run `bun run build` in packages/engine first)
//   starters/    the ready-made subjects
//   tutor/       the Claude Code plugin, with an MCP config that points at the files above

import {
  chmodSync,
  cpSync,
  existsSync,
  mkdirSync,
  rmSync,
  writeFileSync,
} from "node:fs";
import path from "node:path";

const OUT = path.join(import.meta.dir, "..", "out", "resources");

const packageDir = (name: string, from = import.meta.dir) =>
  path.dirname(Bun.resolveSync(`${name}/package.json`, from));

const sdk = packageDir("@anthropic-ai/claude-agent-sdk");

const claude = path.join(
  packageDir(
    `@anthropic-ai/claude-agent-sdk-${process.platform}-${process.arch}`,
    sdk
  ),
  "claude"
);

const engine = path.join(packageDir("@tech-prep/engine"), "dist");
const starters = packageDir("@tech-prep/starters");
const tutor = packageDir("@tech-prep/tutor");

/** A `${NAME}` placeholder, which Claude Code fills from the environment. */
const fromEnv = (name: string) => `\${${name}}`;

if (!existsSync(path.join(engine, "index.js"))) {
  throw new Error(
    "The engine is not built. Run `bun run build` in packages/engine."
  );
}

rmSync(OUT, { force: true, recursive: true });

mkdirSync(path.join(OUT, "bin"), { recursive: true });

for (const [name, from] of [
  ["bun", process.execPath],
  ["claude", claude],
]) {
  const to = path.join(OUT, "bin", name);

  cpSync(from, to);
  chmodSync(to, 0o755);
}

cpSync(engine, path.join(OUT, "engine"), { recursive: true });

for (const name of ["package.json", "interview"]) {
  cpSync(path.join(starters, name), path.join(OUT, "starters", name), {
    recursive: true,
  });
}

for (const name of [".claude-plugin", "skills"]) {
  cpSync(path.join(tutor, name), path.join(OUT, "tutor", name), {
    recursive: true,
  });
}

// The app passes these paths in the environment, so the plugin works wherever the app is installed.
writeFileSync(
  path.join(OUT, "tutor", ".mcp.json"),
  `${JSON.stringify(
    {
      engine: {
        args: [`${fromEnv("TECHPREP_ENGINE")}/index.js`],
        command: fromEnv("TECHPREP_BUN"),
        env: {
          TECHPREP_HOME: fromEnv("TECHPREP_HOME"),
          TECHPREP_STARTERS: fromEnv("TECHPREP_STARTERS"),
        },
      },
    },
    null,
    2
  )}\n`
);

console.log(`Staged ${path.relative(process.cwd(), OUT)}`);
