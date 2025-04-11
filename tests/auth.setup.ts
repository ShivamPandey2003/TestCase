import { test as setup, expect } from '@playwright/test';
import fs from 'fs';

const authFile = 'auth/user.json';
const url = "http://localhost:5173/market-savant/login";


setup("authenticate", async ({ page }) => {
  await page.goto(url);

  await page.getByPlaceholder('Enter your e-mail address').fill("shivam.pandey@knowledgeexcel.com");
  await page.getByPlaceholder('Enter your password').fill("Shivam@12345!");

  await page.locator('[type="submit"]').click();

  await page.waitForURL('http://localhost:5173/market-savant');
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
