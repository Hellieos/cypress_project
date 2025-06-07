const allureWriter = require('@shelex/cypress-allure-plugin/writer');

module.exports = {
  e2e: {
    setupNodeEvents(on, config) {
      console.log('Plugin setupNodeEvents called');
      allureWriter(on, config);
      console.log('Allure writer called');

      // Assign environment variables (for both local + CI)
      config.env.API_URL = process.env.CYPRESS_API_URL || config.env.API_URL;
      config.env.API_TOKEN = process.env.CYPRESS_API_TOKEN || config.env.API_TOKEN;
      config.env.TEAM_ID = process.env.CYPRESS_TEAM_ID || config.env.TEAM_ID;

      // Set baseUrl if defined
      if (process.env.CYPRESS_API_URL) {
        config.baseUrl = process.env.CYPRESS_API_URL;
      }

      return config;
    },
    specPattern: 'cypress/e2e/**/*.cy.js',
  },
};
