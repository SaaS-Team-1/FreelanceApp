declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace Cypress {
    interface Chainable {
      /**
       * Clears cookies, local storage, and Firebase IndexedDB storage.
       */
      clearSession(): Chainable<void>;

      /**
       * Saves the current session state to local storage.
       */
      saveSession(): Chainable<void>;

      /**
       * Restores the session state from local storage.
       */
      restoreSession(): Chainable<void>;

      /**
       * Creates a user with the given email, password, and custom claims.
       */
      createUser(
        email: string,
        password: string,
        claims: Record<string, string>,
      ): Chainable<void>;

      /**
       * Creates and logs in user with the given email, password, and custom claims.
       */
      createUserAndLogin(
        email?: string,
        password?: string,
        claims?: Record<string, string>,
      ): Chainable<void>;

      /**
       * Creates and logs in user with the given email, password, and custom claims.
       */
      createUserAndLoginSession(
        email?: string,
        password?: string,
        claims?: Record<string, string>,
      ): Chainable<void>;

      /**
       * Logs in a user with the given email and password.
       */
      loginUser(email: string, password: string): Chainable<void>;
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

Cypress.Commands.add("createUser", (email, password, claims) => {
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
      cy.createUserWithClaims({ email, password }, claims).then(() => {
        cy.log("User created successfully");
      });
    });
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

Cypress.Commands.add(
  "createUserAndLogin",
  (
    email = "drew0@hotmail.com",
    password = "password",
    claims = { role: "User" },
  ) => {
    cy.createUser(email, password, claims);
    cy.loginUser(email, password);
  },
);

Cypress.Commands.add(
  "createUserAndLoginSession",
  (
    email = "drew0@hotmail.com",
    password = "adsmkkdasmnjaskjadsjknkj1212",
    claims = { role: "User" },
  ) => {
    cy.session(
      [email, password],
      () => {
        cy.createUser(email, password, claims);
        cy.loginUser(email, password);
      },
      { cacheAcrossSpecs: true },
    );
  },
);

export {};
