import Sidebar from "@/components/dashboard/Sidebar";
import { useFirestore } from "@/utils/reactfire";

export default function OverviewView() {
  const db = useFirestore();

  return (
    <div className="flex h-screen bg-gray-50 dark:bg-gray-900">
      <Sidebar />

      <div className="flex-1 p-6">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">
            My Gigs
          </h2>
          <div className="flex space-x-4"></div>
        </div>
      </div>
    </div>
  );
}
