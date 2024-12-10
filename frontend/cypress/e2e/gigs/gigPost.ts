import "../../support/commands";

describe("Posting a Gig", () => {
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

  // User 1 login and post a gig
  it("User 1 login", function () {
    // cy.createUser1();
    cy.loginUser1();
    cy.log("User 1 logged in");
  });

  // User 1 post a gig
  it("User 1 posts a gig", function () {
    // Use the postGig command
    cy.postGig(this.gigs.gig1);
  });

  it("Confirm if posted gig is in firestore", function () {
    // Check Firestore to verify the gig is added
    cy.callFirestore("get", "gigs").then((gigs) => {
      const createdGig = gigs.find((gig) => gig.title === this.gigs.gig1.title);
      expect(createdGig).to.exist;
      expect(createdGig.description).to.equal(this.gigs.gig1.description);
      expect(createdGig.price).to.equal(this.gigs.gig1.price);
      cy.log("Gig verified in Firestore.");

      cy.log("User 1 created a gig completely");
    });
  });

  // Check if post shows up in my posted gigs
  it("Check if posted gig shows up in my posted gigs", function () {
    cy.get(".gap-1 > :nth-child(2)").click();
    cy.contains(this.gigs.gig1.title).should("exist");
    cy.log("Gig is visible in My Posted Gigs");
  });

  it("User 1 logs out", () => {
    cy.logout();
  });

  // User 2 login and apply for the gig
  // User 1 checks the gig and assign User 2 to the gig
  // User 1 checks if the gig is applied by User 2
  // User 1 assigns User 2 to the gig
});
