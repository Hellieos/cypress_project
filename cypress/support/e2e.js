require('@shelex/cypress-allure-plugin');
require('./commands');

// Force initialization explicitly
Cypress.on('test:after:run', (test, runnable) => {
    if (Cypress.Allure) {
        Cypress.Allure.reporter.getInterface().startSuite(runnable.parent.title);
        Cypress.Allure.reporter.getInterface().endSuite();
    }
});
