import { test, expect } from '@playwright/test';
import * as dotenv from 'dotenv';
import * as path from 'path';

dotenv.config({ path: path.resolve(__dirname, '..', '.env') });

test.beforeEach(async ({ page }) => {
  await page.goto('/');

  // Wait for the database to be initialized
  await page.waitForFunction(() => (window as any).dbReady);

  // Complete the setup wizard
  await page.getByLabel('Name').fill('Test User');
  await page.getByLabel('Email').fill('test@example.com');
  await page.getByRole('button', { name: 'Next' }).click();
  await page.getByLabel('API Key').fill(process.env['GEMINI_API_KEY']!);
  await page.getByRole('button', { name: 'Next' }).click();
  await page.getByRole('button', { name: 'Complete Setup' }).click();

  // Wait for navigation to complete
  await page.waitForURL('**/');
});

test('should return 4 from AI prompt', async ({ page }) => {
  await page.goto(
    '/ai-test?prompt=Without%20adding%20any%20additional%20text%2C%20please%20return%20the%20result%20of%20the%20expression%202%2B2'
  );
  await expect(page.locator('body')).toHaveText('4');
});
