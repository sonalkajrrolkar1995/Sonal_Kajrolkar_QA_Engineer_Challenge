import { test, expect, chromium } from '@playwright/test';

test('TC1: Search job "Test" and filter Netherlands', async () => {
  test.setTimeout(180000);

  const webBrowserObject = await chromium.launch({
    headless: false,
    args: ['--start-maximized'],
  });

  const webBrowserContextObject = await webBrowserObject.newContext({ viewport: null });
  const webPageObject = await webBrowserContextObject.newPage();

  // Step 1: Open careers page
  await webPageObject.goto('https://careers.justeattakeaway.com/global/en/home');
  await webPageObject.waitForTimeout(5000);
  console.log('Opened careers page maximized');

  // Handle cookie banner
  const cookieAcceptButtonLocator = webPageObject.locator('#onetrust-accept-btn-handler');
  if (await cookieAcceptButtonLocator.isVisible()) {
    await cookieAcceptButtonLocator.click();
    console.log('Accepted cookie banner');
  }

  // Step 2: Enter Job Title "Test" and click Search
  const jobSearchInputBoxLocator = webPageObject.locator('#typehead');
  await jobSearchInputBoxLocator.fill('Test');
  await webPageObject.waitForTimeout(5000);
  console.log('Typed keyword "Test"');

  const globalSearchButtonLocator = webPageObject.locator('[data-ph-at-id="globalsearch-button"]');
  await globalSearchButtonLocator.click();
  await webPageObject.waitForTimeout(5000);
  console.log('Clicked Search button');

  // Step 3: Show total jobs count BEFORE filter
  const totalJobsCountBeforeFilterText = await webPageObject
    .locator('[data-ph-at-id="search-page-top-job-count"]')
    .textContent();
  console.log(`Total jobs before filter: ${totalJobsCountBeforeFilterText}`);

  const jobLocationTextLocator = webPageObject.locator('[data-ph-at-id="job-location"]');

  await jobLocationTextLocator.first().scrollIntoViewIfNeeded();
  await expect(jobLocationTextLocator.first()).toBeVisible({ timeout: 15000 });
  await webPageObject.waitForTimeout(5000);

  const jobLocationTextsBeforeFilterArray = await jobLocationTextLocator.allTextContents();
  console.log('Jobs before filter:', jobLocationTextsBeforeFilterArray);

  const uniqueJobLocationPlacesSet = new Set(jobLocationTextsBeforeFilterArray.map(textValue => textValue.toLowerCase()));
  expect(uniqueJobLocationPlacesSet.size).toBeGreaterThan(1);
  console.log('Jobs are from multiple locations');

  // Step 4: Refine search by Country "Netherlands"
  const countryFilterAccordionLocator = webPageObject.locator('#CountryAccordion');
  await countryFilterAccordionLocator.click();
  await webPageObject.waitForTimeout(5000);
  console.log('Opened Country filter');

  const netherlandsCountryLabelLocator = webPageObject.locator('label[for^="country_phs_Netherlands"]');
  await netherlandsCountryLabelLocator.click();
  await webPageObject.waitForTimeout(5000);
  console.log('Clicked Netherlands label');

  // Step 5: Verify now the search results location is Netherlands only
  await expect
    .poll(async () => {
      const jobLocationTextsAfterFilterArray = await jobLocationTextLocator.allTextContents();
      const allJobsAreNetherlands = jobLocationTextsAfterFilterArray.length > 0 &&
        jobLocationTextsAfterFilterArray.every(textValue => textValue.toLowerCase().includes('netherlands'));
      return { allJobsAreNetherlands };
    }, { timeout: 20000 })
    .toMatchObject({ allJobsAreNetherlands: true });

  await webPageObject.waitForTimeout(5000);

  const jobLocationTextsAfterFilterArray = await jobLocationTextLocator.allTextContents();
  console.log('Jobs after filter:', jobLocationTextsAfterFilterArray);

  const allJobsAreNetherlandsBoolean = jobLocationTextsAfterFilterArray.every(textValue =>
    textValue.toLowerCase().includes('netherlands')
  );
  expect(allJobsAreNetherlandsBoolean).toBe(true);
  console.log('All jobs are from Netherlands only');

  // Step 6: Show total jobs count after filter
  const totalJobsCountAfterFilterText = await webPageObject
    .locator('[data-ph-at-id="search-page-top-job-count"]')
    .textContent();
  console.log(`Total jobs after filter: ${totalJobsCountAfterFilterText}`);

  await webPageObject.waitForTimeout(10000);

  await webBrowserObject.close();
});