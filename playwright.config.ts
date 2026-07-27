import { defineConfig } from "@playwright/test";

export default defineConfig({
  testDir: "./tests",
  reporter: [['html', { outputFolder: 'playwright-report', open: 'never' }]],
  workers: 1,
  timeout: 30000,
  fullyParallel: false,
  use: {
    baseURL: 'http://75.119.154.239/api/',
    trace: 'on',
    extraHTTPHeaders: {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    }
  }
});  