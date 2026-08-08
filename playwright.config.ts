import { defineConfig } from '@playwright/test';
import { API_CONFIG } from '@environment/environment.config';

export default defineConfig({
  testDir: './tests',
  workers: 1,
  timeout: 30000,
  fullyParallel: false,

  reporter: [
    ['list'],
    ['html', { outputFolder: 'playwright-report', open: 'never' }],
    [
      'allure-playwright',
      {
        resultsDir: 'allure-results',
        detail: true,
        suiteTitle: false,
      },
    ],
  ],

  use: {
    baseURL: API_CONFIG.baseURL,
    trace: 'on',
    extraHTTPHeaders: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
    },
  },
});