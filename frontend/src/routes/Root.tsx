import { getAuthInstance } from "@/utils/firebase/firebaseConfig";
import {
  useFirebaseApp,
  AuthProvider,
  AnalyticsProvider,
} from "@/utils/reactfire";
import { getAnalytics } from "firebase/analytics";
import { Outlet } from "react-router-dom";

export default function Root() {
  const app = useFirebaseApp();

  const content = (
    <AuthProvider sdk={getAuthInstance(app)}>
      <Outlet />
    </AuthProvider>
  );

  return import.meta.env.DEV ? (
    content
  ) : (
    <AnalyticsProvider sdk={getAnalytics(app)}>{content}</AnalyticsProvider>
  );
}
