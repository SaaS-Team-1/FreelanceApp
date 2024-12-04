import "../support/commands";

describe("Chat test", () => {
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

    it("User 2 login", function () {
        cy.loginUser2();
        cy.log("User 2 logged in");
    });

    it("Opens chat with User 1", function () {  
        cy.get('.gap-1 > :nth-child(3)').click();
        cy.log("User clicked on chat button");
        cy.wait(1000);
        cy.get('.w-3\\/5 > .flex > div > .font-bold').contains('user1').click();
        cy.log("Opened the chat with User 1");
        cy.get('.inline-flex').contains('pending');
        cy.log("The git status is correct, 'pending'");
        cy.get('[style="margin-left: 8px;"]').contains('Undo').should('exist');
        cy.log("Undo button is visible");
    });

    it("User 2 sends a message", function () {
        cy.visit("/app/chat");
        cy.get('.border-t > .scrollbar').type('Hello, I am interested in your gig!');
        cy.get('.border-t > .ml-3').click();
        cy.log("User 2 clicked send button");
        cy.wait(1000);
        //check if the chat message is sent
        
    });

    // check if the chat message is stored in firestore

    // check if User 1 can see the message from User 2

    // check if User 1 can reply to User 2

    // check if User 2 can see the reply from User 1


    it("User 2 logout", function () {
        cy.logout();
        cy.log("User 2 logged out");
    });
});