import React from "react";
import { User } from "@/utils/database/schema";

const sizeClasses = {
  small: "w-8 h-8 text-sm",
  medium: "w-12 h-12 text-md",
  large: "w-16 h-16 text-lg",
};

interface UserProfilePictureProps {
  user: User;
  size?: "small" | "medium" | "large";
  hoverDetails?: boolean;
  rounded?: boolean;
  position?: "above" | "default"; // Add position prop

}

const UserProfilePicture: React.FC<UserProfilePictureProps> = ({
  user,
  size = "medium",
  hoverDetails = false,
  rounded = true,
  position = "default", // Default position

}) => {
  // Fallbacks for missing user data
  const displayName = user?.displayName || "Anonymous";
  const profilePicture = user?.profile?.picture || "/default-avatar.jpg"; // Default avatar
  const location = user?.profile?.location;
  const bio = user?.profile?.bio;
  const completedGigs = user?.stats?.completedGigs;
  const averageRating = user?.stats?.averageRating;
  const hoverClass =
  position === "above"
    ? "bottom-full mb-3  "
    : "top-full mt-3 l ";
  return (
    <div className="group relative">
      {/* Profile Picture */}
      <div
        className={`${sizeClasses[size]} ${rounded ? "rounded-full" : "rounded-md"} 
        flex items-center justify-center overflow-hidden bg-gray-300`}
      >
        <img
          src={profilePicture}
          alt={displayName}
          className={`size-full object-cover ${
            rounded ? "rounded-full" : "rounded-md"
          }`}
        />
      </div>

      {/* Hover Details */}
      {hoverDetails && (
        <div
          className={`invisible absolute z-10 w-64 rounded-lg border border-gray-200 bg-white 
          p-4 text-sm text-gray-800 opacity-0 shadow-lg transition-opacity duration-200 
          group-hover:visible group-hover:opacity-100 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-300 ${hoverClass}`}
        >
          <div className="mb-3 flex items-center">
            <img
              src={profilePicture}
              alt={displayName}
              className="size-10 rounded-full border border-gray-200 object-cover dark:border-gray-700"
            />
            <div className="ml-3">
              <p className="text-base font-semibold text-gray-900 dark:text-white">
                {displayName}
              </p>
              {location && (
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  {location}
                </p>
              )}
            </div>
          </div>
          <div className="mb-3">
            {bio && (
              <p className="text-sm italic text-gray-600 dark:text-gray-400">
                {bio}
              </p>
            )}
          </div>
          <ul className="space-y-2 text-sm">
            {completedGigs !== undefined && (
              <li className="flex items-center">
                <span className="mr-2 text-blue-500">🏆</span>
                <span>
                  <strong>Completed Gigs:</strong> {completedGigs}
                </span>
              </li>
            )}
            {averageRating !== undefined && (
              <li className="flex items-center">
                <span className="mr-2 text-yellow-500">⭐</span>
                <span>
                  <strong>Average Rating:</strong> {averageRating.toFixed(1)}
                </span>
              </li>
            )}
          </ul>
        </div>
      )}
    </div>
  );
};

export default UserProfilePicture;
