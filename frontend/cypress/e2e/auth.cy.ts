import "../support/commands";

describe("Authentication Tests for Two Users", () => {
  // Define user details
  const user1 = {
    email: "user1@gmail.com",
    password: "adsmkkdasmnjaskjadsjknkj1212",
    claims: { role: "User" },
  };

  it("Creates the user", () => {
    // Create User 1
    cy.createUser(user1.email, user1.password, user1.claims).then(() => {
      cy.log("User 1 created successfully");
    });
  });

  it("Logs in user", () => {
    // Log in User 1
    cy.loginUser(user1.email, user1.password).then(() => {
      cy.log("User 1 logged in successfully");
    });
  });

  it("Logs out user", () => {
    cy.visit("/app");
    cy.get(".mt-3 > .flex").click();
  });
});

describe("Something", () => {
  // it("", () => cy.createUserAndLogin());
  it("Home", () => cy.visit("/app"));

  // after(() => cy.deleteAllAuthUsers());
});
