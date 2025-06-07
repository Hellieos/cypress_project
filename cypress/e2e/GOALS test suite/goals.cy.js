const { generateGoalPayload } = require('../support/goalHelpers');

describe('ClickUp Goal API — Full Test Suite', () => {
    const teamId = Cypress.env('TEAM_ID');
    const headers = {
        Authorization: Cypress.env('API_TOKEN'),
        'Content-Type': 'application/json',
    };

    let goalId;
    let goalName;
    it('Allure plugin test', () => {
        cy.allure().step('This should go to Allure report');
    });

    // GROUP 1: CREATE
    context('POST /team/{team_id}/goal - Create Goal', () => {
        it('Створити goal із валідними token та team ID', () => {
            const payload = generateGoalPayload();
            goalName = payload.name;
            console.log(generateGoalPayload());


            cy.createGoal(teamId, payload).then((res) => {
                expect(res.status).to.eq(200);
                expect(res.statusText).to.match(/OK/i);
                expect(res.body.goal).to.have.property('id');
                expect(res.body.goal.name).to.eq(goalName);
                goalId = res.body.goal.id;
            });
        });

        it('Спроба створити goal без name має провалитись (500)', () => {
            cy.request({
                method: 'POST',
                url: `/team/${teamId}/goal`,
                headers,
                body: {},
                failOnStatusCode: false,
            }).then((res) => {
                expect(res.status).to.eq(500);
                expect(res.body).to.have.property('err');
                expect(res.body.err).to.include('Internal Server Error');
            });
        });
    });

    // GROUP 2: GET (single + all)
    context('GET /goal/{goal_id} - Retrieve Goal', () => {
        it('Отримати створену goal', () => {
            cy.request({
                method: 'GET',
                url: `/goal/${goalId}`,
                headers,
            }).then((res) => {
                expect(res.status).to.eq(200);
                expect(res.statusText).to.match(/OK/i);
                expect(res.body.goal.id).to.eq(goalId);
                expect(res.body.goal.name).to.eq(goalName);
            });
        });

        it('Має провалитись при спробі отримати goal з невалідним token', () => {
            cy.request({
                method: 'GET',
                url: `/goal/${goalId}`,
                headers: {
                    Authorization: 'Bearer wrong_token',
                    'Content-Type': 'application/json',
                },
                failOnStatusCode: false,
            }).then((res) => {
                expect(res.status).to.eq(401);
                expect(res.body).to.have.property('err');
            });
        });

        it('Має провалитись при спробі отримати goal з невалідним goal ID', () => {
            cy.request({
                method: 'GET',
                url: `/goal/fakegoalid123`,
                headers,
                failOnStatusCode: false,
            }).then((res) => {
                expect(res.status).to.eq(500);
                expect(res.body).to.have.property('err');
                expect(res.body.err).to.include('Internal Server Error');
            });
        });

        it('Має отримати усі goals з валідним team ID', () => {
            cy.request({
                method: 'GET',
                url: `/team/${teamId}/goal`,
                headers,
            }).then((res) => {
                expect(res.status).to.eq(200);
                expect(res.body.goals).to.be.an('array');
            });
        });

        it('Має провалитись при спробі отримати goal з невалідним team ID', () => {
            cy.request({
                method: 'GET',
                url: `/team/faketeamid123/goal`,
                headers,
                failOnStatusCode: false,
            }).then((res) => {
                expect(res.status).to.be.oneOf([400, 404]);
                expect(res.body).to.have.property('err');
            });
        });
    });

    // GROUP 3: UPDATE
    context('PUT /goal/{goal_id} - Update Goal', () => {
        it('Має оновити goal name', () => {
            const updatedName = 'Updated Goal from Test';

            cy.request({
                method: 'PUT',
                url: `/goal/${goalId}`,
                headers,
                body: { name: updatedName },
            }).then((res) => {
                expect(res.status).to.eq(200);
                expect(res.body.goal.name).to.eq(updatedName);
            });
        });

        it('Має провалитись при спробі оновити goal з невалідним goal ID', () => {
            cy.request({
                method: 'PUT',
                url: `/goal/invalidgoalid999`,
                headers,
                body: { name: 'Won’t Work' },
                failOnStatusCode: false,
            }).then((res) => {
                expect(res.status).to.eq(500);
                expect(res.body).to.have.property('err');
                expect(res.body.err).to.include('Internal Server Error')
            });
        });
    });

    // GROUP 4: DELETE
    context('DELETE /goal/{goal_id} - Delete Goal', () => {
        it('Видалити створений goal', () => {
            cy.deleteGoal(goalId).then((res) => {
                expect(res.status).to.eq(200);
            });
        });

        it('Має провалитись при спробі отримати видалений goal (404)', () => {
            cy.request({
                method: 'GET',
                url: `/goal/${goalId}`,
                headers,
                failOnStatusCode: false,
            }).then((res) => {
                expect(res.status).to.eq(404);
            });
        });

        it('Має провалитись при спробі видалити неіснуючий goal', () => {
            cy.request({
                method: 'DELETE',
                url: `/goal/${goalId}`, // already deleted
                headers,
                failOnStatusCode: false,
            }).then((res) => {
                expect(res.status).to.be.oneOf([404, 400]);
            });
        });
    });
});
