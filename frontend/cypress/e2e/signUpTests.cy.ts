import '../support/commands';

describe('Sign-In, Login and Logout', () => {
  beforeEach(() => {
      cy.clearSession(); // Clear session to simulate a fresh state
  });

  it('Handles user sign-up or login and checks displayed name', () => {
      cy.signupOrLogin(); // Use the reusable command
  });

  it('Logs out the user', () => {
      cy.signupOrLogin();
      cy.contains('div','Logout').should('be.visible').click(); // Click the "Log out" button
      cy.contains('Seamless Login for Exclusive Access').should('be.visible'); // Ensure the user is logged out
      cy.contains('Sign in with email').should('be.visible');
      cy.contains('Sign in with Google').should('be.visible');
  });
});

