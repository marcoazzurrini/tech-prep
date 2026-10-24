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
    // Problem data: spec.json is written by build-problem, and the reference
    // solutions are answer keys checked by `build-problem --all`.
    "packages/starters/*/problems/**",
    "bun.lock",
  ],
});
