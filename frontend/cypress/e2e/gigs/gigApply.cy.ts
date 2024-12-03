import "../../support/commands";

describe("Gig Apply", () => {
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

    // User 1 login and post a gig 
    it("Create and login User1", function () {
        cy.createUser1();
        cy.loginUser1(); 
        cy.log("User 1 logged in");
    });

    // User 1 post a gig
    it("User 1 posts a gig", function () {
        // Use the postGig command
        cy.postGig(this.gigs.gig1);
    });
    
    it("User 1 logs out", () => {
        cy.logout();
    });

    // User 2 is created to apply for user1's gig
    it("Create and login User2", function () {
        cy.createUser2();
        cy.loginUser2(); 
        cy.log("User 2 logged in");
    });

    it("The home page is loading the posted gigs", function () {
        cy.get('.mb-6').contains('Loading').should('exist');
        cy.wait(2000);
    });

    // Check if post shows up in home page
    it("Check if posted gig shows up in my posted gigs", function () {
        cy.contains(this.gigs.gig1.title).should("exist");
        cy.log("Gig posted by User1 is visible");
    });

    // User 2 applies for the gig
    it("User 2 applies for the gig", function () {
        cy.get('.space-y-4 > .relative').click();
    });


    it("User 2 logs out", () => {
        cy.logout();
    });

});