import { test, expect } from '@playwright/test';
import * as dotenv from 'dotenv';
import * as path from 'path';

dotenv.config({ path: path.resolve(__dirname, '..', '.env') });

test('should return 4 from AI prompt', async ({ page }) => {
  await page.goto('/');

  // Wait for the database to be initialized
  await page.waitForFunction(() => (window as any).dbReady);

  await page.waitForURL('/Alfredo/setup');

  // Complete the setup wizard
  await page.getByLabel('Name').fill('Test User');
  await page.getByLabel('Email').fill('test@example.com');
  await page.getByRole('button', { name: 'Next' }).click();
  await page.getByLabel('API Key').fill(process.env['GEMINI_API_KEY']!);
  await page.getByRole('button', { name: 'Next' }).click();
  await page.getByRole('button', { name: 'Complete Setup' }).click();

  // Wait for navigation and then navigate to the new ai-test page
  await page.waitForURL('/Alfredo/');
  // todo figure out why it takes at least a couple of seconds for data to "save" to the store
  await page.waitForTimeout(3000);
  await page.goto('/Alfredo/ai-test');

  // Click the button to run the AI prompt
  await page.locator('#run-ai-prompt').click();

  // Wait for the result and assert its value
  const resultLocator = page.locator('#ai-result');
  await expect(resultLocator).toHaveText('4', { timeout: 15000 });
});
