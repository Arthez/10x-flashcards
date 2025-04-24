import { defineConfig, devices } from "@playwright/test";

// This config is for manually running E2E tests when you already have the server running
// Usage: First start the dev server with `npm run dev`, then run `npm run test:e2e:manual`
export default defineConfig({
  testDir: "./e2e",
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: [["html"], ["list"]],

  // Only use Chromium/Desktop Chrome as specified in the rules
  projects: [
    {
      name: "chromium",
      use: { ...devices["Desktop Chrome"] },
    },
  ],

  use: {
    // Base URL to use in actions like `await page.goto('/')`
    baseURL: "http://localhost:3000",

    // Traces for debugging test failures
    trace: "on-first-retry",

    // Take screenshots on test failures
    screenshot: "only-on-failure",
  },

  // No webServer configuration - assumes server is already running
});
