import { getAuthInstance, getFunctionsInstance } from "@/utils/firebase/firebaseConfig";
import {
  useFirebaseApp,
  AuthProvider,
  AnalyticsProvider,
  useInitFunctions,
  FunctionsProvider,
} from "@/utils/reactfire";
import { getAnalytics } from "firebase/analytics";
import { Functions } from "firebase/functions";
import { Outlet } from "react-router-dom";

export default function Root() {
  const app = useFirebaseApp();
  const { data: functionsInstance } = useInitFunctions(getFunctionsInstance);

  const content = (
    <AuthProvider sdk={getAuthInstance(app)}>
      <FunctionsProvider sdk={functionsInstance as Functions}>

      <Outlet />
      </FunctionsProvider>

    </AuthProvider>
  );

  return import.meta.env.DEV ? (
    content
  ) : (
    <AnalyticsProvider sdk={getAnalytics(app)}>{content}</AnalyticsProvider>
  );
}
