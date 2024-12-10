import "../support/commands";

describe("Notification Test", () => {
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

  // User 1 login
  it("User 1 login", function () {
    cy.loginUser1();
    cy.log("User 1 logged in");
  });

  // Check if there is a notification

  // User 1 logout
  it("User 1 logs out", () => {
    cy.logout();
  });
});
