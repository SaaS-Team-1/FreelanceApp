import '../support/commands';

describe('Sidebar Navigation Tests', () => {
  const isAdmin = true; // Set to true for admin tests

  before(() => {
    // Perform login once based on the role
    if (isAdmin) {
      cy.adminLogin(); // Login as admin
    } else {
      cy.signupOrLogin(); // Login as non-admin
    }
    cy.saveSession(); // Save the session after login
  });

  beforeEach(() => {
    // Restore session and navigate to the app's main page
    cy.restoreSession();
    cy.visit('http://127.0.0.1:8081/app');
  });

  const sidebarNavigationTests = [
    {
      name: 'My Posted Gigs Page',
      button: 'My posted Gigs',
      assertions: ['My Posted Gigs'],
    },
    {
      name: 'Chat Page',
      button: 'Chat',
      assertions: [''], // Replace with actual content
    },
    {
      name: 'Schedule Page',
      button: 'Schedule',
      assertions: ['Scheduled Gigs', 'Pending Gigs'],
    },
    {
      name: 'Notifications Page',
      button: 'Notifications',
      assertions: ['MyPostedGigsView'], // Replace with actual content
    },
    {
      name: 'Profile Page',
      button: 'Profile',
      assertions: ['My Profile123'], // Replace with actual content
    },
    {
      name: 'Settings Page',
      button: 'Settings',
      assertions: ['Account', 'Email', 'Password'],
    },
    {
      name: 'Home Page',
      button: 'Home',
      assertions: [
        '+ Upload new gig',
      ],
    },
  ];

  sidebarNavigationTests.forEach(({ name, button, assertions }) => {
    it(`Navigates to ${name}`, () => {
      // Click the sidebar button
      cy.contains('div', button)
        .should('be.visible')
        .click();

      // Verify assertions on the target page
      assertions.forEach((assertion) => {
        if (assertion.startsWith('input[')) {
          cy.get(assertion).should('be.visible'); // For input placeholders
        } else {
          cy.contains(assertion).should('be.visible'); // For text-based assertions
        }
      });
    });
  });
});
