


import React from "react";
import UserProfilePicture from "@/components/Avatar/UserProfilePicture";
import Badge from "@/components/Buttons/CustomBadge";
import CustomButton from "@/components/Buttons/CustomButton";

interface ChatHeaderProps {
  user: {
    name: string;
    profilePicture: string;
  };
  status: string;
  onSeeGigDetails: () => void;
}

const ChatHeader: React.FC<ChatHeaderProps> = ({
  user,
  status,
  onSeeGigDetails,
}) => {
  return (
    <div className="w-4/5 flex items-center justify-between p-4 bg-gray-900 text-white border-b border-gray-700">
      <div className="flex items-center gap-3">
        <UserProfilePicture
          displayName={user.name}
          picture={user.profilePicture}
          size="medium"
          rounded
        />
        <span className="text-lg font-semibold text-blue-400">{user.name}</span>
      </div>
      <div className="flex items-center gap-4">
        <Badge
          label={`Status: ${status}`}
          color="secondary"
          textColor="white"
          size="small"
        />
        <CustomButton
          label="See Gig Details"
          onClick={onSeeGigDetails}
          color="primary"
          size="small"
        />
      </div>
    </div>
  );
};

export default ChatHeader;
