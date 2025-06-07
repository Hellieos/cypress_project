describe('Simple Allure test', () => {
    it('should generate an allure result', () => {
        cy.allure().step('Testing Allure write', () => {});
        expect(true).to.equal(true);
    });
});