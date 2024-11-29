import '../support/commands';

describe('Sign Up and Login Tests', () => {
  it('should sign up or log in and navigate to the app', () => {
    // Call the custom command
    cy.signupOrLogin();

    // Perform additional assertions or actions as needed
    // cy.url().should('include', '/app');
    // cy.contains('button', '+ Upload new gig').should('be.visible');
  });
});
