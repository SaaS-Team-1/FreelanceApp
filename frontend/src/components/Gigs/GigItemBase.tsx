import React from "react";
import Label from "../Common/Label"; // Custom Label
import UserProfilePicture from "../Avatar/UserProfilePicture"; // UserProfilePicture component
import { Gig, User } from "@/utils/database/schema"; // Import updated interfaces

export type GigItemBaseProps = {
  gig: Gig; // Use the Gig interface
  lister: User; // Include the user who listed the gig
  isCompressed?: boolean; // Flag to toggle between views
};

const GigItemBase: React.FC<GigItemBaseProps> = ({ gig, lister, isCompressed = false }) => {
  const { title, description, category, price, dueDate, status } = gig;

  return (
    <div
      className={`p-3 ${isCompressed ? "bg-transparent" : "bg-gray-800"} rounded-lg flex items-start space-x-3`}
    >
      {/* User Profile Picture */}
      <UserProfilePicture
        user={lister}
        size="medium"
        rounded={true}
      />

      <div className="flex-1 flex flex-col">
        <div className="flex items-start justify-between">
          <div className="flex flex-col text-left">
            <h2 className="text-white font-medium text-sm">{title}</h2>
            <span className="text-xs text-gray-400">
              {dueDate.toDate().toLocaleDateString()} {/* Convert Timestamp to readable date */}
            </span>
          </div>
          {isCompressed && <Label text={category} />}
        </div>

        {!isCompressed && description && (
          <p className="text-gray-300 text-xs mt-1 text-left">{description}</p>
        )}

        {!isCompressed && (
          <div className="flex space-x-2 mt-2">
            <Label text={category} />
            <Label text={`$${price.toFixed(2)}`} />
            <Label text={`Status: ${status}`} />
          </div>
        )}
      </div>
    </div>
  );
};

export default GigItemBase;