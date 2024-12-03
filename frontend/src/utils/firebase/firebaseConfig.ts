import { FirebaseApp } from "firebase/app";
import { connectAuthEmulator, getAuth } from "firebase/auth";
import { connectDatabaseEmulator, getDatabase } from "firebase/database";
import { connectFirestoreEmulator, getFirestore } from "firebase/firestore";
import { connectFunctionsEmulator, getFunctions } from "firebase/functions";
import { connectStorageEmulator, getStorage } from "firebase/storage";

// Your web app's Firebase configuration
export const config = {
  apiKey: import.meta.env.VITE_PUBLIC_FIREBASE_API_KEY || "fake-key",
  authDomain:
    import.meta.env.VITE_PUBLIC_FIREBASE_AUTH_DOMAIN ||
    "demo-saas-team-1.firebaseapp.com",
  projectId:
    import.meta.env.VITE_PUBLIC_FIREBASE_PROJECT_ID || "demo-saas-team-1",
  storageBucket:
    import.meta.env.VITE_PUBLIC_FIREBASE_STORAGE_BUCKET ||
    "demo-saas-team-1.firebasestorage.app",
  messagingSenderId:
    import.meta.env.VITE_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || "430907029750",
  appId:
    import.meta.env.VITE_PUBLIC_FIREBASE_APP_ID ||
    "1:430907029750:web:5e23d1b67645b7969594d",
};

export function getAuthInstance(app: FirebaseApp) {
  const auth = getAuth(app);

  if (import.meta.env.DEV) {
    connectAuthEmulator(auth, "http://127.0.0.1:9099", {
      disableWarnings: true,
    });
  }

  return auth;
}

// Instantiate services
export function getServices(app: FirebaseApp) {
  const db = getFirestore(app);
  const functions = getFunctions(app, "europe-west1");
  const storage = getStorage(app);

  if (import.meta.env.DEV) {
    connectFunctionsEmulator(functions, "127.0.0.1", 5001);
    connectFirestoreEmulator(db, "127.0.0.1", 8080);
    connectStorageEmulator(storage, "127.0.0.1", 9199);
  }
  return { db, functions, storage };
}

// Instantiate services
export async function getFirestoreInstance(app: FirebaseApp) {
  const db = getFirestore(app);

  if (import.meta.env.DEV) {
    connectFirestoreEmulator(db, "127.0.0.1", 8080);
  }
  return db;
}

export async function getDatabaseInstance(app: FirebaseApp) {
  const database = getDatabase(app);

  if (import.meta.env.DEV) {
    connectDatabaseEmulator(database, "127.0.0.1", 9199);
  }
  return database;
}

export async function getFunctionsInstance(app: FirebaseApp) {
  const functions = getFunctions(app, "europe-west1");

  if (import.meta.env.DEV) {
    connectFunctionsEmulator(functions, "127.0.0.1", 5001);
  }
  return functions;
}
