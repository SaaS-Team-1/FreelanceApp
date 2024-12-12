import Loading from "@/components/Loading";
import {
  getAuthInstance,
  getFunctionsInstance,
} from "@/utils/firebase/firebaseConfig";
import {
  useFirebaseApp,
  AuthProvider,
  AnalyticsProvider,
  useInitFunctions,
  FunctionsProvider,
} from "@/utils/reactfire";
import { getAnalytics } from "firebase/analytics";
import { Functions } from "firebase/functions";
import { Suspense } from "react";
import { Outlet } from "react-router-dom";

export default function Root() {
  const app = useFirebaseApp();
  const { data: functionsInstance } = useInitFunctions(getFunctionsInstance);
  const content = (
    <Suspense fallback={<Loading />}>
      <AuthProvider sdk={getAuthInstance(app)}>
        <FunctionsProvider sdk={functionsInstance as Functions}>
          <Outlet />
        </FunctionsProvider>
      </AuthProvider>
    </Suspense>
  );

  return import.meta.env.DEV ? (
    content
  ) : (
    <AnalyticsProvider sdk={getAnalytics(app)}>{content}</AnalyticsProvider>
  );
}
