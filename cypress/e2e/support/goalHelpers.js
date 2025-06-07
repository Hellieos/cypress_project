const { faker } = require('@faker-js/faker');
console.log('goalHelpers.js loaded');
function generateGoalPayload() {
    return {
        name: faker.company.catchPhrase(),
    };
}

module.exports = {
    generateGoalPayload,
};
