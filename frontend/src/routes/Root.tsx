import Loading from "@/components/Loading";
import {
  getAppCheckInstance,
  getAuthInstance,
  getFunctionsInstance,
} from "@/utils/firebase/firebaseConfig";
import {
  useFirebaseApp,
  AuthProvider,
  AnalyticsProvider,
  useInitFunctions,
  FunctionsProvider,
  AppCheckProvider,
  useInitAppCheck,
} from "@/utils/reactfire";
import { getAnalytics } from "firebase/analytics";
import { AppCheck } from "firebase/app-check";
import { Functions } from "firebase/functions";
import { Suspense } from "react";
import { Outlet } from "react-router";

export default function Root() {
  const app = useFirebaseApp();
  const { data: functionsInstance } = useInitFunctions(getFunctionsInstance);
  const { data: appCheck } = useInitAppCheck(getAppCheckInstance);
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
    <AppCheckProvider sdk={appCheck as AppCheck}>
      <AnalyticsProvider sdk={getAnalytics(app)}>{content}</AnalyticsProvider>
    </AppCheckProvider>
  );
}
