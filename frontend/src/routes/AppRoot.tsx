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
import { useThemeMode } from "flowbite-react";

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
          <div className="flex max-h-screen w-screen overflow-x-hidden overflow-y-hidden">
            <Sidebar />
            <div className="flex w-full bg-slate-600 p-1">
              <Outlet />
            </div>
          </div>
        </Suspense>
      </AuthWrapper>
    </FirebaseInitializer>
  );
}
