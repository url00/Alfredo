import { test, expect } from '@playwright/test';

test('should return 4 from AI prompt', async ({ page }) => {
  await page.goto('http://localhost:4200/ai-test?prompt=Without%20adding%20any%20additional%20text%2C%20please%20return%20the%20result%20of%20the%20expression%202%2B2');
  await expect(page.locator('body')).toHaveText('4');
});
