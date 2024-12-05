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
        profile?: Record<string, string>,
        stats?: Record<string, string>,
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

      /**
       * Posts a gig with the given data.
       */
      postGig(gigData: {
        title: string;
        description: string;
        price: number;
        location: string;
        category: string;
        dueDate: string;
      }): Chainable<void>;
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
    profile = {},
    stats = {},
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
          // Retrieve the UID of the newly created user
          return cy.authGetUserByEmail(email); // Fetch the user again
        })
          .then((user) => {
            if (!user || !user.uid) {
              throw new Error("Failed to retrieve UID from created user.");
            }

            const uid = user.uid; // Retrieve UID from the user
            cy.log(`Retrieved UID: ${uid}`);

            // Upload user profile info to Firestore
            cy.callFirestore('set', `users/${uid}`, {
              email,
              displayName,
              profile,
              stats,
              userId: uid,


              // export interface User {
              //   userId: string;
              //   email: string;
              //   displayName: string;
              //   profile: {
              //     bio: string;
              //     credits: number;
              //     picture?: string;
              //     location: string;
              //   };
              //   stats: {
              //     completedGigs: number;
              //     averageRating: number;
              //   };
              // }
            }).then(() => {
              cy.log("User profile info uploaded to Firestore");
            });
          });
      });
  },
);

Cypress.Commands.add('createUser1', function () {
  cy.createUser(
    this.users.user1.email,
    this.users.user1.password,
    this.users.user1.displayName,
    undefined, // photoURL
    undefined, // claims
    this.users.user1.profile,
    this.users.user1.stats
  );
});

Cypress.Commands.add('createUser2', function () {
  cy.createUser(
    this.users.user2.email,
    this.users.user2.password,
    this.users.user2.displayName,
    undefined, // photoURL
    undefined, // claims
    this.users.user2.profile,
    this.users.user2.stats
  );
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
  cy.loginWithEmailAndPassword(this.users.user1.email, this.users.user1.password);
});

Cypress.Commands.add('loginUser2', function () {
  cy.loginWithEmailAndPassword(this.users.user2.email, this.users.user2.password);
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

Cypress.Commands.add('postGig', (gigData) => {
  cy.get('.h-screen > :nth-child(2) > .flex').click();
  cy.log("User clicked on upload a gig button");

  // Fill in the gig details
  cy.get('.space-y-4 > :nth-child(1) > .w-full').type(gigData.title);
  cy.get('.h-40').type(gigData.description);
  cy.get(':nth-child(3) > :nth-child(1) > .w-full').clear().type(gigData.price.toString()).type('{del}');
  cy.get(':nth-child(3) > :nth-child(2) > .w-full').clear().type(gigData.location);
  cy.get(':nth-child(4) > .w-full').type(gigData.category);
  cy.get(':nth-child(5) > :nth-child(1) > .w-full').type(gigData.dueDate.split("T")[0]);
  cy.get(':nth-child(5) > :nth-child(2) > .w-full').type(gigData.dueDate.split("T")[1].substring(0, 5));
  cy.get('button.bg-blue-500').contains('Create Gig').click();

  // Handle the alert confirmation
  cy.on('window:alert', (text) => {
    expect(text).to.equal('Gig successfully created.');
  });

  cy.wait(2000); // Optional: Wait for Firestore synchronization
});


export { };