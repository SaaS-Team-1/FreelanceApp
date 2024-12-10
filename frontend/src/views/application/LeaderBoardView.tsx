import React, { useEffect, useState } from "react";
import { collection, query, orderBy, limit, getDocs } from "firebase/firestore";
import { useFirestore } from "@/utils/reactfire";
import "flowbite";

// Define the User interface
interface User {
  id: string;
  displayName: string;
  completedGigs: number;
}

const LeaderBoardView: React.FC = () => {
  // Initialize Firestore
  const db = useFirestore();

  // State variables
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch users from Firestore
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const usersCollection = collection(db, "users");
        const q = query(
          usersCollection,
          orderBy("stats.completedGigs", "desc"),
          limit(10),
        );
        const querySnapshot = await getDocs(q);
        const usersList = querySnapshot.docs.map((doc) => {
          const data = doc.data();
          return {
            id: doc.id,
            displayName: data.displayName,
            completedGigs: data.stats.completedGigs,
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
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="text-2xl font-semibold text-gray-700 dark:text-gray-300">
          Loading...
        </div>
      </div>
    );
  }

  // Render leaderboard
  return (
    <div className="leaderboard container mx-auto p-6">
      <h1 className="mb-6 text-center text-4xl font-bold text-gray-900 dark:text-white">
        Leaderboard
      </h1>
      <div className="overflow-x-auto rounded-lg shadow-lg">
        <table className="min-w-full border border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-800">
          <thead className="bg-gray-200 dark:bg-gray-700">
            <tr>
              <th className="border-b px-6 py-3 text-left text-sm font-medium uppercase leading-4 tracking-wider text-gray-900 dark:border-gray-700 dark:text-white">
                Rank
              </th>
              <th className="border-b px-6 py-3 text-left text-sm font-medium uppercase leading-4 tracking-wider text-gray-900 dark:border-gray-700 dark:text-white">
                Name
              </th>
              <th className="border-b px-6 py-3 text-left text-sm font-medium uppercase leading-4 tracking-wider text-gray-900 dark:border-gray-700 dark:text-white">
                Completed Gigs
              </th>
            </tr>
          </thead>
          <tbody className="bg-white dark:bg-gray-800">
            {users.map((user, index) => (
              <tr
                key={user.id}
                className="hover:bg-gray-100 dark:hover:bg-gray-700"
              >
                <td className="border-b px-6 py-4 text-sm text-gray-900 dark:border-gray-700 dark:text-white">
                  {index + 1}
                </td>
                <td className="border-b px-6 py-4 text-sm text-gray-900 dark:border-gray-700 dark:text-white">
                  {user.displayName}
                </td>
                <td className="border-b px-6 py-4 text-sm text-gray-900 dark:border-gray-700 dark:text-white">
                  {user.completedGigs}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default LeaderBoardView;
