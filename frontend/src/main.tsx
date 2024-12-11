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
import { AuthWrapper } from "./utils/firebase/auth.ts";

// Flowbite
import { Flowbite } from "flowbite-react";
import { flowbiteTheme } from "./theme.ts";

// Roots
import Root from "./routes/Root.tsx";
import AppRoot from "./routes/AppRoot.tsx";
import LandingRoot from "./routes/LandingRoot.tsx";

// Views
import LandingView from "./views/LandingView.tsx";
import HomePageView from "./views/application/HomePageView.tsx";
import LoginView from "./views/LoginView.tsx";
import ErrorView from "./views/ErrorView.tsx";
import ChatView from "./views/application/ChatView.tsx";
import MyPostedGigsView from "./views/application/MyPostedGigsView.tsx";
import PortfolioView from "./views/application/PortfolioView.tsx";
import ScheduleView from "./views/application/ScheduleView.tsx";
import SettingsView from "./views/application/SettingsView.tsx";
import WalletView from "./views/application/WalletView.tsx";
import LeaderboardView from "./views/application/LeaderboardView.tsx";
import ProfileView from "./views/application/ProfileView.tsx";
import AdminView from "./views/application/AdminView.tsx";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Root />,

    errorElement: <ErrorView />,
    children: [
      {
        path: "",
        element: <LandingRoot />,
        children: [{ index: true, element: <LandingView /> }],
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
            element: <HomePageView />,
          },
          {
            path: "chat",
            element: <ChatView />,
          },
          {
            path: "posted-gigs",
            element: <MyPostedGigsView />,
          },
          {
            path: "portfolio",
            element: <PortfolioView />,
          },
          {
            path: "schedule",
            element: <ScheduleView />,
          },
          {
            path: "profile",
            element: <ProfileView />,
          },
          {
            path: "wallet",
            element: <WalletView />,
          },
          {
            path: "leaderBoard",
            element: <LeaderboardView />,
          },
          {
            path: "admin",
            element: <AdminView />,
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
