import React from "react";
import UserProfilePicture from "@/components/Avatar/UserProfilePicture";
import Badge from "@/components/Buttons/CustomBadge";
import { use } from "chai";

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
    <div className="flex w-full items-center justify-between border-b border-gray-700 bg-gray-800 p-4 text-white">
      <div className="flex items-center gap-4">
        <UserProfilePicture
          user={{
            displayName: user.name,
            profile: {
              picture: user.profilePicture || "/default-avatar.jpg",
              bio: user.bio || "No bio available",
              location: user.location || "Uknown location",
            },

            completedGigs: user.completedGigs || 0,
            averageRating: user.averageRating || 0,
     
          }}
          size="medium"
          hoverDetails={true}
        />
        <div>
          <span className="text-lg font-semibold text-blue-400">
            {user.name}
          </span>
          <span
            className="block cursor-pointer text-sm text-orange-500 underline"
            onClick={onSeeGigDetails}
          >
            See gig details
          </span>
        </div>
      </div>
      <div className="font-bold"> {isLister ? 'Gig Status:  ' : 'Application Status:  '} 
      <Badge
        label={
           `${status}` 
        }
        color={isLister ? "secondary" : "primary"}
        textColor="white"
        size="small"
      />
      </div>
    </div>
  );
};

export default ChatHeader;
