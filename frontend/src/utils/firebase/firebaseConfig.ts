import { FirebaseApp } from "firebase/app";
import { initializeAppCheck, ReCaptchaV3Provider } from "firebase/app-check";
import { connectAuthEmulator, getAuth } from "firebase/auth";
import { connectFirestoreEmulator, getFirestore } from "firebase/firestore";
import { connectFunctionsEmulator, getFunctions } from "firebase/functions";

// Clientside (public)
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
export async function getFirestoreInstance(app: FirebaseApp) {
  const db = getFirestore(app);

  if (import.meta.env.DEV) {
    try {
      connectFirestoreEmulator(db, "127.0.0.1", 8080);
    } catch (error) {
      console.log(error);
    }
  }
  return db;
}

export async function getFunctionsInstance(app: FirebaseApp) {
  const functions = getFunctions(app, "europe-west1");

  if (import.meta.env.DEV) {
    connectFunctionsEmulator(functions, "127.0.0.1", 5001);
  }
  return functions;
}

export async function getAppCheckInstance(app: FirebaseApp) {
  const appCheck = initializeAppCheck(app, {
    provider: new ReCaptchaV3Provider(
      "6Letn5sqAAAAAKoZp45jW-hQfQGndIG32rns8j--",
    ),

    isTokenAutoRefreshEnabled: true,
  });
  return appCheck;
}
