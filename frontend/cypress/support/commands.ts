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
  // Add the `signupOrLogin` command
  Cypress.Commands.add('signupOrLogin', () => {
    // Define user details
    const email = 'newuser@gmail.com';
    const password = 'password123';
    const uid = 'newUserUID'; // Unique ID for the user
    const claims = { role: 'User' }; // Custom claims for the user
  
    // Clear any previous session
    cy.logout();
  
    // Check if the user exists and delete if it does
    cy.authGetUserByEmail(email)
      .then((user) => {
        if (user) {
          cy.log('User exists, deleting...');
          return cy.authDeleteUser(uid);
        } else {
          cy.log('User does not exist, skipping deletion.');
        }
      })
      .then(() => {
        // Create the user
        cy.createUserWithClaims({ email, password, uid }, claims).then(() => {
          cy.log('User created successfully');
          cy.loginWithEmailAndPassword(email, password);
        });
      });
  
    // Navigate to the app and verify
    cy.visit('http://127.0.0.1:8081/app');
    // cy.url().should('include', '/app');
    // cy.contains('button', '+ Upload new gig').should('be.visible');
    // cy.get('h2.text-lg.font-semibold.text-blue-300')
    //   .should('be.visible')
    //   .and('have.text', 'New User'); // Adjust expected name if needed
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
  