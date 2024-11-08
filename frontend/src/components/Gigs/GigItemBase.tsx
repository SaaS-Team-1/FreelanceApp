// src/components/Gigs/GigItemBase.tsxGigItemBase
import React from "react";
import Label from "../Common/Label"; // Custom Label
import UserProfilePicture from "../Avatar/UserProfilePicture"; // UserProfilePicture component

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
      className={`p-3 ${isCompressed ? "bg-transparent" : "bg-gray-800"} rounded-lg shadow-md flex items-start space-x-3`}
    >
      {/* Smaller Profile Picture for a more compact look */}
      <UserProfilePicture
        user={{
          profilePicture: avatarUrl || "",
          name: title, // Use title for fallback initials if no picture
        }}
        size="medium" // Use smaller size
        rounded={true}
      />

      <div className="flex-1 flex flex-col">
        <div className="flex items-start justify-between">
          <div className="flex flex-col text-left">
            <h2 className="text-white font-medium text-sm">{title}</h2>
            <span className="text-xs text-gray-400">{dateRange}</span>
          </div>
          {isCompressed && <Label text={category} />} {/* Label aligned to the right */}
        </div>

        {!isCompressed && description && (
          <p className="text-gray-300 text-xs mt-1 text-left">{description}</p>
        )}

        {!isCompressed && (
          <div className="flex space-x-2 mt-2">
            <Label text={category} />
            {location && <Label text={location} />}
            {price && <Label text={price} />}
          </div>
        )}
      </div>
    </div>
  );
};

export default GigItemBase;