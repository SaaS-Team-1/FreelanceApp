import "../../support/commands";

describe("Applying to a Gig", () => {
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

    // // User 1 login and post a gig 
    // it("Create and login User1", function () {
    //     cy.createUser1();
    //     cy.loginUser1();
    //     cy.log("User 1 logged in");
    // });

    // // User 1 post a gig
    // it("User 1 posts a gig", function () {
    //     // Use the postGig command
    //     cy.postGig(this.gigs.gig1);
    // });

    // it("User 1 logs out", () => {
    //     cy.logout();
    // });

    // User 2 is created to apply for user1's gig
    it("User 2 login", function () {
        // cy.createUser2();
        cy.loginUser2();
        cy.log("User 2 logged in");
    });

    it("The home page is loading the posted gigs", function () {
        cy.get('.mb-6').contains('Loading').should('exist');
        cy.wait(2500);
    });

    // Check if post shows up in home page
    it("Check if posted gig shows up in home", function () {
        cy.contains(this.gigs.gig1.title).should("exist");
        cy.log("Gig posted by User1 is visible");
    });

    // User 2 applies for the gig
    it("User 2 applies for the gig", function () {
        cy.get('.space-y-4 > .relative').click();
        cy.wait(1000);
        cy.get('.mt-4 > .bg-blue-500').click();

        // // Listen for the alert and verify its content
        // cy.on('window:alert', (str) => {
        //     expect(str).to.equal('Application and chat created successfully!');
        // });
        cy.log("User clicked on apply button");
        cy.wait(2000); // Optional: Wait for Firestore synchronization
    });

    it("Confirm the new application and chat are in firestore", function () {
        // Retrieve the UID of user2
        cy.authGetUserByEmail(this.users.user2.email).then((user2) => {
            const user2Uid = user2.uid;

            // Retrieve the UID of user1
            cy.authGetUserByEmail(this.users.user1.email).then((user1) => {
                const user1Uid = user1.uid;

                // Fetch the gigId from Firestore
                cy.callFirestore("get", "gigs").then((gigs) => {
                    const createdGig = gigs.find(gig => gig.title === this.gigs.gig1.title);
                    const gigId = createdGig.id;

                    cy.callFirestore("get", "applications").then((applications) => {
                        const createdApplication = applications.find(application => application.applicantId === user2Uid);

                        // Verify the application details
                        expect(createdApplication).to.exist;
                        expect(createdApplication.applicantId).to.equal(user2Uid);
                        expect(createdApplication.gigId).to.equal(gigId);
                        expect(createdApplication.listerId).to.equal(user1Uid);
                        expect(createdApplication.status).to.equal("pending");

                        cy.log("Application verified in Firestore.");

                        cy.callFirestore("get", "chats").then((chats) => {
                            const createdChat = chats.find(chat => chat.id === createdApplication.chatId);

                            expect(createdChat).to.exist;
                            expect(createdChat.applicationId).to.include(createdApplication.applicationId);
                            expect(createdChat.applicantId).to.include(user2Uid);

                            cy.log("Chat verified in Firestore.");
                        });
                    });
                });
            });
        });
    });

    // User 2 applies for the gig
    it("User 2 cannot reapply to the same Gig", function () {
        cy.get('.space-y-4 > .relative').click();
        cy.wait(1000);
        cy.get('.bg-gray-500 > span').contains("Applied Already");

        // Listen for the alert and verify its content
        cy.log("Apply button is disabled");
        cy.wait(2000); // Optional: Wait for Firestore synchronization
    });

    it("User 2 logs out", () => {
        cy.logout();
    });

});

describe("Schedule test - Pending Gigs", () => {
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
    it("User 2 sees the Pending Gig in the schedule", function () {
        cy.visit("/app/schedule");
        cy.wait(1000);
        cy.get('.scrollbar.text-white').within(() => {
            cy.get('.mb-3').contains("Pending").then(($pendingGigs) => {
                if ($pendingGigs.length > 0) {
                    cy.get('.space-y-4 > .relative').contains(this.gigs.gig1.title);
                    cy.log("User 2 clicked on the complete gig button");
                    cy.wait(1000);
                }
            });
        });
    });

    

    it("User 2 logs out", () => {
        cy.logout();
    });
})