import { defineConfig } from "oxfmt";
import ultracite from "ultracite/oxfmt";

export default defineConfig({
  ...ultracite,
  ignorePatterns: [
    ...ultracite.ignorePatterns,
    ".agents/skills/**",
    "AGENTS.md",
    "README.md",
    "docs/**",
    "apps/web/src/routeTree.gen.ts",
  ],
});
