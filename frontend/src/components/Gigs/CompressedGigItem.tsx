import Label from "../Common/Label"; // Custom Label
import UserProfilePicture from "../Avatar/UserProfilePicture"; // UserProfilePicture component
import { Gig, User } from "@/utils/database/schema"; // Import updated interfaces
import { Badge } from "flowbite-react";

export type GigItemBaseProps = {
  gig: Gig; // Use the Gig interface
  lister: User; // Include the user who listed the gig
  isCompressed?: boolean; // Flag to toggle between views
};

function CompressedGigItem({
  gig,
  lister,
  isCompressed = true,
}: GigItemBaseProps) {
  const { title, description, category, price, dueDate, status } = gig;

  return (
    <div
      className={`p-3 ${isCompressed ? "bg-transparent" : "bg-gray-800"} flex w-full items-start space-x-3 rounded-lg`}
    >
      {/* User Profile Picture */}
      <UserProfilePicture user={lister} size="medium" rounded={true} />

      <div className="flex w-full flex-1 flex-col">
        <div className="flex w-full flex-row items-start justify-end space-x-2">
          <div className="flex w-full flex-col text-left">
            <h2 className="line-clamp-2 text-sm font-medium text-on-surface">
              {title}
            </h2>
            <span className="text-xs text-on-surface-variant">
              {dueDate.toDate().toLocaleDateString()}{" "}
              {/* Convert Timestamp to readable date */}
            </span>
          </div>
          {isCompressed && (
            <Badge color="secondary-container" className="ml-auto">
              {category}
            </Badge>
          )}
        </div>

        {!isCompressed && description && (
          <p className="mt-1 text-left text-xs text-gray-300">{description}</p>
        )}

        {!isCompressed && (
          <div className="mt-2 flex space-x-2">
            <Label text={category} />
            <Label text={`$${price.toFixed(2)}`} />
            <Label text={`Status: ${status}`} />
          </div>
        )}
      </div>
    </div>
  );
}

export default CompressedGigItem;
