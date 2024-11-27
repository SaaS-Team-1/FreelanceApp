
import React from "react";
import UserProfilePicture from "@/components/Avatar/UserProfilePicture";
import Badge from "@/components/Buttons/CustomBadge";

interface ChatHeaderProps {
  user: {
    name: string;
    profilePicture: string;
    bio?: string;
    location?: string;
    completedGigs?: number;
    averageRating?: number;
  };
  status: string; // Gig or application status
  onSeeGigDetails: () => void; // Function to open the gig details modal
  isLister: boolean; // Whether the current user is the lister
}
const ChatHeader: React.FC<ChatHeaderProps> = ({
  user,
  status,
  onSeeGigDetails,
  isLister,
}) => {
  return (
    <div className="w-full flex items-center justify-between p-4 bg-gray-800 text-white border-b border-gray-700">
      <div className="flex items-center gap-4">
        <UserProfilePicture
          user={{
            displayName: user.name,
            profile: {
              picture: user.profilePicture || "/default-avatar.jpg",
              bio: user.bio || "No bio available",
            },
            stats: {
              completedGigs: user.completedGigs || 0,
              averageRating: user.averageRating || 0,
            },
          }}
          size="medium"
          hoverDetails={true}
        />
        <div>
          <span className="text-lg font-semibold text-blue-400">
            {user.name}
          </span>
          <span
            className="block text-sm text-orange-500 underline cursor-pointer"
            onClick={onSeeGigDetails}
          >
            See gig details
          </span>
        </div>
      </div>
      <Badge
        label={isLister ? `Gig Status: ${status}` : `Application Status: ${status}`}
        color={isLister ? "secondary" : "primary"}
        textColor="white"
        size="small"
      />
    </div>
  );
};


export default ChatHeader;
