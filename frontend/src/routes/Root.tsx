import { getAuthInstance } from "@/utils/firebase/firebaseConfig";
import { useFirebaseApp, AuthProvider } from "@/utils/reactfire";
import { Outlet } from "react-router-dom";

export default function Root() {
  const app = useFirebaseApp();

  return (
    <AuthProvider sdk={getAuthInstance(app)}>
      <Outlet />
    </AuthProvider>
  );
}
