
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
        cy.get(':nth-child(3) > :nth-child(1) > .w-full')
            .clear() 
            .type('150')
            .type('{del}');
        cy.get(':nth-child(3) > :nth-child(2) > .w-full').type(this.gigs.gig1.location);
        cy.get(':nth-child(4) > .w-full').type(this.gigs.gig1.category);
        cy.get(':nth-child(5) > :nth-child(1) > .w-full').type(this.gigs.gig1.dueDate.split("T")[0]);
        cy.get(':nth-child(5) > :nth-child(2) > .w-full').type(this.gigs.gig1.dueDate.split("T")[1].substring(0, 5));
        cy.get('button.bg-blue-500').contains('Create Gig').click();
        cy.on('window:alert', (text) => {
            expect(text).to.equal('Gig successfully created.');
        });
        // cy.callFirestore('add', 'test_hello_world', { some: 'value' });
        cy.wait(2000);
    });

    it("Confirm if posted gig is in firestore", function () {
        // Check Firestore to verify the gig is added
        cy.callFirestore("get", "gigs").then((gigs) => {
            const createdGig = gigs.find(gig => gig.title === this.gigs.gig1.title);
            expect(createdGig).to.exist;
            expect(createdGig.description).to.equal(this.gigs.gig1.description);
            expect(createdGig.price).to.equal(this.gigs.gig1.price);
            cy.log("Gig verified in Firestore.");

            cy.log("User 1 created a gig completely");
        });
    });
    
        
    it("User 1 logs out", () => {
        cy.logout();
    });
    
    it("Create and login User2", function () {
        cy.createUser2();
        cy.loginUser2(); 
        cy.log("User 2 logged in");
    });

    it("The home page is loading the posted gigs", function () {
        cy.get('.mb-6').contains('Loading').should('exist');
        cy.wait(2000);
    });


    it("User 2 logs out", () => {
        cy.logout();
    });
    // User 2 login and apply for the gig
    // User 1 checks the gig and assign User 2 to the gig
    // User 1 checks if the gig is applied by User 2
    // User 1 assigns User 2 to the gig

});