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
