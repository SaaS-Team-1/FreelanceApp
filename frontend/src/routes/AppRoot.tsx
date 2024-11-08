import { Suspense, startTransition, useState, useEffect } from "react";
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
import { Outlet } from "react-router-dom";
import Sidebar from "@/components/Common/Sidebar";

// Separate component to handle Firebase initialization
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
    <Suspense fallback={<Loading />}>
      <Sidebar 
        user={{
          name: "Amina Agile",
          title: "Computer Science Student",
          location: "Leuven City",
          profilePicture: ""
        }}
      />
      <FirebaseInitializer>
        <div className="min-h-screen bg-gray-900" >
        <Outlet />
        </ div> 
      </FirebaseInitializer>
    </Suspense>
  );
}
