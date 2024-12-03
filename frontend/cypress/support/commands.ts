declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace Cypress {
    interface Chainable {
      /**
       * Clears cookies, local storage, and Firebase IndexedDB storage.
       */
      clearSession(): Chainable<void>;

      /**
       * Creates a user with the given email, password, and custom claims.
       */
      createUser(
        email: string,
        password: string,
        displayName: string,
        photoURL?: string,
        claims?: Record<string, string>,
      ): Chainable<void>;

      /**
       * Creates user1
       */
      createUser1(): Chainable<void>;

      /**
       * Creates user2
       */
      createUser2(): Chainable<void>

      /**
       * Creates and logs in user with the given email, password, and custom claims.
       */
      createUserAndLogin(
        email?: string,
        password?: string,
        displayName?: string,
        photoURL?: string,
        claims?: Record<string, string>,
      ): Chainable<void>;

      /**
       * Logs in user with the given email and password.
       */
      loginUser(email: string, password: string): Chainable<void>;

      /**
       * Logs in user1
       */
      loginUser1(): Chainable<void>;

      /**
       * Logs in user2
       */
      loginUser2(): Chainable<void>;

      /**
       * Logs out the current user.
       */
      logoutUI(): Chainable<void>;
    }
  }
}



// Add the `clearSession` command
Cypress.Commands.add("clearSession", () => {
  cy.get(".mt-3 > .flex").click();
  cy.deleteAllAuthUsers();
  cy.clearCookies();
  cy.clearLocalStorage();
  cy.clearAllSessionStorage();
});

Cypress.Commands.add(
  "createUser",
  (
    email,
    password,
    displayName,
    photoURL = "https://avatars.githubusercontent.com/u/69245724",
    claims = {},
  ) => {
    // Check if the user exists and delete if it does
    cy.authGetUserByEmail(email)
      .then((user) => {
        if (user) {
          cy.log("User exists, deleting...");
          return cy.authDeleteUser(user.uid);
        } else {
          cy.log("User does not exist, skipping deletion.");
        }
      })
      .then(() => {
        // Create the user
        cy.createUserWithClaims(
          { email, password, displayName, photoURL },
          claims,
        ).then(() => {
          cy.log("User created successfully");
        });
      });
  },
);

Cypress.Commands.add('createUser1', function () {
  cy.createUser(this.users.user1.email, this.users.user1.password, this.users.user1.displayName);
});

Cypress.Commands.add('createUser2', function () {
  cy.createUser(this.users.user2.email, this.users.user2.password, this.users.user2.displayName);
});

Cypress.Commands.add("loginUser", (email, password) => {
  cy.visit("/login");
  cy.get(":nth-child(1) > .firebaseui-idp-button").should("be.visible").click();

  cy.get('input[name="email"]').type(email).should("have.value", email);
  cy.get(".firebaseui-id-submit").click();

  cy.get('input[type="password"]', { timeout: 10000 })
    .should("be.visible")
    .type(password)
    .should("have.value", password);

  cy.get(".firebaseui-id-submit").click();
  cy.visit("/app");
  cy.contains(email);
});


Cypress.Commands.add('loginUser1', function () {
  cy.loginUser(this.users.user1.email, this.users.user1.password);
});

Cypress.Commands.add('loginUser2', function () {
  cy.loginUser(this.users.user2.email, this.users.user2.password);
});

// Cypress.Commands.add(
//   "createUserAndLogin",
//   (
//     email = "drew0@hotmail.com",
//     password = "password",
//     displayName = "Nicolas Gutierrez",
//     photoURL = "https://avatars.githubusercontent.com/u/69245724",
//     claims = {},
//   ) => {
//     cy.createUser(email, password, displayName, photoURL, claims);
//     cy.loginWithEmailAndPassword(email, password);
//   },
// );

Cypress.Commands.add('logoutUI', () => {
  cy.visit("/app");
  cy.get(".mt-3 > .flex").click();
  cy.location().should((loc) => expect(loc.pathname).to.eq("/login"));
});

export { };