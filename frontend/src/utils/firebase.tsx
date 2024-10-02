import {
  getApps,
  initializeApp,
  FirebaseApp,
  getApp,
  FirebaseOptions,
} from "firebase/app";
import { getAuth, connectAuthEmulator, Auth } from "firebase/auth";
import { createContext, ReactNode, useEffect, useState } from "react";
import {
  getFunctions,
  connectFunctionsEmulator,
  Functions,
} from "firebase/functions";
import {
  getStorage,
  connectStorageEmulator,
  FirebaseStorage,
} from "firebase/storage";

// let app;
type FirebaseContextApps = {
  app?: FirebaseApp;
  auth?: Auth;
  functions?: Functions;
  storage?: FirebaseStorage;
};

const FirebaseContext = createContext<FirebaseContextApps | null>(null);
export { FirebaseContext };
export type { FirebaseContextApps };

export default function Loader({ children }: { children: ReactNode }) {
  const [options, setOptions] = useState<FirebaseOptions>();
  useEffect(() => {
    const fn = async () => {
      const request = await fetch("/__/firebase/init.json");
      if (request) {
        try {
          const json = await request.json();
          setOptions(json);
        } catch (error) {
          console.log("No Firebase json found.");
        }
      }
    };
    fn();
  }, []);

  const ctx: FirebaseContextApps = {};

  if (!getApps().length) {
    if (import.meta.env.DEV) {
      const addr = "127.0.0.1";
      const config = {
        apiKey: "test-api-key",
        authDomain: "http://127.0.0.1:9099",
        locationId: "europe-west",
        messagingSenderId: "872004267669",
        projectId: "demo-saas-team-1",
        storageBucket: "demo-saas-team-1.appspot.com",
      };

      ctx.app = initializeApp(config);

      ctx.auth = getAuth(ctx.app);
      ctx.functions = getFunctions(ctx.app, "europe-west1");
      ctx.storage = getStorage(ctx.app);

      connectAuthEmulator(ctx.auth, "http://127.0.0.1:9099");
      connectFunctionsEmulator(ctx.functions, addr, 5001);
      connectStorageEmulator(ctx.storage, addr, 9199);
    } else {
      // const config = await fetch("/__/firebase/init.json");
      if (options) {
        ctx.app = initializeApp(options as FirebaseOptions);
        ctx.auth = getAuth(ctx.app);
        ctx.functions = getFunctions(ctx.app, "europe-west1");
        ctx.storage = getStorage(ctx.app);
      }
    }
  } else {
    ctx.app = getApp();
    ctx.auth = getAuth(ctx.app);
    ctx.functions = getFunctions(ctx.app, "europe-west1");
    ctx.storage = getStorage(ctx.app);
  }

  return (
    <FirebaseContext.Provider value={ctx}>{children}</FirebaseContext.Provider>
  );
}
