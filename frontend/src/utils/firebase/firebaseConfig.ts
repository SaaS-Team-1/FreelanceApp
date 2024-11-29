import { FirebaseApp } from "firebase/app";
import { connectAuthEmulator, getAuth } from "firebase/auth";
import { connectFirestoreEmulator, getFirestore } from "firebase/firestore";

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
    try {
      connectAuthEmulator(auth, "http://127.0.0.1:9099", {
        disableWarnings: true,
      });
    } catch {
      /* empty */
    }
  }

  return auth;
}

// Instantiate services
export function getFirestoreInstance(app: FirebaseApp) {
  const db = getFirestore(app);

  try {
    if (import.meta.env.DEV) {
      connectFirestoreEmulator(db, "http://127.0.0.1", 8080);
    }
  } catch {
    /* empty */
  }

  return db;
}
