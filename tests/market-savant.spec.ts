import { test as base, expect } from '@playwright/test';
import fs from 'fs';

const url: string = "http://localhost:5173/market-savant/"

const test = base.extend({
  page: async ({ page }, use) => {
    // Load sessionStorage before test
    const sessionData = JSON.parse(fs.readFileSync('auth/sessionStorage.json', 'utf-8'));

    await page.goto('http://localhost:5173'); // Load the domain first
    await page.evaluate((data) => {
      for (const [key, value] of Object.entries(data)) {
        sessionStorage.setItem(key, value as string);
      }
    }, sessionData);

    await use(page);
  },
});

test("apply price", async ({ page }) => {
  await page.goto(url);
  await page.waitForSelector('[data-test-id="AvatarDropdown"]');

  await page.locator('[data-test-id="priceRangeDrop"]').click()
  await page.locator('[data-test-id="priceRangeSelectMin"]').selectOption({value: "300000"})

  await page.locator('[data-test-id="priceRangeSelectMax"]').selectOption({value: "500000"})
  await page.locator('[data-test-id="priceRangeApplyButton"]').click()

  await page.waitForTimeout(5000)

})

test("apply HomeType", async ({ page }) => {
  await page.goto(url);
  await page.waitForSelector('[data-test-id="AvatarDropdown"]');

  await page.locator('[data-test-id="homeDrop"]').click()
  await page.locator('[data-test-id="homeTypeCheckBox0"]').click()

  await page.locator('[data-test-id="homeTypeApplyButton"]').click()
  
  await page.waitForTimeout(5000)
  
  await expect(page.locator('[data-test-id="title"]')).toContainText("Single Family")
})

test("select Beds And Bath",async({page})=>{
  await page.goto(url);
  await page.waitForSelector('[data-test-id="AvatarDropdown"]');

  await page.locator('[data-test-id="BedBathDrop"]').click()
  await page.locator('[data-test-id="Bed2"]').click()
  await page.locator('[data-test-id="Bath4"]').click()
  await page.locator('[data-test-id="BedBathApplyButton"]').click()
  
  await page.waitForTimeout(5000)

  await expect(page.locator('[data-test-id="BedBathDrop"]')).toContainText("2+ Bed/4+ Bath")
  await page.waitForTimeout(5000)
})

test("Search input",async({page})=>{
  await page.goto(url);
  await page.waitForSelector('[data-test-id="AvatarDropdown"]');

  await page.waitForTimeout(5000)

  await page.locator('[data-test-id="searchInput"]').fill("mia")
  await page.waitForTimeout(10000)
  await page.getByRole('list').filter({ hasText: 'cityMiami LakesNorth Miami' }).locator('[data-test-id="West Miami"]').click();

  await page.waitForTimeout(5000)

  await expect(page.locator(`[data-test-id="subTitle"]`)).toContainText("West Miami")
})

test("apply Live Area", async ({ page }) => {
  await page.goto(url);
  await page.waitForSelector('[data-test-id="AvatarDropdown"]');

  await page.locator('[data-test-id="liveAreaDrop"]').click()
  await page.locator('[data-test-id="liveAreaOptionMin"]').selectOption({value: "1000"})

  await page.locator('[data-test-id="liveAreaOptionMax"]').selectOption({value: "1250"})
  await page.locator('[data-test-id="liveAreaApplyButton"]').click()

  await page.waitForTimeout(5000)

})

test("apply Lot Area", async ({ page }) => {
  await page.goto(url);
  await page.waitForSelector('[data-test-id="LotAreaDropdown"]');

  await page.locator('[data-test-id="LotAreaDropdown"]').click()
  await page.locator('[data-test-id="LotAreaSelectMin"]').selectOption({value: "4000"})

  await page.locator('[data-test-id="LotAreaSelectMax"]').selectOption({value: "5000"})
  await page.locator('[data-test-id="lotAreaApplyButton"]').click()

  await page.waitForTimeout(5000)

})

test('Check Logout', async({page})=>{
  const currentUrl = page.url();
  expect(currentUrl).toContain('/market-savant/');

  await page.waitForSelector('[data-test-id="AvatarDropdown"]');
  await page.locator('[data-test-id="AvatarDropdown"]').click();

  await page.locator('[data-test-id="AvatarOption1"]').click();

  await page.waitForURL('http://localhost:5173/market-savant/login');

  expect(page.url()).toContain('/login');
})