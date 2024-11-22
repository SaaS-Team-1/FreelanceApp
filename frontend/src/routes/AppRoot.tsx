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
import { Navigate, Outlet } from "react-router-dom";
import { AuthWrapper } from "@/utils/firebase/auth";
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
    <FirebaseInitializer>
      <AuthWrapper signedIn fallback={<Navigate to={"/login"} />}>
        <Suspense fallback={<Loading />}>
          <div className="flex w-screen">
            <Sidebar
              user={{
                email: "amina.agile@example.com",
                displayName: "Amina Agile",
                profile: {
                  bio: "Computer Science Student in Leuven City.",
                  credits: 100,
                  picture: "", // Optional: Can remain blank or include a valid URL
                  location: "Leuven",
                },
                completedGigs: ["gig1", "gig2"],
                activeGigs: ["gig3"],
                listedGigs: ["gig4", "gig5"],
                averageRating: 4.5,
              }}
            />
            <div className="flex min-h-[105vh] w-full bg-slate-600">
              <Outlet />
            </div>
          </div>
        </Suspense>
      </AuthWrapper>
    </FirebaseInitializer>
  );
}
