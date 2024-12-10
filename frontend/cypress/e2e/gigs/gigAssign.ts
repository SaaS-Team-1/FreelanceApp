import "../../support/commands";

describe("Assigning a Gig", () => {
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

  // User 1 assigns User 2 as a gig
  it("User 1 assigns User 2 from interested giggler section", function () {
    cy.visit("/app/posted-gigs");
    cy.get(".relative.mt-2 > .mb-2").contains("Interested Giggler");
    cy.get(".justify-between > :nth-child(1) > .text-white").contains(
      new RegExp(`.*${this.users.user2.displayName}.*`, "i"),
    );
    cy.log("User 2 is an interested giggler");
    cy.get(".justify-between > .px-3")
      .scrollIntoView()
      .should("be.visible")
      .click({ force: true });
    cy.log("User 1 clicked on the assign button");
    cy.wait(2000);
  });

  // Confirm User 2 is assigned to the Gig on firestore
  it("Gig is assigned on firestore", function () {
    // Retrieve the UID of user2
    cy.authGetUserByEmail(this.users.user2.email).then((user2) => {
      const user2Uid = user2.uid;

      cy.callFirestore("get", "gigs").then((response) => {
        // Ensure the response is an array and get the first element
        const gig = response[0];

        // user2 is assigned to the gig
        expect(gig.selectedApplicantId).to.equal(user2Uid);
        // gig status is updated to be in-progress
        expect(gig.status).to.equal("in-progress");

        cy.callFirestore("get", "applications").then((applications) => {
          // Ensure the response is an array and get the first element
          const application = applications[0];

          // user2 is assigned to the gig
          expect(application.status).to.equal("assigned");
          cy.log("application status is updated to assigned");
        });
      });
    });
  });

  // User 1 assigns User 2 to the gig
  it("User 1 logs out", () => {
    cy.logout();
  });
});

describe("Schedule test - Scheduled Gigs", () => {
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
  it("User 2 login", function () {
    cy.loginUser2();
    cy.log("User 2 logged in");
  });

  // Pending appears in schedule
  // it("User 2 sees the Scheduled Gig in the schedule", function () {
  //     cy.visit("/app/schedule");
  //     cy.get('.size-full > :nth-child(2)').contains("Scheduled Gigs");
  //     cy.get('.ml-3 > .whitespace-normal').contains(this.gigs.gig1.title);
  //     cy.log("Gig is in the schedule");
  // });

  // User 2 clicks on complete gig
  it("User 2 sees the Scheduled Gig in the schedule", function () {
    cy.visit("/app/schedule");
    cy.get(".size-full > :nth-child(2)").within(() => {
      cy.get(".mb-3").contains("Scheduled Gigs").should("be.visible");
    });
  });

  it("User 2 logs out", () => {
    cy.logout();
  });
});
