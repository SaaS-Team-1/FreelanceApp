import React, { useEffect, useState } from 'react';
import { collection, query, orderBy, limit, getDocs } from 'firebase/firestore';
import { useFirestore } from '@/utils/reactfire';
import 'flowbite';

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
        const usersCollection = collection(db, 'users');
        const q = query(usersCollection, orderBy('stats.completedGigs', 'desc'), limit(10));
        const querySnapshot = await getDocs(q);
        const usersList = querySnapshot.docs.map(doc => {
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
    return <div className="flex justify-center items-center h-screen">
      <div className="text-2xl font-semibold text-gray-700 dark:text-gray-300">Loading...</div>
    </div>;
  }

  // Render leaderboard
  return (
    <div className="leaderboard container mx-auto p-6">
      <h1 className="text-4xl font-bold mb-6 text-center text-gray-900 dark:text-white">Leaderboard</h1>
      <div className="overflow-x-auto shadow-lg rounded-lg">
        <table className="min-w-full bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
          <thead className="bg-gray-200 dark:bg-gray-700">
            <tr>
              <th className="px-6 py-3 border-b dark:border-gray-700 text-left text-sm leading-4 font-medium text-gray-900 dark:text-white uppercase tracking-wider">Rank</th>
              <th className="px-6 py-3 border-b dark:border-gray-700 text-left text-sm leading-4 font-medium text-gray-900 dark:text-white uppercase tracking-wider">Name</th>
              <th className="px-6 py-3 border-b dark:border-gray-700 text-left text-sm leading-4 font-medium text-gray-900 dark:text-white uppercase tracking-wider">Completed Gigs</th>
            </tr>
          </thead>
          <tbody className="bg-white dark:bg-gray-800">
            {users.map((user, index) => (
              <tr key={user.id} className="hover:bg-gray-100 dark:hover:bg-gray-700">
                <td className="px-6 py-4 border-b dark:border-gray-700 text-sm text-gray-900 dark:text-white">{index + 1}</td>
                <td className="px-6 py-4 border-b dark:border-gray-700 text-sm text-gray-900 dark:text-white">{user.displayName}</td>
                <td className="px-6 py-4 border-b dark:border-gray-700 text-sm text-gray-900 dark:text-white">{user.completedGigs}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default LeaderBoardView;