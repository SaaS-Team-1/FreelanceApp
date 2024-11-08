import "./index.css";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import {
  createBrowserRouter,
  Navigate,
  RouterProvider,
} from "react-router-dom";

//Firebase
import { FirebaseAppProvider } from "./utils/reactfire/index.ts";
import { config } from "./utils/firebase/firebaseConfig.ts";

// Flowbite
import { Flowbite } from "flowbite-react";
import { flowbiteTheme } from "./theme.ts";

// Routes
import Root from "./routes/Root.tsx";
import AppRoot from "./routes/AppRoot.tsx";

// Views
import Landing from "./views/LandingView.tsx";
import { AuthWrapper } from "./utils/firebase/auth.ts";
import LandingRoot from "./routes/LandingRoot.tsx";
import OverviewView from "./views/student/OverviewView.tsx";
import LoginView from "./views/LoginView.tsx";
import ErrorView from "./views/ErrorView.tsx";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Root />,

    errorElement: <ErrorView />,
    children: [
      {
        path: "/",
        element: <LandingRoot />,
        children: [{ index: true, element: <Landing /> }],
      },
      {
        path: "login",
        element: (
          <AuthWrapper fallback={<Navigate to={"/app"} />}>
            <LoginView />
          </AuthWrapper>
        ),
      },
      {
        path: "/app",
        element: <AppRoot />,
        children: [
          {
            index: true,
            element: (
              <AuthWrapper signedIn fallback={<Navigate to={"/login"} />}>
                <OverviewView />
                {/* <>
                <div className="h-[200vh] bg-gray-800">
                  <h1 className="text-center text-2xl pt-10">Scroll Down to Test Background</h1>
                  <p className="text-center text-lg pt-5">This div is twice the height of the viewport.</p>
                </div>
                </> */}
              </AuthWrapper>
            ),
          },
        ],
      },
    ],
  },
]);

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <FirebaseAppProvider firebaseConfig={config} suspense>
      <Flowbite theme={{ theme: flowbiteTheme }}>
        <RouterProvider router={router} />
      </Flowbite>
    </FirebaseAppProvider>
  </StrictMode>,
);
