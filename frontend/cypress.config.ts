import admin from "firebase-admin";
import { defineConfig } from "cypress";
import { plugin as cypressFirebasePlugin } from "cypress-firebase";

export default defineConfig({
  e2e: {
    baseUrl: "http://localhost:8081",
    chromeWebSecurity: false,
    experimentalRunAllSpecs:true,
    setupNodeEvents(on, config) {
      // Set environment variables for Firebase Emulator
      process.env.FIRESTORE_EMULATOR_HOST = "127.0.0.1:8080"; // Firestore Emulator Host
      process.env.FIREBASE_AUTH_EMULATOR_HOST = "127.0.0.1:9099"; // Auth Emulator Host

      // Initialize cypress-firebase plugin
      return cypressFirebasePlugin(
        on,
        config,
        admin,
        {
          projectId: "demo-saas-team-1", // Your Firebase Project ID
        },
        {
          protectProduction: {
            firestore: "error",
            auth: "error",
          },
        },
      );
    },
  },
});
