import "../support/commands";

describe("Test user login", () => {
  // get user detail from fixture

  beforeEach(function () {
    // Load the fixture data
    cy.fixture("users").then((users) => {
      this.users = users;
    });
  });

  it("Creates the user1", function () {
    // Create User 1
    cy.createUser1();
  });

  it("Logs in user1", function () {
    // Log in User 1
    cy.loginUser1();
  });

  it("Logs out user1", () => {
    cy.logoutUI();
  });

  it("Creates the user2", function () {
    // Create User 2
    cy.createUser2();
  });

  it("Logs in user2", function () {
    // Log in User 2
    cy.loginUser2();
  });

  it("Logs out user2", () => {
    cy.logoutUI();
  });
});
