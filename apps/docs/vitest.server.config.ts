import { defineConfig } from "vitest/config";

export default defineConfig({
  resolve: {
    conditions: ["source"],
    tsconfigPaths: true,
  },
  test: {
    environment: "node",
    exclude: ["**/node_modules/**", "**/.output/**", "**/.tanstack/**"],
    globals: false,
    include: ["src/**/*.server.test.ts"],
    passWithNoTests: false,
  },
});
