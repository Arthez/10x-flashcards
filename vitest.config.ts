/// <reference types="vitest" />
import { defineConfig } from "vitest/config";
import react from "@astrojs/react";
import { fileURLToPath, URL } from "node:url";

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": fileURLToPath(new URL("./src", import.meta.url)),
    },
  },
  test: {
    globals: true,
    environment: "jsdom",
    setupFiles: ["./test/setup.ts"],
    include: ["test/unit/**/*.{test,spec}.{ts,tsx}"],
    exclude: ["node_modules", "dist", ".astro", "test/e2e"],
    coverage: {
      provider: "v8",
      reporter: ["text", "json", "html"],
      reportsDirectory: "./test/reports/coverage",
      exclude: ["**/node_modules/**", "**/test/e2e/**", "**/*.d.ts", "**/*.config.*"],
      thresholds: {
        statements: 0,
        branches: 0,
        functions: 0,
        lines: 0,
      },
    },
    outputFile: {
      html: "./test/reports/unit/html/index.html",
      json: "./test/reports/unit/json/report.json",
    },
  },
});
