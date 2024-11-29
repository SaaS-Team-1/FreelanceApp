import { Suspense, startTransition, useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import Loading from "@/components/Loading";
import { Navigate, Outlet } from "react-router-dom";
import { AuthWrapper } from "@/utils/firebase/auth";
import Sidebar from "@/components/Common/Sidebar";
import pathNames from "@/utils/pathNames";

export default function AppRoot() {
  const [isReady, setIsReady] = useState(false);
  const [title, setTitle] = useState("");
  const location = useLocation();

  useEffect(() => {
    // Wrap the state update in startTransition
    if (location.pathname in pathNames.paths) {
      setTitle(
        pathNames.paths[location.pathname as keyof typeof pathNames.paths],
      );
    } else {
      setTitle("");
    }
  }, [location]);

  useEffect(() => {
    // Wrap the state update in startTransition
    startTransition(() => {
      setIsReady(true);
    });
  }, []);

  if (!isReady) {
    return <Loading />;
  }
  return (
      <AuthWrapper signedIn fallback={<Navigate to={"/login"} />}>
        <Suspense fallback={<Loading />}>
          <div className="flex max-h-screen w-screen overflow-hidden">
            <Sidebar />
            <div className="flex w-full flex-col items-center bg-slate-600 ">
              {title ? (
                <div className="w-full bg-slate-800">
                  <h2 className="my-2 justify-self-center text-3xl font-extrabold text-white">
                    {title}
                  </h2>
                </div>
              ) : (
                <></>
              )}
              <div className="flex w-full bg-slate-600 p-1">
                <Outlet />
              </div>
            </div>
          </div>
        </Suspense>
      </AuthWrapper>
  );
}
