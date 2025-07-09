import { defineConfig, devices } from '@playwright/test';
import * as dotenv from 'dotenv';

dotenv.config();

const projects = [
  {
    name: 'chromium',
    use: { ...devices['Desktop Chrome'], baseURL: 'http://localhost:4200' },
    testIgnore: /.*\.ai\.spec\.ts/,
  },
  {
    name: 'firefox',
    use: { ...devices['Desktop Firefox'], baseURL: 'http://localhost:4200' },
    testIgnore: /.*\.ai\.spec\.ts/,
  },
  {
    name: 'webkit',
    use: { ...devices['Desktop Safari'], baseURL: 'http://localhost:4200' },
    testIgnore: /.*\.ai\.spec\.ts/,
  },
  {
    name: 'ai',
    use: { ...devices['Desktop Chrome'], baseURL: 'http://localhost:4200/Alfredo/' },
    testMatch: /.*\.ai\.spec\.ts/,
  },
];

/**
 * See https://playwright.dev/docs/test-configuration.
 */
export default defineConfig({
  testDir: './playwright',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: undefined,
  use: {
    trace: 'on-first-retry',
  },
  webServer: {
    command: 'npm run start',
    url: 'http://localhost:4200',
    reuseExistingServer: !process.env.CI,
  },
  projects: process.env.AI_TESTS === 'true'
    ? projects.filter(p => p.name === 'ai')
    : projects.filter(p => p.name !== 'ai'),
});
