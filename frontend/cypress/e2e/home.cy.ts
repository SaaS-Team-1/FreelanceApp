import '../support/commands';

import '../support/commands';

describe('Persistent Session and Feature Access', () => {
  const email = 'user1@gmail.com';
  const password = 'password123';
  const uid = 'user1UID';
  const claims = { role: 'User' };

  before(() => {
    // Ensure the user is created before all tests
    cy.createUser(email, password, uid, claims);
  });

  beforeEach(() => {
    // Use cy.session to cache the logged-in state
    cy.session(
      [email, password], // Unique ID for session caching
      () => {
        // Setup function for logging in
        cy.loginUser(email, password);
        cy.visit('/app');
      }
    );
  });

  it('should access the home page with a logged-in state', () => {
    // Directly visit the app page; session is already cached
    cy.visit('/app');

    // Assert that the user is on the correct page
    cy.url().should('include', '/app');
    cy.contains('Welcome, User').should('be.visible'); // Adjust text based on your app's UI
  });

  it('should access another protected page with the same session', () => {
    // Visit another protected page
    cy.visit('/protected-page');

    // Assert that the page is loaded correctly
    cy.url().should('include', '/protected-page');
    cy.contains('Protected Page').should('be.visible'); // Adjust text based on your app's UI
  });
});
