import { test, expect, chromium } from '@playwright/test';

test('TC2: Select Sales, filter Germany, verify counts and categories', async () => {
  test.setTimeout(180000);

  const webBrowserObject = await chromium.launch({
    headless: false,
    args: ['--start-maximized'],
  });
  const webBrowserContextObject = await webBrowserObject.newContext({ viewport: null });
  const webPageObject = await webBrowserContextObject.newPage();

  // pause 
  const pauseForMilliseconds = async (millisecondsValue = 5000) => {
    await webPageObject.waitForTimeout(millisecondsValue);
  };

  // All locators
  const locatorObjects = {
    jobSearchInputBoxLocator: '#typehead',
    salesCategoryButtonLocator: '[data-ph-at-data-text="Sales"]',
    salesCategoryCheckboxLocator: '#category_phs_0',
    topJobsCounterLocator: '[data-ph-at-id="search-page-top-job-count"]',
    countryFilterAccordionLocator: '#CountryAccordion',
    germanyCountryCheckboxLocator: 'input[type="checkbox"][data-ph-at-text="Germany"]',
    jobInfoParagraphLocator: '[data-ph-at-id="jobs-list"] p[data-ph-at-id="job-info"]',
    cookieAcceptButtonLocator: '#onetrust-accept-btn-handler',
    refineSearchSectionLocator: 'ppc-content:has-text("Refine your search")', // scroll target
  };

  // Step 1: Open careers page
  await webPageObject.goto('https://careers.justeattakeaway.com/global/en/home');
  await pauseForMilliseconds();
  console.log('Opened careers page maximized');

  // Handle cookie banner
  const cookieButton = webPageObject.locator(locatorObjects.cookieAcceptButtonLocator);
  await cookieButton.scrollIntoViewIfNeeded();
  if (await cookieButton.isVisible()) {
    await cookieButton.click();
    console.log('Accepted cookie banner');
  }

  // Step 2: Click on Search input
  const searchInput = webPageObject.locator(locatorObjects.jobSearchInputBoxLocator);
  await searchInput.scrollIntoViewIfNeeded();
  await expect(searchInput).toBeVisible({ timeout: 20000 });
  await searchInput.click();
  await pauseForMilliseconds();
  console.log('Clicked on Search for Job Title');

  // Step 3: Select Sales category
  const salesButton = webPageObject.locator(locatorObjects.salesCategoryButtonLocator);
  await salesButton.scrollIntoViewIfNeeded();
  await expect(salesButton).toBeVisible({ timeout: 20000 });
  await salesButton.click();
  await pauseForMilliseconds();
  console.log('Selected Sales category');

  // Step 4: Scroll to “Refine your search” section
  const refineSection = webPageObject.locator(locatorObjects.refineSearchSectionLocator);
  await refineSection.scrollIntoViewIfNeeded();
  await expect(refineSection).toBeVisible({ timeout: 20000 });
  await pauseForMilliseconds();
  console.log('Scrolled to Refine your search section');

  // Step 5: Verify Sales checkbox is selected
  const salesCheckbox = webPageObject.locator(locatorObjects.salesCategoryCheckboxLocator);
  await salesCheckbox.scrollIntoViewIfNeeded();
  await expect(salesCheckbox).toBeChecked({ timeout: 20000 });
  console.log('Sales checkbox is selected');

  // Step 6: Get expected job count from Sales checkbox
  await salesCheckbox.scrollIntoViewIfNeeded();
  const salesCountAttributeText = await salesCheckbox.getAttribute('data-ph-at-count');
  const expectedSalesJobCountInteger = parseInt(salesCountAttributeText || '0');
  console.log(`Expected Sales job count from checkbox: ${expectedSalesJobCountInteger}`);

  // Step 7: Get actual job count from top counter
  const topCounter = webPageObject.locator(locatorObjects.topJobsCounterLocator);
  await topCounter.scrollIntoViewIfNeeded();
  const topCounterAttributeText = await topCounter.getAttribute('data-ph-at-count');
  const actualSalesJobCountInteger = parseInt(topCounterAttributeText || '0');
  console.log(`Actual job count from top counter: ${actualSalesJobCountInteger}`);

  // Step 8: Compare Sales counts
  expect(actualSalesJobCountInteger).toBe(expectedSalesJobCountInteger);
  console.log('Sales job count matches between checkbox and top counter');

  // Step 9: Click Country accordion
  const countryAccordion = webPageObject.locator(locatorObjects.countryFilterAccordionLocator);
  await countryAccordion.scrollIntoViewIfNeeded();
  await countryAccordion.click();
  await pauseForMilliseconds();
  console.log('Opened Country filter panel');

  // Step 10: Select Germany checkbox
  const germanyCheckbox = webPageObject.locator(locatorObjects.germanyCountryCheckboxLocator);
  await germanyCheckbox.scrollIntoViewIfNeeded();
  await expect(germanyCheckbox).toBeVisible({ timeout: 20000 });
  await germanyCheckbox.check({ force: true });
  await pauseForMilliseconds();
  console.log('Selected Germany checkbox');

  // Step 11: Get expected job count from Germany checkbox
  await germanyCheckbox.scrollIntoViewIfNeeded();
  const germanyCountAttributeText = await germanyCheckbox.getAttribute('data-ph-at-count');
  const expectedGermanyJobCountInteger = parseInt(germanyCountAttributeText || '0');
  console.log(`Expected Germany job count from checkbox: ${expectedGermanyJobCountInteger}`);

  // Step 12: Wait for job count to update after Germany filter
  let actualGermanyJobCountInteger = actualSalesJobCountInteger;
  for (let loopCounter = 0; loopCounter < 10; loopCounter++) {
    await webPageObject.waitForTimeout(500);
    await topCounter.scrollIntoViewIfNeeded();
    const updatedTopCounterAttributeText = await topCounter.getAttribute('data-ph-at-count');
    const parsedUpdatedJobCountInteger = parseInt(updatedTopCounterAttributeText || '0');
    if (parsedUpdatedJobCountInteger !== actualSalesJobCountInteger) {
      actualGermanyJobCountInteger = parsedUpdatedJobCountInteger;
      break;
    }
  }
  await topCounter.scrollIntoViewIfNeeded();
  console.log(`Actual job count after Germany filter: ${actualGermanyJobCountInteger}`);

  // Step 13: Compare Germany counts
  expect(actualGermanyJobCountInteger).toBe(expectedGermanyJobCountInteger);
  console.log('Germany job count matches between checkbox and top counter');

  // Step 14: Verify all job results are in Sales category
  const jobInfoParagraphLocatorObject = webPageObject.locator(locatorObjects.jobInfoParagraphLocator);
  await jobInfoParagraphLocatorObject.first().scrollIntoViewIfNeeded();
  const totalJobResultsCountInteger = await jobInfoParagraphLocatorObject.count();
  console.log(`Checking ${totalJobResultsCountInteger} job results for Sales category...`);

  for (let jobIndexNumber = 0; jobIndexNumber < totalJobResultsCountInteger; jobIndexNumber++) {
    const jobParagraph = jobInfoParagraphLocatorObject.nth(jobIndexNumber);
    await jobParagraph.scrollIntoViewIfNeeded();
    const singleJobInfoTextValue = await jobParagraph.innerText();
    if (!/sales/i.test(singleJobInfoTextValue)) {
      throw new Error(`Job ${jobIndexNumber + 1} is not in Sales category: "${singleJobInfoTextValue}"`);
    }
  }
  console.log('All job results are in Sales category');

  await pauseForMilliseconds(8000);
  await webBrowserObject.close();
});