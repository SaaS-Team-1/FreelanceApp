import "../../support/commands";

describe("Assigning a Gig", () => {

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
    it("User 1 login", function () {
        cy.loginUser1();
        cy.log("User 1 logged in");
    });

    // User 1 sees User 2 as an interested giggler in my posted gigs
    it("User 1 assigns User 2 to the gig", function () {
        
    });

    it("User 1 logs out", () => {
        cy.logout();
    });
});