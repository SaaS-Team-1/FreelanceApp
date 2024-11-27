import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import 'firebase/compat/database';
import 'firebase/compat/firestore';
import { attachCustomCommands } from 'cypress-firebase';

const fbConfig = {
  // Your config from Firebase Console
};

firebase.initializeApp(fbConfig);

attachCustomCommands({ Cypress, cy, firebase });




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

        /**
         * Access the admin page
         */
        adminLogin(): Chainable<void>;

        /**
         * Saves the current session state to local storage.
         */
        saveSession(): Chainable<void>;

        /**
         * Restores the session state from local storage.
         */
        restoreSession(): Chainable<void>;
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
    cy.visit('http://127.0.0.1:8081/');
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

// commands.ts
Cypress.Commands.add('adminLogin', () => {
  cy.signupOrLogin(); // Perform the login process
  cy.visit('http://127.0.0.1:8081/app/admin'); // Navigate to the admin page
  cy.url().should('include', '/admin'); // Verify we're on the admin page

  // Click the populate button to start the process
  cy.get('[data-cy="populate-button"]', { timeout: 10000 })
    .should('be.visible')
    .click();

  // Wait for the seeding status to be 'Seeding completed!'
  cy.get('[data-cy="seeding-status"]', { timeout: 600000 })
    .should('contain', 'Seeding completed!');

  // Navigate to the home page after the seeding is complete
  cy.contains('div', 'Home', { timeout: 10000 }).should('be.visible').click();
});


  
  
  

  //Save the current session after login so that you wont have to login before each test:
  Cypress.Commands.add('saveSession', () => {
    cy.getCookies().then((cookies) => {
      localStorage.setItem('cookies', JSON.stringify(cookies));
    });
    cy.window().then((win) => {
      const localStorageData: Record<string, string> = {}; // Correct typing for the object
      for (const key in win.localStorage) {
        localStorageData[key] = win.localStorage[key];
      }
      localStorage.setItem('localStorageData', JSON.stringify(localStorageData));
    });
  });
  
  //Restore the saved session after login so that you wont have to login before each test:
  Cypress.Commands.add('restoreSession', () => {
    const cookies: Array<{ name: string; value: string }> = JSON.parse(localStorage.getItem('cookies') || '[]');
    cookies.forEach(({ name, value }) => {
      cy.setCookie(name, value);
    });
    const localStorageData: Record<string, string> = JSON.parse(localStorage.getItem('localStorageData') || '{}');
    cy.window().then((win) => {
      for (const key in localStorageData) {
        win.localStorage.setItem(key, localStorageData[key]);
      }
    });
  });
  
  
  
  // Required to ensure this file is treated as a module
  export {};
  