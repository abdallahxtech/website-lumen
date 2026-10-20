import { defineConfig, devices } from "@playwright/test";

const env = { ADMIN_USER: "admin", ADMIN_PASSWORD: "e2e-password-123", NEXT_TELEMETRY_DISABLED: "1" };

export default defineConfig({
  testDir: "tests/e2e",
  timeout: 45_000,
  fullyParallel: false,
  workers: 1,
  reporter: [["list"], ["json", { outputFile: "test-results/e2e.json" }]],
  use: { trace: "off" },
  projects: [
    { name: "site", testMatch: /site\.spec\.ts/, use: { ...devices["Desktop Chrome"], baseURL: "http://localhost:3200" } },
    { name: "fixtures", testMatch: /fixtures\.spec\.ts/, use: { ...devices["Desktop Chrome"], baseURL: "http://localhost:3201" } },
  ],
  webServer: [
    { command: "npx next start -p 3200", url: "http://localhost:3200", reuseExistingServer: true, env: { ...env, LEADS_DB_PATH: "./test-results/e2e-leads.db" } },
    { command: "npx next start -p 3201", url: "http://localhost:3201", reuseExistingServer: true, env: { ...env, NEXT_DIST_DIR: ".next-fixtures", LUMEN_FIXTURES: "1", LEADS_DB_PATH: "./test-results/e2e-fixture-leads.db" } },
  ],
});
