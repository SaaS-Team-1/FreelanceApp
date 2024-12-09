import { useUser, useFirestore } from "@/utils/reactfire";
import { User } from "@/utils/database/schema";
import { useEffect, useState } from "react";
import { collection, query, where, getDocs } from "firebase/firestore";
import UserProfilePicture from "@/components/Avatar/UserProfilePicture";
import EditProfileModal from "@/components/Profile/EditProfileModal";
import UserLevelDisplay from "@/components/Common/UserLevelDisplay";

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
    setUser(updatedUser);
  };

  if (!userU) {
    return <div>Loading...</div>;
  }

  if (!user) {
    return <div>Loading...</div>;
  }

  return (
    <div className="scrollbar mx-auto w-full max-w-5xl px-6 py-10">
      <div className="space-y-8">
        {/* Profile Header */}
        <div className="flex flex-col items-center rounded-lg bg-white shadow-lg p-6 md:flex-row md:items-start">
          <div className="flex-shrink-0">
            <UserProfilePicture
              user={user}
              size="large" // Larger profile picture
              hoverDetails={false} // Disable hover details for cleaner look
            />
          </div>
          <div className="mt-4 md:mt-0 md:ml-6 flex-1">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold text-gray-800">
                  {user.displayName}
                </h1>
                {user.profile.location && (
                  <p className="mt-1 text-sm text-gray-500">
                    {user.profile.location}
                  </p>
                )}
              </div>
              <button
                onClick={() => setShowModal(true)}
                className="rounded-lg bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
              >
                Edit Profile
              </button>
            </div>
            <UserLevelDisplay user={user} size="medium" />
            {user.profile.faculty && (
              <p className="mt-2 text-sm text-slate-500">
                Faculty: {user.profile.faculty}
              </p>
            )}
          </div>
        </div>

        {/* About Section */}
        <div className="rounded-lg bg-white shadow-lg p-6">
          <h2 className="text-xl font-semibold text-gray-800">About Me</h2>
          <p className="mt-3 text-slate-600">{user.profile.bio}</p>
        </div>

        {/* Degree and Skills Section */}
        <div className="rounded-lg bg-white shadow-lg p-6">
          <h2 className="text-xl font-semibold text-gray-800">
            Degree and Skills
          </h2>
          {user.profile.degree && (
            <p className="mt-3 text-slate-600">
              <span className="font-medium text-slate-700">Degree:</span>{" "}
              {user.profile.degree}
            </p>
          )}
          {user.profile.skills && (
            <p className="mt-3 text-slate-600">
              <span className="font-medium text-slate-700">Skills:</span>{" "}
              {user.profile.skills}
            </p>
          )}
          {user.profile.languages && (
            <p className="mt-3 text-slate-600">
              <span className="font-medium text-slate-700">Languages:</span>{" "}
              {user.profile.languages}
            </p>
          )}
        </div>
      </div>

      {/* Edit Modal */}
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
