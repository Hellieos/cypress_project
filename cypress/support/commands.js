Cypress.Commands.add('createGoal', (teamId, payload) => {
    return cy.request({
        method: 'POST',
        url: `/team/${teamId}/goal`,
        headers: {
            Authorization: Cypress.env('API_TOKEN'),
            'Content-Type': 'application/json',
        },
        body: payload,
    });
});

Cypress.Commands.add('deleteGoal', (goalId) => {
    return cy.request({
        method: 'DELETE',
        url: `/goal/${goalId}`,
        headers: {
            Authorization: Cypress.env('API_TOKEN'),
            'Content-Type': 'application/json',
        },
    });
});
