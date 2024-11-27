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

    // Ensure the sidebar is scrolled to the bottom
    cy.get('[data-testid="sidebar-container"]').scrollTo('bottom', { ensureScrollable: false });

    cy.contains('div', 'Logout')
      .scrollIntoView() // Scroll the element into view
      .should('be.visible') // Ensure it is visible
      .click(); // Click the "Logout" button

    // Ensure the user is logged out
    cy.contains('Seamless Login for Exclusive Access').should('be.visible');
    cy.contains('Sign in with email').should('be.visible');
    cy.contains('Sign in with Google').should('be.visible');
  });
});