import { test as base, expect } from '@playwright/test';
import fs from 'fs';

const test = base.extend({
  page: async ({ page }, use) => {
    // Load sessionStorage before test
    const sessionData = JSON.parse(fs.readFileSync('auth/sessionStorage.json', 'utf-8'));

    await page.goto('/'); // Load the domain first
    await page.evaluate((data) => {
      for (const [key, value] of Object.entries(data)) {
        sessionStorage.setItem(key, value as string);
      }
    }, sessionData);

    await use(page);
  },
});

test("apply price", async ({ page }) => {
  await page.goto("/market-savant/");
  await page.waitForSelector('[data-test-id="AvatarDropdown"]');

  await page.locator('[data-test-id="priceRangeDrop"]').click()
  await page.locator('[data-test-id="priceRangeSelectMin"]').selectOption({value: "300000"})

  await page.locator('[data-test-id="priceRangeSelectMax"]').selectOption({value: "500000"})
  await page.locator('[data-test-id="priceRangeApplyButton"]').click()

  await page.waitForTimeout(5000)

})

test("apply HomeType", async ({ page }) => {
  await page.goto("/market-savant/");
  await page.waitForSelector('[data-test-id="AvatarDropdown"]');

  await page.locator('[data-test-id="homeDrop"]').click()
  await page.locator('[data-test-id="homeTypeCheckBox0"]').click()

  await page.locator('[data-test-id="homeTypeApplyButton"]').click()

  await page.waitForResponse('**/market-dashboard/market-report/summary')
  
  await expect(page.locator('[data-test-id="title"]')).toContainText("All Home")
})

test("select Beds And Bath",async({page})=>{
  await page.goto("/market-savant/");
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
  await page.goto("/market-savant/");

  // Wait for user avatar (sign-in indicator)
  await page.waitForSelector('[data-test-id="AvatarDropdown"]');

  await page.waitForTimeout(5000)

  // Type incrementally into the search input
  const searchInput = page.locator('[data-test-id="searchInput"]');
  await searchInput.fill("m");
  await page.waitForTimeout(2000)
  await searchInput.fill("mi");
  await page.waitForTimeout(2000)
  await searchInput.fill("mia");

  // Wait for city list to show "North Miam
  const cityOption = page.getByRole('list').filter({ hasText: 'CityNorth MiamiMiami' }).locator('[data-test-id="North Miami"]');
  // Click on "North Miami"
  await cityOption.click();

  // Wait for subtitle to update
  const subTitle = page.locator('[data-test-id="subTitle"]');
  await expect(subTitle).toContainText("North Miami"); 
})

test("apply Live Area", async ({ page }) => {
  await page.goto("/market-savant/");
  await page.waitForSelector('[data-test-id="AvatarDropdown"]');

  await page.locator('[data-test-id="liveAreaDrop"]').click()
  await page.locator('[data-test-id="liveAreaOptionMin"]').selectOption({value: "1000"})

  await page.locator('[data-test-id="liveAreaOptionMax"]').selectOption({value: "1250"})
  await page.locator('[data-test-id="liveAreaApplyButton"]').click()

  await page.waitForTimeout(5000)

})

test("apply Lot Area", async ({ page }) => {
  await page.goto("/market-savant/");
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

  await page.locator('[data-test-id="AvatarOption0"]').click();

  await page.waitForURL('http://localhost:5173/market-savant/login');

  expect(page.url()).toContain('/login');
})