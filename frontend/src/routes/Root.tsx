import Loading from "@/components/Loading";
import {
  getAuthInstance,
  getFirestoreInstance,
} from "@/utils/firebase/firebaseConfig";
import {
  AuthProvider,
  FirestoreProvider,
  useInitFirestore,
  useInitAuth,
} from "@/utils/reactfire";
import { getAnalytics } from "firebase/analytics";
import { Auth } from "firebase/auth";
import { Firestore } from "firebase/firestore";
import { Suspense } from "react";
import { Outlet } from "react-router-dom";

export default function Root() {
  const auth = useInitAuth((app) => getAuthInstance(app));
  const firestore = useInitFirestore((app) => getFirestoreInstance(app));

  return (
    <Suspense fallback={<Loading></Loading>}>
      <AuthProvider sdk={auth.data as Auth}>
        <FirestoreProvider sdk={firestore.data as Firestore}>
          <Outlet />
        </FirestoreProvider>
      </AuthProvider>
    </Suspense>
  );

  // return import.meta.env.DEV ? (
  // content
  // ) : (
  // <AnalyticsProvider sdk={getAnalytics(app)}>{content}</AnalyticsProvider>
  // );
}
