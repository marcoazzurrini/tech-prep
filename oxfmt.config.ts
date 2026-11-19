import { defineConfig } from "oxfmt";
import ultracite from "ultracite/oxfmt";

export default defineConfig({
  ...ultracite,
  ignorePatterns: [
    ...(ultracite.ignorePatterns ?? []),
    // Design mockups and the design skill's working files, not project code.
    "**/.impeccable/**",
    // The penna design, which penna writes itself.
    ".penna/**",
    // Exercise data: exercise.json is written by the engine's build, and the reference
    // solutions are answer keys it checks.
    "packages/starters/*/exercises/**",
    "packages/starters/*/lessons/**",
    "bun.lock",
  ],
});
