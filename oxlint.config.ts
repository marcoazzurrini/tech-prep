import { defineConfig } from "oxlint";
import antiSlop from "ultracite/oxlint/anti-slop";
import core from "ultracite/oxlint/core";
import react from "ultracite/oxlint/react";

export default defineConfig({
  extends: [core, react, antiSlop],
  ignorePatterns: [
    ...(core.ignorePatterns ?? []),
    // Design mockups and the design skill's working files, not project code.
    "**/.impeccable/**",
    // Reference solutions are answer keys checked by `build-problem --all`.
    "packages/starters/*/problems/**",
  ],
});
