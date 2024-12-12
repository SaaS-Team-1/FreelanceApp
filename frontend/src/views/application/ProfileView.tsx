import { useUser, useFirestore } from "@/utils/reactfire";
import { User } from "@/utils/database/schema";
import { useEffect, useState } from "react";
import { collection, query, where, getDocs } from "firebase/firestore";
import UserProfilePicture from "@/components/Avatar/UserProfilePicture";
import EditProfileModal from "@/components/Profile/EditProfileModal";
import UserLevelDisplay from "@/components/Common/UserLevelDisplay";
import { Button } from "flowbite-react";

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
        <div className="flex flex-col items-center rounded-xl bg-surface-container p-4 md:flex-row  md:items-start lg:p-6">
          <div className="shrink-0">
            <UserProfilePicture
              user={user}
              size="large" // Larger profile picture
              hoverDetails={false} // Disable hover details for cleaner look
            />
          </div>
          <div className="mt-4 w-full flex-1 sm:max-w-[60vw] md:ml-6 md:mt-0">
            <div className="flex w-full flex-col items-center justify-between rounded-xl bg-primary-container p-2">
              <div className="flex w-full justify-between">
                <h1 className="w-fit text-nowrap text-2xl font-bold ">
                  {user.displayName}
                </h1>
                <div className="w-fit justify-self-end">
                  <UserLevelDisplay user={user} size="medium" />
                </div>
              </div>
              <div className="mt-4 flex w-full flex-row items-center justify-between">
                {user.profile.location && (
                  <p className="text-sm ">
                    {user.profile.location}
                    <br />
                    {user.profile.faculty && (
                      <>Faculty: {user.profile.faculty}</>
                    )}
                  </p>
                )}
                <Button
                  onClick={() => setShowModal(true)}
                  color="primary"
                  size="sm"
                  className="self-end rounded-xl"
                >
                  Edit Profile
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* About Section */}
        <div className="rounded-xl bg-surface-container p-4">
          <h2 className="text-xl font-semibold">About Me</h2>
          <p className="mt-3 w-full rounded-xl bg-surface-dim p-2">
            {user.profile.bio}
          </p>
        </div>

        {/* Degree and Skills Section */}
        <div className="rounded-xl bg-surface-container p-4">
          <h2 className="text-xl font-semibold">Degree and Skills</h2>
          {user.profile.degree && (
            <p className="mt-3 w-full rounded-xl bg-secondary-container p-2 text-on-secondary-container">
              <span className="font-bold ">Degree:</span> {user.profile.degree}
            </p>
          )}
          {user.profile.skills && (
            <p className="mt-3 w-full rounded-xl bg-secondary-container p-2 text-on-secondary-container">
              <span className="font-bold">Skills:</span> {user.profile.skills}
            </p>
          )}
          {user.profile.languages && (
            <p className="mt-3 w-full rounded-xl bg-secondary-container  p-2 text-on-secondary-container">
              <span className="font-bold">Languages:</span>{" "}
              {user.profile.languages}
            </p>
          )}
        </div>
      </div>

      {/* Edit Modal */}
      <EditProfileModal
        onClose={() => setShowModal(false)}
        onUpdate={handleUpdateProfile}
        initialUserData={user}
        show={showModal}
      />
    </div>
  );
}
