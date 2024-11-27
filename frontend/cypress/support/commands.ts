declare global {
    namespace Cypress {
      interface Chainable {
        /**
         * Clears cookies, local storage, and Firebase IndexedDB storage.
         */
        clearSession(): Chainable<void>;
  
        /**
         * Signs up or logs in a user dynamically, depending on their status.
         */
        signupOrLogin(): Chainable<void>;
      }
    }
  }
  
  // Add the `clearSession` command
  Cypress.Commands.add('clearSession', () => {
    cy.clearCookies();
    cy.clearLocalStorage();
    window.indexedDB.deleteDatabase('firebaseLocalStorageDb'); // Optional: Clear Firebase local storage if used
  });
  
  // Add the `signupOrLogin` command
  Cypress.Commands.add('signupOrLogin', () => {
    cy.clearSession(); // Ensure a clean session for testing
    cy.visit('http://localhost:5173/');
    cy.get('a').contains('Get started!').click();
    cy.url().should('include', '/login');
  
    cy.contains('Sign in with email').should('be.visible').click();
  
    cy.get('input[name="email"]').type('newuser@gmail.com').should('have.value', 'newuser@gmail.com');
    cy.get('button').contains('Next').click();
  
    cy.get('body').then(($body) => {
      if ($body.find('input[name="name"]').length > 0) {
        // First-time sign-up flow
        cy.log('First-time sign-up flow detected');
        cy.get('input[name="name"]').type('New User').should('have.value', 'New User');
        cy.get('input#ui-sign-in-new-password-input').type('password123').should('have.value', 'password123');
      } else {
        // Existing user login flow
        cy.log('Existing user login flow detected');
        cy.get('input[type="password"]', { timeout: 10000 })
          .should('be.visible')
          .type('password123')
          .should('have.value', 'password123');
      }
    });
  
    cy.get('button.firebaseui-id-submit').click();
    cy.url().should('include', '/app');
    cy.contains('button', '+ Upload new gig').should('be.visible');
    cy.get('h2.text-lg.font-semibold.text-blue-300').should('be.visible').and('have.text', 'New User'); // Adjust expected name if needed
  });
  
  // Required to ensure this file is treated as a module
  export {};
  