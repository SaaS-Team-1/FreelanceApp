import {
  getAuthInstance,
  getFirestoreInstance,
} from "@/utils/firebase/firebaseConfig";
import {
  useFirebaseApp,
  AuthProvider,
  AnalyticsProvider,
  FirestoreProvider,
} from "@/utils/reactfire";
import { getAnalytics } from "firebase/analytics";
import { useCallback } from "react";
import { Outlet } from "react-router-dom";

export default function Root() {
  const app = useFirebaseApp();
  const auth = useCallback(() => getAuthInstance(app), [app]);
  const firestore = useCallback(() => getFirestoreInstance(app), [app]);

  const content = (
    <AuthProvider sdk={auth()}>
      <FirestoreProvider sdk={firestore()}>
        <Outlet />
      </FirestoreProvider>
    </AuthProvider>
  );

  return import.meta.env.DEV ? (
    content
  ) : (
    <AnalyticsProvider sdk={getAnalytics(app)}>{content}</AnalyticsProvider>
  );
}
