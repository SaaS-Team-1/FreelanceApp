

import { Suspense, startTransition, useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import Loading from "@/components/Loading";
import {
  getDatabaseInstance,
  getFirestoreInstance,
} from "@/utils/firebase/firebaseConfig";
import {
  DatabaseProvider,
  FirestoreProvider,
  useInitDatabase,
  useInitFirestore,
} from "@/utils/reactfire";
import { Database } from "firebase/database";
import { Firestore } from "firebase/firestore";
import { Navigate, Outlet } from "react-router-dom";
import { AuthWrapper } from "@/utils/firebase/auth";
import Sidebar from "@/components/Common/Sidebar";

function FirebaseInitializer({ children }: { children: React.ReactNode }) {
  const { data: firestoreInstance } = useInitFirestore(getFirestoreInstance);
  const { data: databaseInstance } = useInitDatabase(getDatabaseInstance);

  return (
    <FirestoreProvider sdk={firestoreInstance as Firestore}>
      <DatabaseProvider sdk={databaseInstance as Database}>
        {children}
      </DatabaseProvider>
    </FirestoreProvider>
  );
}

export default function AppRoot() {
  const [isReady, setIsReady] = useState(false);
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
          <div className="flex w-screen bg-slate-600">
            {/* Sidebar with conditionally applied styles */}
            <Sidebar

            />
            {/* Main Content Area */}
            <div
              className={`flex-1 flex flex-col`}
            >
              <Outlet />
            </div>
          </div>
        </Suspense>
      </AuthWrapper>
    </FirebaseInitializer>
  );
}

