import { usersRef } from "@/utils/database/collections";
import { useEffect, useState } from "react";
import { query, orderBy, limit, getDocs } from "firebase/firestore";
import { useFirestore } from "@/utils/reactfire";
import Loading from "react-loading";

// Define the User interface
interface User {
  id: string;
  displayName: string;
  completedGigs: number;
}

function LeaderboardView() {
  // Initialize Firestore
  const db = useFirestore();

  // State variables
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch users from Firestore
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const q = query(
          usersRef(db),
          orderBy("completedGigs", "desc"),
          limit(10),
        );
        const querySnapshot = await getDocs(q);
        const usersList = querySnapshot.docs.map((doc) => {
          const data = doc.data();
          return {
            id: doc.id,
            displayName: data.displayName,
            completedGigs: data.completedGigs,
          } as User;
        });
        setUsers(usersList);
      } catch (error) {
        console.error("Error fetching users:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, [db]);

  // Render loading state
  if (loading) {
    return <Loading />;
  }

  return (
    <div className="container mx-auto max-w-3xl px-4">
      {/* Hide regular table on mobile, show on larger screens */}
      <div className="mt-1 hidden overflow-x-auto rounded-lg sm:block">
        <table className="dark:bg-gray-800 min-w-full border">
          <thead className="bg-primary-container">
            <tr>
              <th className="border-b px-6 py-3 text-left text-sm font-bold uppercase leading-4 tracking-wider text-on-primary-container">
                Rank
              </th>
              <th className="border-b px-6 py-3 text-left text-sm font-bold uppercase leading-4 tracking-wider text-on-primary-container">
                Name
              </th>
              <th className="border-b px-6 py-3 text-left text-sm font-bold uppercase leading-4 tracking-wider text-on-primary-container">
                Completed Gigs
              </th>
            </tr>
          </thead>
          <tbody className="dark:bg-gray-800 bg-white">
            {users.map((user, index) => (
              <tr key={user.id} className="hover:bg-surface-container-low">
                <td className="border-b px-6 py-4 text-sm text-on-primary-container">
                  {index + 1}
                </td>
                <td className="border-b px-6 py-4 text-sm text-on-primary-container">
                  {user.displayName}
                </td>
                <td className="border-b px-6 py-4 text-sm text-on-primary-container">
                  {user.completedGigs}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Show cards on mobile, hide on larger screens */}
      <div className="space-y-4 sm:hidden">
        {users.map((user, index) => (
          <div
            key={user.id}
            className="dark:bg-gray-800 rounded-lg border bg-surface hover:bg-surface-container-low"
          >
            <div className="mb-2 flex w-full items-center justify-between bg-primary-container">
              <span className=" m-1 font-bold text-on-primary-container">
                Position {index + 1}
              </span>
            </div>
            <div className="space-y-2 p-4">
              <div className="flex justify-between">
                <span className="text-sm font-medium text-on-primary-container">
                  Name:
                </span>
                <span className="text-sm text-on-primary-container">
                  {user.displayName}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm font-medium text-on-primary-container">
                  Completed Gigs:
                </span>
                <span className="text-sm text-on-primary-container">
                  {user.completedGigs}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default LeaderboardView;
