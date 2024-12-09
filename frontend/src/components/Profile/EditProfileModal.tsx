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
    if (!user.profile.location.trim()) errors.push("Location is required.");
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
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-30 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="scrollbar w-[800px] max-w-full rounded-lg bg-white shadow-lg max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="sticky top-0 z-10 flex justify-between items-center p-4 border-b bg-white shadow-sm">
          <h2 className="text-2xl font-semibold text-gray-800">Edit Profile</h2>
        </div>
        <div className="p-6 space-y-6">
          {/* Display Name Input */}
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">
              Display Name
            </label>
            <input
              type="text"
              value={updatedUser.displayName}
              onChange={(e) =>
                setUpdatedUser({ ...updatedUser, displayName: e.target.value })
              }
              className="w-full rounded border border-gray-300 bg-gray-100 p-2 text-gray-800"
            />
          </div>
          {/* Email Input */}
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">
              Email
            </label>
            <input
              type="email"
              value={updatedUser.email}
              onChange={(e) =>
                setUpdatedUser({ ...updatedUser, email: e.target.value })
              }
              className="w-full rounded border border-gray-300 bg-gray-100 p-2 text-gray-800"
            />
          </div>
          {/* Bio Input */}
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">
              Bio
            </label>
            <textarea
              value={updatedUser.profile.bio}
              onChange={(e) =>
                setUpdatedUser({
                  ...updatedUser,
                  profile: { ...updatedUser.profile, bio: e.target.value },
                })
              }
              className="h-40 w-full rounded border border-gray-300 bg-gray-100 p-2 text-gray-800"
            />
          </div>
          {/* Other Inputs */}
          {[
            { label: "Location", field: "location" },
            { label: "Profile Picture URL", field: "picture" },
            { label: "Credits", field: "credits", type: "number" },
            { label: "Degree", field: "degree" },
            { label: "Skills", field: "skills" },
            { label: "Languages", field: "languages" },
            { label: "Faculty", field: "faculty" },
          ].map(({ label, field, type = "text" }) => (
            <div key={field}>
              <label className="mb-1 block text-sm font-medium text-gray-700">
                {label}
              </label>
              <input
                type={type}
                value={updatedUser.profile[field] || ""}
                onChange={(e) =>
                  setUpdatedUser({
                    ...updatedUser,
                    profile: {
                      ...updatedUser.profile,
                      [field]: type === "number" ? Number(e.target.value) : e.target.value,
                    },
                  })
                }
                className="w-full rounded border border-gray-300 bg-gray-100 p-2 text-gray-800"
              />
            </div>
          ))}
        </div>
        {/* Buttons */}
        <div className="sticky bottom-0 flex items-center justify-end gap-4 border-t bg-white p-4">
          <CustomButton
            label="Cancel"
            onClick={onClose}
            color="white"
            textColor="primary"
            size="small"
            outline={true}
            rounded={false}
            customStyle={{ borderColor: "#44B0E8" }}
          />
          <CustomButton
            label="Save Changes"
            onClick={handleSave}
            color="primary"
            textColor="white"
            size="small"
            rounded={false}
          />
        </div>
      </div>
    </div>
  );
};

export default EditProfileModal;
