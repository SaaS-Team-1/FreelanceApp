import firebase from "firebase/compat/app";
import "firebase/compat/auth";
import "firebase/compat/database";
import "firebase/compat/firestore";
import { attachCustomCommands } from "cypress-firebase";

const config = {
  apiKey: "fake-key",
  authDomain: "demo-saas-team-1.firebaseapp.com",
  projectId: "demo-saas-team-1",
  storageBucket: "demo-saas-team-1.firebasestorage.app",
  messagingSenderId: "430907029750",
  appId: "1:430907029750:web:5e23d1b67645b7969594d",
};

firebase.initializeApp(config);

// Emulate Firestore if Env variable is passed
const firestoreEmulatorHost = Cypress.env("FIRESTORE_EMULATOR_HOST");
if (firestoreEmulatorHost) {
  firebase.firestore().settings({
    host: firestoreEmulatorHost,
    ssl: false,
  });
  console.log(`Using Firestore emulator: http://${firestoreEmulatorHost}/`);
}

const authEmulatorHost = Cypress.env("FIREBASE_AUTH_EMULATOR_HOST");
if (authEmulatorHost) {
  firebase.auth().useEmulator(`http://${authEmulatorHost}/`);
  console.log(`Using Auth emulator: http://${authEmulatorHost}/`);
}

const collections = [
  "users",
  "gigs",
  "applications",
  "chats",
  "chatMessages",
  "ratings",
  "transactions",
  "notifications",
];

after(() => {
  collections.forEach((col) => cy.callFirestore("delete", col));
  cy.logout();
  cy.deleteAllAuthUsers();
});

attachCustomCommands({ Cypress, cy, firebase });
