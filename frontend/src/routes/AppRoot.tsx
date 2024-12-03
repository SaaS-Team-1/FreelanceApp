import { Suspense, startTransition, useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import Loading from "@/components/Loading";
import {
  getDatabaseInstance,
  getFirestoreInstance,
  getFunctionsInstance,
} from "@/utils/firebase/firebaseConfig";
import {
  DatabaseProvider,
  FirestoreProvider,
  FunctionsProvider,
  useInitDatabase,
  useInitFirestore,
  useInitFunctions,
} from "@/utils/reactfire";
import { Database } from "firebase/database";
import { Firestore } from "firebase/firestore";
import { Navigate, Outlet } from "react-router-dom";
import { AuthWrapper } from "@/utils/firebase/auth";
import Sidebar from "@/components/Common/Sidebar";
import pathNames from "@/utils/pathNames";
import { Functions } from "firebase/functions";

function FirebaseInitializer({ children }: { children: React.ReactNode }) {
  const { data: firestoreInstance } = useInitFirestore(getFirestoreInstance);
  const { data: databaseInstance } = useInitDatabase(getDatabaseInstance);
  const { data: functionsInstance } = useInitFunctions(getFunctionsInstance);

  return (
    <FirestoreProvider sdk={firestoreInstance as Firestore}>
      <DatabaseProvider sdk={databaseInstance as Database}>
        <FunctionsProvider sdk={functionsInstance as Functions}>
          {children}
        </FunctionsProvider>
      </DatabaseProvider>
    </FirestoreProvider>
  );
}

export default function AppRoot() {
  const [isReady, setIsReady] = useState(false);
  const [title, setTitle] = useState("");
  const location = useLocation();

  useEffect(() => {
    // Wrap the state update in startTransition
    if (location.pathname in pathNames.paths) {
      setTitle(
        pathNames.paths[location.pathname as keyof typeof pathNames.paths],
      );
    } else {
      setTitle("");
    }
  }, [location]);

  useEffect(() => {
    // Wrap the state update in startTransition
    startTransition(() => {
      setIsReady(true);
    });
  }, []);

  if (!isReady) {
    return <Loading />;
  }
  return (
    <FirebaseInitializer>
      <AuthWrapper signedIn fallback={<Navigate to={"/login"} />}>
        <Suspense fallback={<Loading />}>
          <div className="flex max-h-screen w-screen overflow-hidden">
            <Sidebar />
            <div className="flex w-full flex-col items-center bg-slate-600 ">
              {title ? (
                <div className="w-full bg-slate-800">
                  <h2 className="my-2 justify-self-center text-3xl font-extrabold text-white">
                    {title}
                  </h2>
                </div>
              ) : (
                <></>
              )}
              <div className="flex w-full bg-slate-600 p-1">
                <Outlet />
              </div>
            </div>
          </div>
        </Suspense>
      </AuthWrapper>
    </FirebaseInitializer>
  );
}
