import '../support/commands';

describe('Sign-In and Login', () => {
    beforeEach(() => {
        cy.clearSession(); // Clear session to simulate a new user
    });

    it('Sign up or log in with email and password, and check displayed name', () => {
        cy.visit('http://localhost:5173/');
        cy.get('a').contains('Get started!').click();

        // Assert that the URL includes '/login'
        cy.url().should('include', '/login');

        // Assert that the "Sign in with email" button is visible
        cy.contains('Sign in with email').should('be.visible').click();

        // Fill the email field and verify its value
        cy.get('input[name="email"]')
          .type('newuser@gmail.com')
          .should('have.value', 'newuser@gmail.com');

        cy.get('button').contains('Next').click();

        // Dynamically handle the form based on the presence of the name field
        cy.get('body').then(($body) => {
            if ($body.find('input[name="name"]').length > 0) {
                cy.log('First-time sign-up flow detected');
                // First-time sign-up: Fill name and new password
                cy.get('input[name="name"]')
                  .type('New User')
                  .should('have.value', 'New User');

                cy.get('input#ui-sign-in-new-password-input')
                  .type('password123')
                  .should('have.value', 'password123');
            } else {
                cy.log('Existing user login flow detected');
                // Existing user login: Fill password
                cy.get('input[type="password"]', { timeout: 10000 })
                  .should('be.visible')
                  .type('password123')
                  .should('have.value', 'password123');
            }
        });

        // Submit the form
        cy.get('button.firebaseui-id-submit').click();

        // Assert successful login
        cy.url().should('include', '/app');

        // Check if the "+ Upload new gig" button is visible
        cy.contains('button', '+ Upload new gig').should('be.visible');

        // Assert the correct user name is displayed
        cy.get('h2.text-lg.font-semibold.text-blue-300')
          .should('be.visible')
          .and('have.text', 'New User'); // Change "New User" to the expected name
    });
});
