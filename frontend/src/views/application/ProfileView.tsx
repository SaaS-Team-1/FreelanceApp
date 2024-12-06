import { useUser, useFirestore } from "@/utils/reactfire";
import { User } from "@/utils/database/schema";
import { useEffect, useState } from "react";
import { collection, query, where, getDocs } from "firebase/firestore";
import UserProfilePicture from "@/components/Avatar/UserProfilePicture";
import EditProfileModal from "@/components/Profile/EditProfileModal";

export default function ProfileView() {
  const { data: userU } = useUser();
  const db = useFirestore();
  const [user, setUser] = useState<User | null>(null);
  const [showModal, setShowModal] = useState(false);

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

  const handleUpdateProfile = (updatedUser: any) => {
    // Update the local state with the updated user data
    setUser(updatedUser);
  };

  if (!userU) {
    return <div>Loading...</div>;
  }

  if (!user) {
    return <div>Loading...</div>;
  }

  return (
    <div className="scrollbar mx-auto flex h-screen w-3/5 flex-col items-center space-y-10 overflow-y-scroll py-10 lg:overflow-y-hidden">
      <div className="flex items-center justify-center space-x-6 lg:w-full">
        <div className="justify-self-end rounded-lg bg-gray-800 p-4 shadow-md min-w-full">
          <div className="mb-4 flex items-center justify-between gap-6">
            <div className="flex flex-row items-center gap-6">
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
                <p className="text-lg text-yellow-400">
                  ⭐ {user.stats.averageRating.toFixed(1)} (
                  {user.stats.completedGigs} reviews)
                </p>
              </div>
            </div>
            <div className="flex flex-col items-end">
              <button
                onClick={() => setShowModal(true)}
                className="rounded-lg bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
              >
                Edit Profile
              </button>
              <span className="mt-2 text-sm text-gray-400">{user.profile.faculty}</span>
            </div>
          </div>
          <div className="p-6">
            <h2 className="mb-2 text-xl font-semibold text-white">
              {user.displayName}
            </h2>
            <p className="text-sm text-gray-300">{user.profile.location}</p>
            <p className="mt-3 text-gray-400">{user.profile.bio}</p>
          </div>
          <hr className="my-4 border-gray-700" />
          <div className="p-6">
            <h2 className="mb-2 text-xl font-semibold text-white">
              Degree and Skills
            </h2>
            <p className="text-sm text-gray-300">{user.profile.degree}</p>
            <p className="mt-3 text-gray-400">{user.profile.skills}</p>
            <p className="mt-3 text-gray-400">{user.profile.languages}</p>
          </div>
        </div>
      </div>
      {showModal && (
        <EditProfileModal
          onClose={() => setShowModal(false)}
          onUpdate={handleUpdateProfile}
          initialUserData={user}
        />
      )}
    </div>
  );
}
