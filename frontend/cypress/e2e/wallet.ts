import "../support/commands";

describe("Wallet test", () => {
  beforeEach(function () {
    // Load the fixture data
    cy.fixture("users").then((users) => {
      this.users = users;
    });
    cy.fixture("gigs").then((gigs) => {
      this.gigs = gigs;
    });
    cy.visit("/app");
  });

  // User 1 loginF
  it("User 1 login", function () {
    cy.loginUser1();
    cy.log("User 1 logged in");
  });

  it("User 1 Balance is updated to 1000", function () {
    cy.authGetUserByEmail(this.users.user1.email).then((user1) => {
      const user1Uid = user1.uid;
      cy.addMockTransaction(user1Uid, 1000);

      // Update the coins field for user1
      cy.callFirestore(
        "set",
        `users/${user1Uid}`,
        { coins: 1000 },
        { merge: true },
      );

      // Verify the coins field is updated to 1000
      cy.callFirestore("get", `users/${user1Uid}`).then((userDoc) => {
        expect(userDoc.coins).to.equal(1000);
      });
    });

    cy.wait(1000);
  });

  // User 1 Balace is updated to 2000
  it("User 1 Balance is updated to 1000", function () {
    cy.visit("/app/wallet");
    cy.get(".justify-self-end > .flex").contains("1,000");
  });

  // User 1 logs out
  it("User 1 logs out", () => {
    cy.logout();
  });
});
