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
       * Creates and logs in user with the given email, password, and custom claims.
       */
      createUserAndLogin(
        email?: string,
        password?: string,
        displayName?: string,
        photoURL?: string,
        claims?: Record<string, string>,
      ): Chainable<void>;
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

// Cypress.Commands.add("loginUser", (email, password) => {
// });

Cypress.Commands.add(
  "createUserAndLogin",
  (
    email = "drew0@hotmail.com",
    password = "password",
    displayName = "Nicolas Gutierrez",
    photoURL = "https://avatars.githubusercontent.com/u/69245724",
    claims = {},
  ) => {
    cy.createUser(email, password, displayName, photoURL, claims);
    cy.loginWithEmailAndPassword(email, password);
  },
);

// Cypress.Commands.add(
//   "createUserAndLoginSession",
//   (
//     email = "drew0@hotmail.com",
//     password = "adsmkkdasmnjaskjadsjknkj1212",
//     claims = { role: "User" },
//   ) => {
//     cy.session(
//       [email, password],
//       () => {
//         cy.createUser(email, password, claims);
//         cy.loginUser(email, password);
//       },
//       { cacheAcrossSpecs: true },
//     );
//   },
// );

export {};
