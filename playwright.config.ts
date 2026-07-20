import { defineConfig } from "@playwright/test";

export default defineConfig({
  testDir: "./tests",
  reporter: [['html', { outputFolder: 'playwright-report', open: 'never' }]],
  workers: 1,
  timeout: 30000,
  fullyParallel: false
});  