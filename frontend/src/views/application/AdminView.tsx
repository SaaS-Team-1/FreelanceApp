import { seedDatabase } from "@/utils/database/faker";
import { useAuth, useFirestore } from "@/utils/reactfire";
import { Button } from "flowbite-react";

export default function AdminView() {
  const db = useFirestore();
  const auth = useAuth();
  const populate = () => {
    seedDatabase(db, auth);
  };
  return (
    <div className="flex min-h-[105vh] w-full justify-center bg-slate-600">
      <div>
        <Button onClick={populate}></Button>
      </div>
    </div>
  );
}
