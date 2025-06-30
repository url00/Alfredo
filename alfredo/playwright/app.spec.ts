import { test, expect } from '@playwright/test';

test('has title', async ({ page }) => {
  await page.goto('/');

  // Expect a title "to contain" a substring.
  await expect(page).toHaveTitle(/Alfredo/);
});

test('has welcome message', async ({ page }) => {
  await page.goto('/');

  // Expects page to have a heading with the name of the app.
  await expect(page.getByRole('heading', { name: 'Welcome to Alfredo!' })).toBeVisible();
});

test('should download the database state', async ({ page }) => {
  await page.goto('/');

  // Wait for the database to be initialized
  await page.waitForFunction(() => (window as any).dbReady);

  // Complete the setup wizard
  await page.getByLabel('Name').fill('Test User');
  await page.getByLabel('Email').fill('test@example.com');
  await page.getByRole('button', { name: 'Next' }).click();
  await page.getByLabel('API Key').fill('test-key');
  await page.getByRole('button', { name: 'Next' }).click();
  await page.getByRole('button', { name: 'Complete Setup' }).click();

  // Wait for navigation to complete
  await page.waitForURL('**/');

  // Start waiting for the download
  const downloadPromise = page.waitForEvent('download');

  // Click the download button
  await page.getByRole('button', { name: 'Download State' }).click();

  // Wait for the download to complete
  const download = await downloadPromise;

  // Check the file name
  expect(download.suggestedFilename()).toBe('alfredo.db');

  // Check that the file is not empty
  const path = await download.path();
  expect(path).not.toBeNull();
});

test('should load existing data from a database file', async ({ page }) => {
  await page.goto('/');

  // Wait for the database to be initialized
  await page.waitForFunction(() => (window as any).dbReady);

  // Start waiting for the file chooser
  const fileChooserPromise = page.waitForEvent('filechooser');

  // Click the button to open the file chooser
  await page.getByRole('button', { name: 'Start from Existing Data' }).click();

  // Wait for the file chooser to appear
  const fileChooser = await fileChooserPromise;

  // Set the input file
  await fileChooser.setFiles('playwright/test.db');

  // Wait for navigation to the status page
  await page.waitForURL('**/');

  // Go to the settings page
  await page.getByRole('button', { name: 'Settings' }).click();

  // Check the values
  await expect(page.getByLabel('Name')).toHaveValue('Test User');
  await expect(page.getByLabel('Email')).toHaveValue('test@test.com');
  await expect(page.getByLabel('API Key')).toHaveValue('test');
});

test('should display an AI-generated welcome message', async ({ page }) => {
  await page.goto('/');

  // Wait for the database to be initialized
  await page.waitForFunction(() => (window as any).dbReady);

  // Complete the setup wizard
  await page.getByLabel('Name').fill('Test User');
  await page.getByLabel('Email').fill('test@example.com');
  await page.getByRole('button', { name: 'Next' }).click();
  await page.getByLabel('API Key').fill('test-key');
  await page.getByRole('button', { name: 'Next' }).click();
  await page.getByRole('button', { name: 'Complete Setup' }).click();

  // Wait for navigation to complete
  await page.waitForURL('**/');

  // Check that the welcome message is visible and not the default
  const welcomeMessage = page.getByRole('heading');
  await expect(welcomeMessage).toBeVisible();
  await expect(welcomeMessage).not.toHaveText('Welcome!');
});

test.beforeEach(async ({ page }) => {
  await page.route('**/v1beta/models/gemini-2.5-flash:generateContent**', async route => {
    const json = {
      candidates: [{
        content: {
          parts: [{
            text: 'Hello, Test User!'
          }]
        }
      }]
    };
    await route.fulfill({ json });
  });
});
