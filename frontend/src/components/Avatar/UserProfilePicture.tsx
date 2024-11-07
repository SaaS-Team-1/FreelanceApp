import React from "react";

interface User {
  profilePicture?: string;
  name: string;
}

interface UserProfilePictureProps {
  user: User;
  size?: "small" | "medium" | "large"; // Controls size of the component
  rounded?: boolean; // Controls if the picture should be rounded or not
}

const sizeClasses = {
  small: "w-8 h-8 text-sm",
  medium: "w-12 h-12 text-md",
  large: "w-16 h-16 text-lg",
};

const UserProfilePicture: React.FC<UserProfilePictureProps> = ({ user, size = "medium", rounded = true }) => {
  // Calculate initials from user's name
  const getInitials = (name: string) => {
    const initials = name.split(" ").map((word) => word[0]).join("");
    return initials.toUpperCase();
  };

  return (
    <div
      className={`${sizeClasses[size]} ${
        rounded ? "rounded-full" : "rounded-md"
      } bg-gray-300 flex items-center justify-center overflow-hidden`}
    >
      {user.profilePicture ? (
        // Display profile picture if available
        <img
          src={user.profilePicture}
          alt={user.name}
          className={`object-cover w-full h-full ${rounded ? "rounded-full" : "rounded-md"}`}
        />
      ) : (
        // Display initials if no profile picture is available
        <span className="text-white font-bold">
          {getInitials(user.name)}
        </span>
      )}
    </div>
  );
};

export default UserProfilePicture;
