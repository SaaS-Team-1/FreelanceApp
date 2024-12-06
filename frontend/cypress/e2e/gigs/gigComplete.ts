import "../../support/commands";

describe("Gig Complete Test", () => {
    beforeEach(function () {
        // Load the fixture data
        cy.fixture('users').then((users) => {
            this.users = users;
        });
        cy.fixture('gigs').then((gigs) => {
            this.gigs = gigs;
        });
        cy.visit("/app");
    });

    // User 2 login
    it("User 2 login", function () {
        cy.loginUser2();
        cy.log("User 2 logged in");
    });

    // User 2 clicks on complete gig
    it("User 2 presses button completes gig", function () {
        cy.visit("/app/schedule");
        cy.get('.size-full > :nth-child(2)').within(() => {
            cy.get('.mb-3').contains("Scheduled Gigs").then(($scheduledGigs) => {
                if ($scheduledGigs.length > 0) {
                    cy.get('.left-4 > .flex').contains("Complete Gig").scrollIntoView().should('be.visible').click({ force: true });
                    cy.log("User 2 clicked on the complete gig button");
                    cy.wait(1000);
                }
            });
        });
    });


    // Confirm Gig status is updatedon firestore
    it("Gig is awaiting-confirmation on firestore", function () {
        cy.callFirestore('get', 'gigs').then((response) => {
            // Ensure the response is an array and get the first element
            const gig = response[0];

            // gig status is updated to be completed
            expect(gig.status).to.equal("awaiting-confirmation");
            cy.log("Gig status is updated to awaiting-confirmation");
        });
    });

    // User 2 logout
    it("User 2 logs out", () => {
        cy.logout();
    });
});


describe("Schedule test - Awaiting Approval", () => {
    beforeEach(function () {
        // Load the fixture data
        cy.fixture('users').then((users) => {
            this.users = users;
        });
        cy.fixture('gigs').then((gigs) => {
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
    it("User 2 sees the Scheduled Gig in the schedule", function () {
        cy.visit("/app/schedule");
        cy.get(':nth-child(2) > :nth-child(1) > .mb-3').contains("Awaiting Approval");
        cy.get('.ml-3 > .whitespace-normal').contains(this.gigs.gig1.title);
        cy.log("Gig is in Awaiting Approval");
    });

    it("User 2 logs out", () => {
        cy.logout();
    });
})