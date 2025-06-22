import { test, expect } from '@playwright/test';

test.describe('Database Service', () => {
  test('should initialize the database and allow writing and reading data', async ({ page }) => {
    await page.goto('/');

    // Wait for the database to be initialized
    await page.waitForFunction(() => (window as any).dbInitialized);

    // Complete the setup wizard
    await page.getByLabel('Name').fill('Test User');
    await page.getByLabel('Email').fill('test@example.com');
    await page.getByRole('button', { name: 'Next' }).click();
    await page.getByLabel('API Key').fill('test-key');
    await page.getByRole('button', { name: 'Next' }).click();
    await page.getByRole('button', { name: 'Complete Setup' }).click();

    // Wait for navigation to complete
    await page.waitForURL('**/');

    // Go to the settings page to trigger a write
    await page.getByRole('button', { name: 'Settings' }).click();

    // Fill out the form to save some data
    await page.getByLabel('Name').fill('Test User Updated');
    await page.getByLabel('Email').fill('test-updated@example.com');
    await page.getByRole('button', { name: 'Save' }).click();

    // Use evaluate to interact with the DatabaseService
    const userName = await page.evaluate(async () => {
      const configService = (window as any).ng.get((window as any).ng.ConfigService);
      return await configService.get('user_name');
    });

    expect(userName).toBe('Test User Updated');
  });
});
