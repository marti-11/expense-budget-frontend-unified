const { defineConfig, devices } = require("@playwright/test");
const path = require("node:path");
const os = require("node:os");

module.exports = defineConfig({
  testDir: "./tests/e2e",
  fullyParallel: true,
  workers: process.env.CI ? 2 : 1,
  outputDir: process.env.CI
    ? "test-results"
    : path.join(os.tmpdir(), "fizcal-playwright-results"),
  retries: process.env.CI ? 2 : 0,
  reporter: process.env.CI ? [["html", { open: "never" }], ["list"]] : "list",
  use: {
    baseURL: "http://127.0.0.1:4173",
    trace: "on-first-retry",
    screenshot: "only-on-failure"
  },
  projects: [
    { name: "desktop", use: { ...devices["Desktop Chrome"] } },
    { name: "mobile", use: { ...devices["Pixel 7"] } }
  ],
  webServer: {
    command: "npm run serve",
    url: "http://127.0.0.1:4173/login.html",
    reuseExistingServer: !process.env.CI
  }
});
