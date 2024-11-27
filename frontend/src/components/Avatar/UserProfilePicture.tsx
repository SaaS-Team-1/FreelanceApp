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
}

const UserProfilePicture: React.FC<UserProfilePictureProps> = ({
  user,
  size = "medium",
  hoverDetails = false,
  rounded = true,
}) => {
  // Fallbacks for missing user data
  const displayName = user?.displayName || "Anonymous";
  const profilePicture = user?.profile?.picture || "/default-avatar.jpg"; // Default avatar
  const location = user?.profile?.location;
  const bio = user?.profile?.bio;
  const completedGigs = user?.stats?.completedGigs;
  const averageRating = user?.stats?.averageRating;

  return (
    <div className="relative group">
      {/* Profile Picture */}
      <div
        className={`${sizeClasses[size]} ${rounded ? "rounded-full" : "rounded-md"} 
        flex items-center justify-center overflow-hidden bg-gray-300`}
      >
        <img
          src={profilePicture}
          alt={displayName}
          className={`h-full w-full object-cover ${
            rounded ? "rounded-full" : "rounded-md"
          }`}
        />
      </div>

      {/* Hover Details */}
      {hoverDetails && (
        <div
          className="absolute z-10 invisible w-64 p-4 text-sm text-gray-800 transition-opacity 
          duration-200 bg-white border border-gray-200 rounded-lg shadow-lg opacity-0 
          group-hover:opacity-100 group-hover:visible dark:text-gray-300 dark:bg-gray-800 dark:border-gray-600"
        >
          <div className="flex items-center mb-3">
            <img
              src={profilePicture}
              alt={displayName}
              className="w-10 h-10 rounded-full object-cover border border-gray-200 dark:border-gray-700"
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
              <p className="text-sm text-gray-600 dark:text-gray-400 italic">
                {bio}
              </p>
            )}
          </div>
          <ul className="space-y-2 text-sm">
            {completedGigs !== undefined && (
              <li className="flex items-center">
                <span className="text-blue-500 mr-2">🏆</span>
                <span>
                  <strong>Completed Gigs:</strong> {completedGigs}
                </span>
              </li>
            )}
            {averageRating !== undefined && (
              <li className="flex items-center">
                <span className="text-yellow-500 mr-2">⭐</span>
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
