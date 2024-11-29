import '../support/commands';

describe('Authentication Tests for Two Users', () => {
  // Define user details
  const user1 = {
    email: 'user1@gmail.com',
    password: 'password123',
    uid: 'user1UID',
    claims: { role: 'User' },
  };

  const user2 = {
    email: 'user2@gmail.com',
    password: 'password456',
    uid: 'user2UID',
    claims: { role: 'User' },
  };

  beforeEach(() => {
    // Clear session before each test
    cy.clearSession();
  });

  it('should create both users', () => {
    // Create User 1
    cy.createUser(user1.email, user1.password, user1.uid, user1.claims).then(() => {
      cy.log('User 1 created successfully');
    });

    // Create User 2
    cy.createUser(user2.email, user2.password, user2.uid, user2.claims).then(() => {
      cy.log('User 2 created successfully');
    });
  });

  it('should log in and log out User 1', () => {
    // Log in User 1
    cy.loginUser(user1.email, user1.password).then(() => {
      cy.log('User 1 logged in successfully');
    });

    // Log out User 1
    cy.logout().then(() => {
      cy.log('User 1 logged out successfully');
    });
  });

  it('should log in and log out User 2', () => {
    // Log in User 2
    cy.loginUser(user2.email, user2.password).then(() => {
      cy.log('User 2 logged in successfully');
    });

    // Log out User 2
    cy.logout().then(() => {
      cy.log('User 2 logged out successfully');
    });
  });
});
