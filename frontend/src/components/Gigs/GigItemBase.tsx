// /home/shusaku/projects/FreelanceApp/frontend/src/components/Gigs/GigItemBase.tsx
import React from "react";
import Label from "../Common/Label"; // Custom Label
import UserProfilePicture from "../Avatar/UserProfilePicture"; // New UserProfilePicture import
import { SeeMoreButton } from "../Buttons/SeemoreButton"; // Import the custom SeeMoreButton

export type GigItemBaseProps = {
  title: string;
  dateRange: string;
  category: string;
  avatarUrl: string;
  description?: string;
  location?: string;
  price?: string;
  isCompressed?: boolean; // Flag to toggle between views
};

// Dummy data for the profile picture
const mockUserData = {
  name: "John Doe",
  title: "Graphic Designer",
  location: "San Francisco, CA",
  profilePicture: "", // Placeholder image URL
};

const GigItemBase: React.FC<GigItemBaseProps> = ({
  title,
  dateRange,
  category,
  avatarUrl,
  description,
  location,
  price,
  isCompressed = false,
}) => {
  return (
    <div
      className={`p-4 rounded-xl shadow-lg ${
        isCompressed ? "space-y-0" : "space-y-2"
      } bg-slate-800 bg-opacity-80 text-white`} // Updated background styles
      style={{ fontFamily: "Inter, sans-serif" }} // Custom font style
    >
      <div className="flex items-start space-x-4">
        <UserProfilePicture
          user={{
            profilePicture: mockUserData.profilePicture,
            name: mockUserData.name,
          }}
          size="medium"
          rounded={true}
        />

        <div className="flex flex-col text-left">
          <h2 className="font-semibold text-lg">{title}</h2>
          <p className="text-gray-400 text-sm">{dateRange}</p>
          {!isCompressed && description && (
            <p className="text-gray-200 text-sm mt-1">{description}</p>
          )}
          {!isCompressed && (
            <div className="flex items-center justify-between mt-2">
              <div className="flex space-x-3">
                {/* Labels on the left */}
                <Label text={category} />
                <Label text={location} />
                <Label text={price} />
              </div>
              {/* See More button aligned to the right */}
              <SeeMoreButton />
            </div>
          )}
        </div>
      </div>
      {isCompressed && (
        <div className="ml-4">
          <Label text={category} />
        </div>
      )}
    </div>
  );
};

export default GigItemBase;
