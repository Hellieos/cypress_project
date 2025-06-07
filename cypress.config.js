const allureWriter = require('@shelex/cypress-allure-plugin/writer');
require('dotenv').config();

module.exports = {
  e2e: {
    setupNodeEvents(on, config) {
      console.log('Plugin setupNodeEvents called');
      allureWriter(on, config)
      console.log('Allure writer called');
      config.env.API_URL = process.env.CYPRESS_API_URL;
      config.env.API_TOKEN = process.env.CYPRESS_API_TOKEN;
      config.env.TEAM_ID = process.env.CYPRESS_TEAM_ID;
      return config;
    },
    baseUrl: process.env.CYPRESS_API_URL,
    specPattern: 'cypress/e2e/**/*.cy.js',
  },
};