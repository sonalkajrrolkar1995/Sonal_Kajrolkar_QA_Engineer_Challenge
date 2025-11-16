import { test, expect, chromium } from '@playwright/test';

test('TC03: Engineer and UK filter with footer links', async () => {
  test.setTimeout(180000);

  const browserWindow = await chromium.launch({
    headless: false,
    args: ['--start-maximized'],
  });
  const browserContext = await browserWindow.newContext({ viewport: null });
  const mainPage = await browserContext.newPage();

  const waitLittleBit = async (ms = 4000) => { await mainPage.waitForTimeout(ms); };

  // STEP 1: Open careers page
  await Promise.all([
    mainPage.waitForLoadState('domcontentloaded'),
    mainPage.goto('https://careers.justeattakeaway.com/global/en/home')
  ]);
  console.log('Opened careers page maximized');

  // STEP 2: Cookie banner
  const cookieAcceptButton = mainPage.locator('#onetrust-accept-btn-handler');
  await waitLittleBit(); // short pause so banner can render
  await cookieAcceptButton.waitFor({ state: 'visible', timeout: 10000 }).catch(() => {});
  if (await cookieAcceptButton.isVisible()) {
    await cookieAcceptButton.scrollIntoViewIfNeeded().catch(() => {});
    await cookieAcceptButton.click({ force: true });
    console.log('Accepted cookie banner');
  } else {
    console.log('Cookie banner is not visible or already accepted');
  }

  // STEP 3: Search for Engineer
  const jobSearchInputBox = mainPage.locator('#typehead');
  await expect(jobSearchInputBox).toBeVisible({ timeout: 20000 });
  await jobSearchInputBox.fill('Engineer');
  console.log('Typed keyword "Engineer"');

  const jobSearchGoButton = mainPage.locator('[data-ph-at-id="globalsearch-button"]');
  await jobSearchGoButton.click();
  console.log('Clicked Search button');
  await mainPage.waitForLoadState('networkidle', { timeout: 15000 }).catch(() => {});

  // STEP 4: Results info
  const jobsFoundTextCounter = mainPage.locator('[data-ph-at-id="search-page-top-job-count"]');
  await expect(jobsFoundTextCounter).toBeVisible({ timeout: 20000 });
  const totalJobsFound = await jobsFoundTextCounter.textContent();
  console.log(`Total jobs found: ${totalJobsFound}`);

  // STEP 5: Apply Country filter United Kingdom
  const countryFilterToggleButton = mainPage.locator('#CountryAccordion');
  await countryFilterToggleButton.click();
  console.log('Opened Country filter');

  const unitedKingdomFilterOption = mainPage.locator('label[for^="country_phs_United\\ Kingdom"]');
  await unitedKingdomFilterOption.click();
  console.log('Selected United Kingdom filter');
  await mainPage.waitForLoadState('networkidle', { timeout: 15000 }).catch(() => {});

  // STEP 6: Verify jobs are United Kingdom only
  const jobLocationLabels = mainPage.locator('[data-ph-at-id="job-location"]');
  const jobLocationTexts = await jobLocationLabels.allTextContents();

  if (jobLocationTexts.length === 0) {
    console.log('No job locations found after filter site may have changed.');
  } else {
    const normalizedLocations = jobLocationTexts.map(loc => loc.toLowerCase());
    const allJobsInUK = normalizedLocations.every(loc =>
      loc.includes('united kingdom') ||
      loc.includes('uk') ||
      loc.includes('england') ||
      loc.includes('gb') ||
      loc.includes('london')
    );

    if (allJobsInUK) {
      console.log('All jobs are from UK Location only');
    } else {
      console.log('job locations are not from UK Location', jobLocationTexts);
    }
  }

  // STEP 7: Clear Filters
  const clearAllFiltersButton = mainPage.locator('[data-ph-at-id="clear-all-facet-tags-link"]');
  if (await clearAllFiltersButton.isVisible()) {
    await clearAllFiltersButton.click();
    console.log('Cleared filters');
    await mainPage.waitForLoadState('networkidle', { timeout: 15000 }).catch(() => {});
    const resetJobLocations = await jobLocationLabels.allTextContents();
    const multipleLocationsSet = new Set(resetJobLocations.map(l => l.toLowerCase()));
    if (multipleLocationsSet.size > 1) {
      console.log('Jobs reset to multiple locations');
    } else {
      console.log('Could not confirm if the reset worked');
    }
  }

  // STEP 8: Footer links
  await mainPage.locator('footer').scrollIntoViewIfNeeded();
  await waitLittleBit();

  const footerLinkSelectorsList = [
    'a[aria-label="Privacy Statement"][target="_blank"]',
    'a[aria-label="linkedIn"]',
    'a[aria-label="twitter"]',
    'a[aria-label="instagram"]',
    'a[aria-label="youtube"]',
    'a[aria-label="Career Site Cookie Settings"]',
    'a[aria-label="Personal Information"]'
  ];

  for (const footerSelector of footerLinkSelectorsList) {
    const footerLinkLocator = mainPage.locator(footerSelector).first();
    if (await footerLinkLocator.isVisible()) {
      const footerLinkName = (await footerLinkLocator.getAttribute('aria-label')) || 'unknown';
      const footerLinkHref = await footerLinkLocator.getAttribute('href');

      if (!footerLinkHref || !/^https?:\/\//i.test(footerLinkHref)) {
        console.log(`Skip footer link: ${footerLinkName} → invalid href "${footerLinkHref}"`);
        continue;
      }
      console.log(`Footer link: ${footerLinkName} → ${footerLinkHref}`);

      const newTabPage = await browserContext.newPage();
      try {
        await newTabPage.goto(footerLinkHref, { waitUntil: 'domcontentloaded' });
        await newTabPage.waitForLoadState('load', { timeout: 15000 }).catch(() => {});
        console.log(`Opened in new tab: ${await newTabPage.url()}`);
      } catch (e) {
        console.log(`Failed to open in new tab: ${footerLinkHref}`);
      } finally {
        await newTabPage.close();
      }
    } else {
      console.log(`Footer link not found for selector: ${footerSelector}`);
    }
  }

  // STEP 9: Pagination
  try {
    const nextPageButton = mainPage.locator('[data-ph-at-id="pagination-next-link"]');
    if (await nextPageButton.isVisible()) {
      await nextPageButton.click();
      console.log('Clicked Next page');
      await mainPage.waitForLoadState('networkidle', { timeout: 10000 }).catch(() => {});
    } else {
      console.log('Next page not available');
    }
  } catch {
    console.log('Pagination Next failed');
  }

  try {
    const previousPageButton = mainPage.locator('[data-ph-at-id="pagination-previous-link"]');
    if (await previousPageButton.isVisible()) {
      await previousPageButton.click();
      console.log('Clicked Previous page');
      await mainPage.waitForLoadState('networkidle', { timeout: 10000 }).catch(() => {});
    } else {
      console.log('Previous page not available');
    }
  } catch {
    console.log('Pagination Previous failed');
  }

  console.log('TC03: Engineer and UK filter with footer links completed');
  await browserWindow.close();
});