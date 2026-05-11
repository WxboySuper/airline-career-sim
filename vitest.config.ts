import { defineConfig } from "vitest/config";

export const baseVitestConfig = defineConfig({
  test: {
    include: ["src/**/*.test.ts"],
    environment: "node"
  }
});

export default defineConfig({
  test: {
    include: ["packages/*/src/**/*.test.ts", "apps/*/src/**/*.test.ts"],
    environment: "node",
    coverage: {
      provider: "v8",
      reporter: ["text", "json", "html"],
      include: ["packages/*/src/**/*.ts"],
      exclude: ["**/*.test.ts"],
      thresholds: {
        perFile: true,
        statements: 90,
        branches: 80,
        functions: 100,
        lines: 90
      }
    }
  }
});
