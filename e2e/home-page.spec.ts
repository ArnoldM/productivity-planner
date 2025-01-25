import { test, expect } from '@playwright/test';

test('has "Productivity Planner" header title', async ({ page }) => {
  await page.goto('');
  await expect(page.locator('app-header')).toContainText(
    'Productivity Planner',
  );
});
