import "../support/commands";

describe("Chat test", () => {
  beforeEach(function () {
    // Load the fixture data
    cy.fixture("users").then((users) => {
      this.users = users;
    });
    cy.fixture("gigs").then((gigs) => {
      this.gigs = gigs;
    });
    cy.visit("/app");
  });

  it("User 2 login", function () {
    cy.loginUser2();
    cy.log("User 2 logged in");
  });

  it("Opens chat with User 1", function () {
    cy.visit("/app/chat");
    cy.log("User clicked on chat button");
    cy.wait(1000);
    cy.get("#active-chats").contains("user1").click();
    cy.log("Opened the chat with User 1");
    cy.get("#chat-window").contains("pending");
    cy.log("The gig status is correct, 'pending'");
  });

  it("User 2 sends a message", function () {
    cy.visit("/app/chat");
    cy.wait(1000);
    cy.get("#message-input").type("Hello, I am interested in your gig!");
    cy.get("#send-button").click();
    cy.log("User 2 clicked send button");
    cy.wait(1000);
    // Check if the chat message is sent
    cy.get("#messages").contains("Hello, I am interested in your gig!");
    cy.log("The message sent shows up on the chat screen");
    cy.wait(1000);
  });

  // Check if the chat message is stored in Firestore
  it("Check if the chat message is stored in Firestore", function () {
    // Retrieve the UID of user2
    cy.authGetUserByEmail(this.users.user2.email).then((user2) => {
      const user2Uid = user2.uid;

      // Retrieve the UID of user1
      cy.authGetUserByEmail(this.users.user1.email).then((user1) => {
        const user1Uid = user1.uid;

        cy.callFirestore("get", "chatMessages").then((chatMessages) => {
          const createdChat = chatMessages.find(
            (chatMessage) =>
              chatMessage.content === "Hello, I am interested in your gig!",
          );
          expect(createdChat).to.exist;
          expect(createdChat.senderId).to.equal(user2Uid);
          expect(createdChat.sentToId).to.equal(user1Uid);
          cy.log("The chat message is stored in Firestore");
        });
      });
    });
  });

  it("User 2 logout", function () {
    cy.logout();
    cy.log("User 2 logged out");
  });

  // User 1 login
  it("User 1 login", function () {
    cy.loginUser1();
    cy.log("User 1 logged in");
    cy.wait(300);
  });

  // Check if User 1 can see the message from User 2
  it("Check if User 1 can see the message from User 2", function () {
    cy.visit("/app/chat");
    cy.get("#active-chats").contains("user2").click();
    cy.log("Opened the chat with User 2");
    cy.get("#messages").contains("Hello, I am interested in your gig!");
    cy.log("The message sent by User 2 shows up on the chat screen");
  });

  // Check if User 1 can reply to User 2
  it("User 1 replies to User 2", function () {
    cy.visit("/app/chat");
    cy.get("#message-input").type("Great! Let me know if you have any questions.");
    cy.get("#send-button").click();
    cy.log("User 1 clicked send button");
    cy.wait(1000);
    cy.get("#messages").contains("Great! Let me know if you have any questions.");
    cy.log("The reply sent by User 1 shows up on the chat screen");
  });

  it("User 1 logout", function () {
    cy.logout();
    cy.log("User 1 logged out");
  });

  // Check if User 2 can see the reply from User 1
  it("Check if User 2 can see the reply from User 1", function () {
    cy.loginUser2();
    cy.log("User 2 logged in");
    cy.wait(300);
    cy.visit("/app/chat");
    cy.get("#active-chats").contains("user1").click();
    cy.log("Opened the chat with User 1");
    cy.get("#messages").contains("Great! Let me know if you have any questions.");
    cy.log("The reply sent by User 1 shows up on the chat screen");
  });
});