import { DarkThemeToggle } from "flowbite-react";
import { httpsCallable, Functions } from "firebase/functions";
import { useContext, useEffect, useState } from "react";
import { FirebaseContext, FirebaseContextApps } from "@/utils/firebase";

export default function Root() {
  const firebase = useContext(FirebaseContext) as FirebaseContextApps;
  const [hello, setHello] = useState<string | null>();

  useEffect(() => {
    async function test() {
      const res = await httpsCallable(
        firebase.functions as Functions,
        "helloWorld",
      )();

      setHello(res.data as string);
    }
    if (firebase && firebase.functions) {
      test();
    }
  }, [firebase]);
  return (
    <main className="flex min-h-screen items-center justify-center gap-2 dark:bg-gray-800">
      <h1 className="text-2xl dark:text-white">Flowbite React + Vite</h1>
      <DarkThemeToggle />
      {hello}
    </main>
  );
}
