const { defineConfig } = require('@playwright/test');

module.exports = defineConfig({
  timeout: 200000,
  retries: 1,
  workers: 1,
  testDir: './tests',

  use: {
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
    trace: 'retain-on-failure',
    headless: false,
    slowMo: 500,

    // Grants location permission
    permissions: ['geolocation'],
    geolocation: { longitude: 13.4050, latitude: 52.5200 }, // Berlin coordinates
  },

  reporter: [
    ['html', { outputFolder: 'test-report' }],
    ['list']
  ],
});