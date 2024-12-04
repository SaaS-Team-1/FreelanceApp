import { useLoaderData } from "react-router-dom";
import { useUser, useFirestore } from "@/utils/reactfire";
import { User } from "@/utils/database/schema";
import { useEffect, useState } from "react";
import { collection, query, where, getDocs } from "firebase/firestore";
import UserProfilePicture from "@/components/Avatar/UserProfilePicture";

export interface UserParams {
  UID?: string;
}

export async function userLoader({ params }: { params: UserParams }) {
  return params;
}

export default function UserView() {
  const { data: userU } = useUser();
  const db = useFirestore();
  const [user, setUser] = useState<User | null>(null);
  const { UID } = useLoaderData() as UserParams;

  const fetchUser = async () => {
    try {
      if (userU) {
        const usersRef = collection(db, "users");

        const userQuery = query(usersRef, where("userId", "==", userU.uid));

        const userSnapshot = await getDocs(userQuery);

        const userDb = userSnapshot.docs[0]?.data() as User;

        setUser(userDb);
      }
    } catch (error) {
      console.error("Error fetching user data:", error);
    }
  };

  useEffect(() => {
    fetchUser();
  }, [userU?.uid]);

  if (!userU) {
    return <div>Loading...</div>;
  }

  if (!user) {
    return <div>Loading...</div>;
  }

  return (
    <div className="bg-gray-900 p-6 text-gray-200">
      <div className="mx-auto max-w-4xl rounded-lg bg-gray-800 p-6 shadow-md">
        <div className="mb-6 flex items-center justify-between">
        <div className="mb-4 flex items-center gap-4">
                <UserProfilePicture
                  user={user}
                  size="large" // Display larger profile picture
                  hoverDetails={true} // Show hover details
                />
                <div>
                  <h3
                    className="w-fit text-nowrap text-lg font-bold text-white"
                    style={{
                      whiteSpace: "nowrap",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      maxWidth: "200px", // Adjust this to your desired max width
                    }}
                  >
                    {user.displayName}
                  </h3>
                  {user.profile.location && (
                    <p className="text-sm text-gray-400">
                      {user.profile.location}
                    </p>
                  )}
                </div>
              </div>
          <div className="flex flex-col items-end">
            <button className="rounded-lg bg-blue-600 px-4 py-2 text-white hover:bg-blue-700">
              Edit Profile
            </button>
            <span className="mt-2 text-sm text-gray-400">
              KU Leuven Department of Computer Science
            </span>
          </div>
        </div>
        <div className="mb-6 text-center">
          <h1 className="text-2xl font-semibold">{user.displayName}</h1>
          <p className="text-lg text-yellow-400">
            ⭐ {user.stats.averageRating.toFixed(1)} ({user.stats.completedGigs}{" "}
            reviews)
          </p>
        </div>
        <div className="mb-6 rounded-lg bg-gray-700 p-4">
          <h2 className="mb-2 text-xl font-semibold">Amelia Earhart</h2>
          <p className="text-sm text-gray-300">{user.profile.location}</p>
          <p className="mt-3 text-gray-400">{user.profile.bio}</p>
        </div>
        <div className="rounded-lg bg-gray-700 p-4">
          <h2 className="mb-2 text-xl font-semibold">Degree and Skills</h2>
          <p className="text-sm text-gray-300">
            Bachelor of Computer Science – Third Year
          </p>
          <p className="mt-3 text-gray-400">
            Python, Java, C++, HTML, CSS, JavaScript, SQL, software development,
            object-oriented programming, web development, databases, algorithms,
            data structures, problem-solving, teamwork, computer networks,
            software engineering principles.
          </p>
          <p className="mt-3 text-gray-400">Dutch, English, French</p>
        </div>
      </div>
    </div>
  );
}
