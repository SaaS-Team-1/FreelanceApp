import React, { useState } from "react";
import { User } from "@/utils/database/schema";
import { Timestamp, doc, updateDoc } from "firebase/firestore";
import CustomButton from "@/components/Buttons/CustomButton";
import { useFirestore, useUser } from "@/utils/reactfire";

interface EditProfileModalProps {
  onClose: () => void;
  onUpdate: (updatedUser: User) => void; // Callback for when the profile is updated
  initialUserData: User; // Preloaded user data
}

const EditProfileModal: React.FC<EditProfileModalProps> = ({
  onClose,
  onUpdate,
  initialUserData,
}) => {
  const db = useFirestore(); // Firestore instance
  const { data: user } = useUser();

  const [updatedUser, setUpdatedUser] = useState<User>({
    ...initialUserData,
  });

  const validateProfile = (user: User) => {
    const errors: string[] = [];

    if (!user.displayName.trim()) errors.push("Display Name is required.");
    if (!user.email.trim() || !/^\S+@\S+\.\S+$/.test(user.email))
      errors.push("A valid email is required.");
    if (!user.profile.bio.trim())
      errors.push("Bio is required and cannot be empty.");
    if (!user.profile.location.trim())
      errors.push("Location is required.");
    if (!user.profile.picture?.trim())
      errors.push("Profile picture URL is required.");

    return errors;
  };

  const handleSave = async () => {
    const errors = validateProfile(updatedUser);
    if (errors.length > 0) {
      alert(`Please fix the following errors:\n- ${errors.join("\n- ")}`);
      return;
    }

    try {
      // Update user in Firestore
      const userDocRef = doc(db, "users", updatedUser.userId);
      const updatedData = {
        ...updatedUser,
        updatedAt: Timestamp.now(),
      };

      await updateDoc(userDocRef, updatedData);

      // Pass updated user data back to the parent component
      onUpdate(updatedUser);
      alert("Profile successfully updated.");
      onClose();
    } catch (error) {
      console.error("Error updating profile:", error);
      alert("There was an error updating the profile. Please try again.");
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm">
      <div className="w-[800px] max-w-full rounded-lg bg-gray-900 p-6 text-white shadow-lg">
        <h2 className="mb-4 text-3xl font-bold">Edit Profile</h2>
        <div className="space-y-4">
          {/* Display Name Input */}
          <div>
            <label className="mb-2 block text-sm font-bold">Display Name</label>
            <input
              type="text"
              value={updatedUser.displayName}
              onChange={(e) =>
                setUpdatedUser({ ...updatedUser, displayName: e.target.value })
              }
              className="w-full rounded border-gray-700 bg-gray-800 p-2 text-white"
            />
          </div>
          {/* Email Input */}
          <div>
            <label className="mb-2 block text-sm font-bold">Email</label>
            <input
              type="email"
              value={updatedUser.email}
              onChange={(e) =>
                setUpdatedUser({ ...updatedUser, email: e.target.value })
              }
              className="w-full rounded border-gray-700 bg-gray-800 p-2 text-white"
            />
          </div>
          {/* Bio Input */}
          <div>
            <label className="mb-2 block text-sm font-bold">Bio</label>
            <textarea
              value={updatedUser.profile.bio}
              onChange={(e) =>
                setUpdatedUser({
                  ...updatedUser,
                  profile: { ...updatedUser.profile, bio: e.target.value },
                })
              }
              className="h-40 w-full rounded border-gray-700 bg-gray-800 p-2 text-white"
            />
          </div>
          {/* Location Input */}
          <div>
            <label className="mb-2 block text-sm font-bold">Location</label>
            <input
              type="text"
              value={updatedUser.profile.location}
              onChange={(e) =>
                setUpdatedUser({
                  ...updatedUser,
                  profile: { ...updatedUser.profile, location: e.target.value },
                })
              }
              className="w-full rounded border-gray-700 bg-gray-800 p-2 text-white"
            />
          </div>
          {/* Profile Picture Input */}
          <div>
            <label className="mb-2 block text-sm font-bold">
              Profile Picture URL
            </label>
            <input
              type="text"
              value={updatedUser.profile.picture}
              onChange={(e) =>
                setUpdatedUser({
                  ...updatedUser,
                  profile: { ...updatedUser.profile, picture: e.target.value },
                })
              }
              className="w-full rounded border-gray-700 bg-gray-800 p-2 text-white"
            />
          </div>
          {/* Credits Input */}
          <div>
            <label className="mb-2 block text-sm font-bold">Credits</label>
            <input
              type="number"
              value={updatedUser.profile.credits}
              onChange={(e) =>
                setUpdatedUser({
                  ...updatedUser,
                  profile: {
                    ...updatedUser.profile,
                    credits: Number(e.target.value),
                  },
                })
              }
              className="w-full rounded border-gray-700 bg-gray-800 p-2 text-white"
            />
          </div>
        </div>
        {/* Buttons */}
        <div className="mt-6 flex justify-end gap-4">
          <CustomButton
            label="Cancel"
            onClick={onClose}
            color="white"
            textColor="primary"
            size="small"
            outline={true}
            rounded={true}
            customStyle={{ borderColor: "#44B0E8" }}
          />
          <CustomButton
            label="Save Changes"
            onClick={handleSave}
            color="primary"
            textColor="white"
            size="small"
            rounded={true}
          />
        </div>
      </div>
    </div>
  );
};

export default EditProfileModal;
