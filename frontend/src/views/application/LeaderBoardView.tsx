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
        <div className="dark:text-gray-300 text-2xl font-semibold text-gray-700">
          Loading...
        </div>
      </div>
    );
  }

  // Render leaderboard
  return (
    <div className="container mx-auto">
      <div className="overflow-x-auto rounded-lg mx-6 mt-1">
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
              <tr
                key={user.id}
                className="hover:bg-surface-container-low"
              >
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
    </div>
  );
};

export default LeaderBoardView;
