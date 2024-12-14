import { FirebaseApp } from "firebase/app";
import { initializeAppCheck, ReCaptchaV3Provider } from "firebase/app-check";
import { connectAuthEmulator, getAuth } from "firebase/auth";
import { connectFirestoreEmulator, getFirestore } from "firebase/firestore";
import { connectFunctionsEmulator, getFunctions } from "firebase/functions";

// Clientside (public)
export const config = {
  apiKey: "AIzaSyD5CYwwqBfgkrJDWUsol-hRLvg0OMK8dng",
  authDomain: "saas-team-1.firebaseapp.com",
  databaseURL:
    "https://saas-team-1-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "saas-team-1",
  storageBucket: "saas-team-1.appspot.com",
  messagingSenderId: "414383982341",
  appId: "1:414383982341:web:f6a58ad71632ae26ef996c",
  measurementId: "G-5FX5YJ8YMM",
};

export function getAuthInstance(app: FirebaseApp) {
  const auth = getAuth(app);
  //
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
