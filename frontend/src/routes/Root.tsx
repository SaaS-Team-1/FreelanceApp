import { config, getAuthInstance } from "@/utils/firebase/firebaseConfig";
import { useFirebaseApp, AuthProvider } from "@/utils/reactfire";
import { Outlet } from "react-router-dom";

export default function Root() {
  const app = useFirebaseApp();
  console.log(config);

  return (
    <AuthProvider sdk={getAuthInstance(app)}>
      <Outlet />
    </AuthProvider>
  );
}
