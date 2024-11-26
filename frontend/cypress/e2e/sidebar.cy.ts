import '../support/commands';

describe('Sidebar Navigation Tests', () => {
  before(() => {
    // Ensure the user is logged in
    cy.signupOrLogin(); // Assuming the custom command is already defined
  });

  beforeEach(() => {
    // Start from the main app page
    cy.visit('http://localhost:5173/app');
  });

  it('Navigates to My Posted Gigs Page', () => {
    // Use text-based selector to find the "My posted Gigs" button
    cy.contains('div', 'My posted Gigs')
      .should('be.visible') // Ensure it is visible
      .click(); // Click the "My posted Gigs" button

    // Verify content on the Posted Gigs page
    cy.contains('My Posted Gigs').should('be.visible'); 
  });


  it('Navigates to Chat Page', () => {
    // Use text-based selector to find the "Chat" button
    cy.contains('div', 'Chat')
      .should('be.visible') // Ensure it is visible
      .click();

    // Verify content on the Chat page
    // cy.contains('Type your message here').should('be.visible'); // Replace with actual content
  });

  it('Navigates to Schedule Page', () => {
    // Use text-based selector to find the "My posted Gigs" button
    cy.contains('div', 'Schedule')
      .should('be.visible') // Ensure it is visible
      .click(); // Click the "My posted Gigs" button

    // Verify content on the Posted Gigs page
    cy.contains('Scheduled Gigs').should('be.visible'); 
    cy.contains('Pending Gigs').should('be.visible');
  });

  it('Navigates to Notifications Page', () => {
    // Use text-based selector to find the "My posted Gigs" button
    cy.contains('div', 'Notifications')
      .should('be.visible') // Ensure it is visible
      .click(); // Click the "My posted Gigs" button

    // Verify content on the Posted Gigs page
    cy.contains('MyPostedGigsView').should('be.visible'); 
  });

  it('Navigates to Profile Page', () => {
    // Use text-based selector to find the "My posted Gigs" button
    cy.contains('div', 'Profile')
      .should('be.visible') // Ensure it is visible
      .click(); // Click the "My posted Gigs" button

    // Verify content on the Posted Gigs page
    cy.contains('MyPostedGigsView123').should('be.visible'); 
  });

  it('Navigates to Settings Page', () => {
    // Use text-based selector to find the "My posted Gigs" button
    cy.contains('div', 'Settings')
      .should('be.visible') // Ensure it is visible
      .click(); // Click the "My posted Gigs" button

    // Verify content on the Posted Gigs page
    cy.contains('Account').should('be.visible'); 
    cy.contains('Email').should('be.visible'); 
    cy.contains('Password').should('be.visible'); 
  });

  it('Navigates to Home Page', () => {
    // Use text-based selector to find the "My posted Gigs" button
    cy.contains('div', 'Home')
      .should('be.visible') // Ensure it is visible
      .click(); // Click the "My posted Gigs" button

    // Verify content on the Posted Gigs page
    cy.get('input[placeholder="Search for specific Gigs"]').should('be.visible'); 
    cy.contains('Notifications').should('be.visible'); 
    cy.contains('button', '+ Upload new gig').should('be.visible');
  });

  

  // Add similar tests for the remaining Sidebar items (Notifications, Profile, Settings, etc.)
});
