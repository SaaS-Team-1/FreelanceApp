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

    // User 1 assigns User 2 as a gig 
    it("User 1 sees User 2 as an interested giggler", function () {
        cy.visit("/app/posted-gigs");
        cy.get('.relative.mt-2 > .mb-2').contains("Interested Giggler");
        cy.get('.justify-between > .cursor-pointer > .text-white').contains(new RegExp(`.*${this.users.user2.displayName}.*`, 'i'));
        cy.log("User 2 is an interested giggler");
        cy.get('.space-x-2 > .bg-\\[rgba\\(42\\,168\\,21\\,1\\)\\]').click();
        cy.log("User 1 clicked on the assign button");
        cy.wait(1000);
    });

    // Confirm User 2 is assigned to the Gig on firestore
    it("Gig is assigned on firestore", function () {
        // Retrieve the UID of user2
        cy.authGetUserByEmail(this.users.user2.email).then((user2) => {
            const user2Uid = user2.uid;

            cy.callFirestore('get', 'gigs').then((response) => {
                // Ensure the response is an array and get the first element
                const gig = response[0];

                // user2 is assigned to the gig
                expect(gig.selectedApplicantId).to.equal(user2Uid);
                // gig status is updated to be in-progress
                expect(gig.status).to.equal("in-progress");

                cy.callFirestore('get', 'applications').then((applications) => {
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