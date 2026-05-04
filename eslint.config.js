import js from "@eslint/js";
import tseslint from "typescript-eslint";

export default tseslint.config(
  {
    ignores: ["**/dist/**", "**/coverage/**", "node_modules/**"]
  },
  js.configs.recommended,
  ...tseslint.configs.recommended,
  {
    files: ["apps/*/src/**/*.{ts,tsx}", "apps/marketing/src/**/*.{ts.tsx}"],
    languageOptions: {
      globals: {
        document: "readonly",
        HTMLElement: "readonly",
        console: "readonly",
        fetch: "readonly",
        window: "readonly"
      }
    }
  },
  {
    files: ["apps/server/src/**/*.ts", "packages/*/src/**/*.ts", "**/*.config.{ts,js}"],
    languageOptions: {
      globals: {
        console: "readonly",
        process: "readonly"
      }
    }
  }
);
