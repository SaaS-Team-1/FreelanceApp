import "../support/commands";

describe("Test user login", () => {
  // Define user details
  const user = {
    email: "user@gmail.com",
    password: "adsmkkdasmnjaskjadsjknkj1212",
    displayName: "Nicolas Gutierrez",
  };

  it("Creates the user", () => {
    // Create User 1
    cy.createUser(user.email, user.password, user.displayName).then(() => {
      cy.log("User 1 created successfully");
    });
  });

  it("Logs in user", () => {
    // Log in User 1
    cy.visit("/login");
    cy.get(":nth-child(1) > .firebaseui-idp-button")
      .should("be.visible")
      .click();

    cy.get('input[name="email"]')
      .type(user.email)
      .should("have.value", user.email);
    cy.get(".firebaseui-id-submit").click();

    cy.get('input[type="password"]', { timeout: 10000 })
      .should("be.visible")
      .type(user.password)
      .should("have.value", user.password);

    cy.get(".firebaseui-id-submit").click();
    cy.visit("/app");
    cy.contains(user.email);
    cy.visit("/app");
    cy.get(".text-xs").contains(user.email);
  });

  it("Logs out user", () => {
    cy.visit("/app");
    cy.get(".mt-3 > .flex").click();
    cy.location().should((loc) => expect(loc.pathname).to.eq("/login"));
  });
});

describe("Something", () => {
  it("Home", () => cy.visit("/app"));
});
