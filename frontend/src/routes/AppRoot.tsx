import { Suspense, startTransition, useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import Loading from "@/components/Loading";
import { getFirestoreInstance } from "@/utils/firebase/firebaseConfig";
import { FirestoreProvider, useInitFirestore } from "@/utils/reactfire";
import { Firestore } from "firebase/firestore";
import { Navigate, Outlet } from "react-router-dom";
import { AuthWrapper } from "@/utils/firebase/auth";
import Sidebar from "@/components/Common/Sidebar";
import pathNames from "@/utils/pathNames";
import { ToastContainer, toast } from 'react-toastify';

function FirebaseInitializer({ children }: { children: React.ReactNode }) {
  const { data: firestoreInstance } = useInitFirestore(getFirestoreInstance);

  return (
    <FirestoreProvider sdk={firestoreInstance as Firestore}>
      {children}
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
          <div className="flex max-h-screen w-screen overflow-hidden bg-surface-container-lowest">
            <Sidebar />
            <div className="flex w-full flex-col items-center">
              {title ? (
                <div className="my-4 w-full">
                  <h2 className="justify-self-center text-3xl font-extrabold text-on-surface">
                    {title}
                  </h2>
                </div>
              ) : (
                <></>
              )}
              <div className="flex w-full p-1">
                <Outlet />
                <ToastContainer
                position="top-right"
                autoClose={5000}
                hideProgressBar={false}
                newestOnTop={false}
                closeOnClick
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover
                theme="light"
                />
              </div>
            </div>
          </div>
        </Suspense>
      </AuthWrapper>
    </FirebaseInitializer>
  );
}
