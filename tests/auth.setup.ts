import { test as setup, expect } from '@playwright/test';
import fs from 'fs';
import { password, username } from '../playwright.config';

const authFile = 'auth/user.json';

setup("authenticate", async ({ page }) => {
  await page.goto('/market-savant/login');

  await page.getByPlaceholder('Enter your e-mail address').fill(username);
  await page.getByPlaceholder('Enter your password').fill(password);

  await page.locator('[type="submit"]').click();

  await page.waitForURL('/market-savant');
  await expect(page.locator(`[data-slot="input"]`)).toBeVisible();

  const sessionStorageData = await page.evaluate(() => {
    const data: Record<string, string> = {};
    for (let i = 0; i < sessionStorage.length; i++) {
      const key = sessionStorage.key(i);
      if (key) data[key] = sessionStorage.getItem(key)!;
    }
    return data;
  });

  fs.writeFileSync('auth/sessionStorage.json', JSON.stringify(sessionStorageData, null, 2));

  await page.context().storageState({ path: authFile });
});
