import HomeNavbar from "@/components/HomeNavbar";
import { Outlet } from "react-router";

export default function LandingRoot() {
  return (
    <>
      <HomeNavbar />
      <main className="flex min-h-screen items-center justify-center gap-2">
        <Outlet />
      </main>
    </>
  );
}
