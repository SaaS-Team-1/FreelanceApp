import "../support/commands";

describe("Test user login", () => {
  // get user detail from fixture 
  beforeEach(function() {
    // Load the fixture data
    cy.fixture('users').then((users) => {
      this.users = users;
    });
  });

  it("Creates the user1", function() {
    // Create User 1
    cy.createUser(this.users.user1.email, this.users.user1.password, this.users.user1.displayName).then(() => {
      cy.log("User 1 created successfully");
    });
  });

  it("Logs in user1", function() {
    // Log in User 1
    cy.visit("/login");
    cy.get(":nth-child(1) > .firebaseui-idp-button")
      .should("be.visible")
      .click();

    cy.get('input[name="email"]')
      .type(this.users.user1.email)
      .should("have.value", this.users.user1.email);
    cy.get(".firebaseui-id-submit").click();

    cy.get('input[type="password"]', { timeout: 10000 })
      .should("be.visible")
      .type(this.users.user1.password)
      .should("have.value", this.users.user1.password);

    cy.get(".firebaseui-id-submit").click();
    cy.visit("/app");
    cy.contains(this.users.user1.email);
    cy.visit("/app");
    cy.get(".text-xs").contains(this.users.user1.email);
  });

  it("Logs out user1", () => {
    cy.logout();
  });

  it("Creates the user2", function() {
    // Create User 2
    cy.createUser(this.users.user2.email, this.users.user2.password, this.users.user2.displayName).then(() => {
      cy.log("User 2 created successfully");
    });
  });

  it("Logs in user2", function() {
    // Log in User 1
    cy.visit("/login");
    cy.get(":nth-child(1) > .firebaseui-idp-button")
      .should("be.visible")
      .click();

    cy.get('input[name="email"]')
      .type(this.users.user2.email)
      .should("have.value", this.users.user2.email);
    cy.get(".firebaseui-id-submit").click();

    cy.get('input[type="password"]', { timeout: 10000 })
      .should("be.visible")
      .type(this.users.user2.password)
      .should("have.value", this.users.user2.password);

    cy.get(".firebaseui-id-submit").click();
    cy.visit("/app");
    cy.contains(this.users.user2.email);
    cy.visit("/app");
    cy.get(".text-xs").contains(this.users.user2.email);
  });

  it("Logs out user2", () => {
    cy.logout();
  });



});

describe("Something", () => {
  it("Home", () => cy.visit("/app"));
});
