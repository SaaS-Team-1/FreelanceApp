import "../support/commands";

before(() => cy.createUserAndLogin());

describe("Persistent Session and Feature Access", () => {
  it("should access the home page with a logged-in state", () => {
    // Directly visit the app page; session is already cached
    cy.visit("/app");

    // Assert that the user is on the correct page
    cy.url().should("include", "/app");
    cy.wait(1000); // cy.contains("Welcome, User").should("be.visible"); // Adjust text based on your app's UI
  });
});
