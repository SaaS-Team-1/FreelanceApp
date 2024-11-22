
// ChatHeader.tsx
import React from "react";
import UserProfilePicture from "@/components/Avatar/UserProfilePicture";
import Badge from "@/components/Buttons/CustomBadge";

interface ChatHeaderProps {
  user: {
    name: string;
    profilePicture: string;
  };
  status: string; // Add a status prop for the badge label
}

const ChatHeader: React.FC<ChatHeaderProps> = ({ user, status }) => {
  return (
    <div className="flex items-center justify-between p-4 bg-slate-700 text-white border-b border-gray-700">
      <div className="flex items-center gap-3">
        <UserProfilePicture user={user} size="medium" rounded />
        <span className="text-lg font-semibold text-blue-400">{user.name}</span>
      </div>
      
      {/* Status Badge */}
      <div className="flex items-center gap-1">
        <span className="text-gray-400">Status:</span>
        <Badge label={status} color="secondary" size="small" textColor="white" />
      </div>
    </div>
  );
};

export default ChatHeader;
