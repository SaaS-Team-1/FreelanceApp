
import "../support/commands";

describe("Flow of Posting a Gig", () => {

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
        cy.get('.h-screen > :nth-child(2) > .flex').click();
        cy.log("User 1 clicked on upload a gig button");

        // type in gig details
        cy.get('.space-y-4 > :nth-child(1) > .w-full').type(this.gigs.gig1.title);
        cy.get('.h-40').type(this.gigs.gig1.description);
        cy.get(':nth-child(3) > :nth-child(1) > .w-full').type('{backspace}').type(this.gigs.gig1.price);
        cy.get(':nth-child(3) > :nth-child(2) > .w-full').type(this.gigs.gig1.location);
        cy.get(':nth-child(4) > .w-full').type(this.gigs.gig1.category);
        cy.get(':nth-child(5) > :nth-child(1) > .w-full').type(this.gigs.gig1.dueDate.split("T")[0]);
        cy.get(':nth-child(5) > :nth-child(2) > .w-full').type(this.gigs.gig1.dueDate.split("T")[1].substring(0, 5));
    });

    it("User 1 logs out", () => {
        cy.logout();
    });
    
    
    
    // User 2 login and apply for the gig
    // User 1 checks the gig and assign User 2 to the gig
    // User 1 checks if the gig is applied by User 2
    // User 1 assigns User 2 to the gig

})