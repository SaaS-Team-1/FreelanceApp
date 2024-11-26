
import React from "react";
import { User } from "@/utils/database/schema";

interface UserProfilePictureProps {
  user: {
    name: string;
    profilePicture: string;
    bio?: string;
    location?: string;
    completedGigs?: number;
    averageRating?: number;
  };
  size?: "small" | "medium" | "large";
  hoverDetails?: boolean;
  rounded?: boolean;
}

const sizeClasses = {
  small: "w-8 h-8 text-sm",
  medium: "w-12 h-12 text-md",
  large: "w-16 h-16 text-lg",
};

const UserProfilePicture: React.FC<UserProfilePictureProps> = ({
  user,
  size = "medium",
  hoverDetails = false,
  rounded = true,
}) => {
  return (
    <div className="relative group">
      <div
        className={`${sizeClasses[size]} ${rounded ? "rounded-full" : "rounded-md"} 
        flex items-center justify-center overflow-hidden bg-gray-300`}
      >
        {user.profilePicture ? (
          <img
            src={user.profilePicture}
            alt={user.name}
            className={`h-full w-full object-cover ${
              rounded ? "rounded-full" : "rounded-md"
            }`}
          />
        ) : (
          <span className="font-bold text-white">
            {user.name
              ?.split(" ")
              .map((word) => word[0])
              .join("")
              .toUpperCase()}
          </span>
        )}
      </div>

      {hoverDetails && (
        <div
          className="absolute z-10 invisible w-64 p-3 text-sm text-gray-700 transition-opacity 
          duration-200 bg-white border border-gray-200 rounded-lg shadow-lg opacity-0 
          group-hover:opacity-100 group-hover:visible dark:text-gray-300 dark:bg-gray-800 dark:border-gray-600"
        >
          <p className="font-semibold">{user.name}</p>
          {user.location && <p className="text-sm">Location: {user.location}</p>}
          {user.bio && <p className="text-sm">{user.bio}</p>}
          <ul className="text-sm">
            {user.completedGigs !== undefined && (
              <li>Completed Gigs: {user.completedGigs}</li>
            )}
            {user.averageRating !== undefined && (
              <li>Average Rating: {user.averageRating.toFixed(1)}</li>
            )}
          </ul>
        </div>
      )}
    </div>
  );
};

export default UserProfilePicture;
