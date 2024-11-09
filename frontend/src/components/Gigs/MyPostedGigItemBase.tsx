// src/components/Gigs/MyPostedGigItemBase.tsx
import React from "react";
// import Avatar from "../Avatar/Avatar"; // Custom Avatar
import Label from "../Common/Label"; // Custom Label
import UserProfilePicture from "../Avatar/UserProfilePicture"; // New UserProfilePicture import

export type MyPostedGigItemBaseProps = {
  title: string;
  dateRange: string;
  category: string;
  avatarUrl: string;
  description?: string;
  location?: string;
  price?: string;
  isCompressed?: boolean; // Flag to toggle between views
};

// the data below is only give some dummy values to the profilepicture atm
const mockUserData = {
  name: "John Doe",
  title: "Graphic Designer",
  location: "San Francisco, CA",
  profilePicture: "", // Placeholder image URL
};

const MyPostedGigItemBase: React.FC<MyPostedGigItemBaseProps> = ({
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
      className={`p-4 ${isCompressed ? "bg-gray-900" : "bg-teal-900"} rounded-xl shadow-lg ${
        isCompressed ? "space-y-0" : "space-y-2"
      }`}
    >
      <div className="flex items-start space-x-4">
        {/* <Avatar image={avatarUrl} alt="User Avatar" /> */}
        <UserProfilePicture
          user={{
            profilePicture: mockUserData.profilePicture,
            name: mockUserData.name,
          }}
          size="medium"
          rounded={true}
        />

        <div className="flex flex-col text-left">
          <h2 className="text-white font-semibold text-lg">{title}</h2>
          <p className="text-gray-400 text-sm">{dateRange}</p>
          {!isCompressed && description && (
            <p className="text-gray-200 text-sm mt-1">{description}</p>
          )}
          {!isCompressed && (
            <div className="flex space-x-3 mt-2"> {/* Align labels to the text */}
              <Label text={category} />
              <Label text={location} />
              <Label text={price} />
            </div>
          )}
        </div>
      </div>
      {isCompressed && (
        <div className="ml-4"> {/* Label positioned to the right when compressed */}
          <Label text={category} />
        </div>
      )}
    </div>
  );
};

export default MyPostedGigItemBase;
