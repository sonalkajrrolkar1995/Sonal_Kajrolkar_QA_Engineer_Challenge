QA Engineer Challenge – Manual & Automation
This README covers Part 1 (Manual test cases for Lieferando's new Restaurant filtering feature) and Part 2 (Automation test cases for Just Eat Takeaway Careers).

Part 1 – Manual Test Cases (Lieferando's new Restaurant filtering feature)

I created manual test cases for the new Restaurant filtering feature, focus was on high‑impact areas along with Regression testing for new Restaurant filtering feature:
- Apply multiple filters together - only matching restaurants shown, counts update, “No results” if nothing matches.
- Clear all filters - full list restores correctly, badges disappear, layout stable.
- Mobile filter panel - works smoothly.
- Filters persist after navigation, sorting works correctly.
- Special filters (Vegan, Vegetarian, Open Now, Promotions) - only valid restaurants shown.
- Accessibility - keyboard navigation works.
- Search with filters - single, all, or no matching restaurants handled correctly.
- Performance - infinite scroll loads correctly, page stays responsive.
- Error handling - invalid address shows proper error message, list does not load.

Please refer the link to excel file for detailed test cases.

Part 2 – Automation Test Cases (Just Eat Takeaway Careers)

This project tests the Just Eat Takeaway careers website.
I wrote three test cases in Playwright Using Javascript. They check search, filters, job counts, categories, footer links, and pagination. It Handles live website that changes often.

Requirements:
•	Node.js (LTS 18+)
•	Playwright Test (@playwright/test)

Setup:
•	Clone this repository.
•	Install dependencies:-

Open Command Prompt or Windows PowerShell and Type Below Commands:

npm install 

npx playwright install 

Run all tests (headed mode, browser visible):
C:\Users\sonal\OneDrive\Desktop\Sonal_Kajrolkar_QA_Engineer_Challenge>npx playwright test --headed 

Show report:
npx playwright show-report test-report 

Or use:
npm run report 

Run single test cases:-
First Change directory into the tests folder:
cd C:\Users\sonal\OneDrive\Desktop\Sonal_Kajrolkar_QA_Engineer_Challenge\tests 

Then run each test:
•	First test case (TC01 – Netherlands filter):
npx playwright test tc01_test_netherlands.spec.js --headed 

•	Second test case (TC02 – Sales + Germany filter):
npx playwright test tc02_sales_germany.spec.js --headed 

•	Third test case (TC03 – Engineer and UK filter):
npx playwright test tc03_engineer_uk.spec.js --headed 

Debug mode:
npx playwright test tests/tc01_test_netherlands.spec.js --debug 

Folder Structure:-

•	tests/ – Test case files (TC01, TC02, TC03)
•	test-results/ – Evidence from last run
•	test-report/ – HTML report (generated after tests)
•	playwright.config – Settings (timeouts, retries, evidence, reporter, Berlin geolocation)
•	package.json – Scripts and dependencies
•	README.md

Test Cases description:
-
TC01 – Search “Test” + Netherlands filter
•	Open careers homepage
•	Accept location permission
•	Accept cookies if shown
•	Search for “Test”
•	Verify jobs come from multiple locations
•	Apply Netherlands filter
•	Verify all jobs are Netherlands only

TC02 – Sales + Germany filter
•	Open careers homepage
•	Accept location permission
•	Select “Sales” category
•	Verify Sales checkbox and the search results number is matching 
•	Apply Germany filter
•	Verify Germany checkbox count equals the search results number is matching
•	Confirm all jobs are Sales

TC03 – Engineer + UK filter (full flow)
•	Open careers homepage
•	Accept location permission
•	Search for “Engineer”
•	Apply UK filter - all jobs show UK
•	Clear filters - jobs reset to multiple countries
•	Scroll to footer - check Privacy, LinkedIn, Twitter, Instagram, YouTube, Cookie Settings, Personal Information and force each footer link to open in a new tab
•	Test pagination

Challenges & Learnings:-

Common Issues:

•	Cookie banner blocked clicks: I accepted cookies first.
•	Geolocation permission access: Permission granted in config file.
•	Page slow to refresh: I waited until counters and job list were ready.
•	Filters hidden: I opened accordion and scrolled before clicking.
•	Counts mismatch: I compared checkbox and top counter until they matched.
•	Console Logs: I printed counts and sample jobs for logging.

TC01 – Search “Test” + Netherlands filter:
•	Jobs came from many places before filter.
•	After Netherlands filter, all jobs showed “Netherlands”.

TC02 – Sales + Germany filter:
•	Compared Sales checkbox count with top counter.
•	Applied Germany filter when first click failed.
•	Verified all jobs contained “Sales”.

TC03 – Engineer + UK filter:
•	Waited for search box before typing “Engineer”.
•	Checked top counter > 0.
•	Verified all jobs showed “United Kingdom”.
•	Cleared filters only if visible.
•	Pagination handled.

Author
Sonal Kajrolkar
QA Engineer

Thank You for reviewing!!!