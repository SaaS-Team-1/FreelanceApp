import React from "react";
import { User } from "@/utils/database/schema";

interface UserLevelDisplayProps {
  user: User; // Pass the entire user object
  size?: "small" | "medium" | "large"; // Optional size prop
}

const UserLevelDisplay: React.FC<UserLevelDisplayProps> = ({ user, size = "medium" }) => {
  // Function to calculate the user level
  const calculateUserLevel = (completedGigs: number): number => {
    if (completedGigs >= 15) return 5;
    if (completedGigs >= 10) return 4;
    if (completedGigs >= 6) return 3;
    if (completedGigs >= 3) return 2;
    return 1;
  };

  // Function to determine the border color based on the level
  const getLevelBorderColor = (level: number): string => {
    switch (level) {
      case 5:
        return "border-purple-500"; // Expert Level
      case 4:
        return "border-blue-500"; // Pro Level
      case 3:
        return "border-green-500"; // Intermediate Level
      case 2:
        return "border-yellow-500"; // Novice Level
      default:
        return "border-red-500"; // Beginner Level
    }
  };

  // Define size styles for the circle
  const sizeStyles = {
    small: "h-6 w-6 text-xs border-2", // Smaller size
    medium: "h-8 w-8 text-sm border-4", // Default size
    large: "h-12 w-12 text-lg border-4", // Larger size
  };

  const userLevel = calculateUserLevel(user.completedGigs);
  const levelBorderColor = getLevelBorderColor(userLevel);

  return (
    <div
      className={`flex items-center justify-center rounded-full font-bold text-white ${sizeStyles[size]} ${levelBorderColor}`}
    >
      {userLevel}
    </div>
  );
};

export default UserLevelDisplay;


