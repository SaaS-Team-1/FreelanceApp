import React from "react";
import { Gig, User } from "@/utils/database/schema"; // Import Gig and User interfaces
import Badge from "@/components/Buttons/CustomBadge"; // Import CustomBadge component
import CustomButton from "@/components/Buttons/CustomButton"; // Import CustomButton for Edit and Delete buttons
import { FaPen, FaTrashAlt, FaDollarSign, FaCalendarAlt, FaMapMarkerAlt } from "react-icons/fa"; // Import icons for price, due date, and location

interface GigDetailsProps {
  gig: Gig;
  user: User; // Pass the user object to access their location
  onEdit: () => void; // Callback for Edit
  onDelete: () => void; // Callback for Delete
}

function GigDetails({ gig, user, onEdit, onDelete }: GigDetailsProps) {
  const { title, description, price, dueDate, status, category } = gig;

  // Safely access location from user profile
  const location = user?.profile?.location || "Remote"; // Default to "Remote" if not available

  return (
    <div className="relative rounded-lg bg-gray-900 p-6 shadow-lg">
      {/* Edit and Delete Buttons - top right corner */}
      <div className="absolute right-4 top-4 flex flex-col gap-2">
        <CustomButton
          label="Edit"
          onClick={onEdit}
          color="primary"
          textColor="black"
          size="small"
          rounded={true}
          icon={FaPen}
          iconPosition="left"
          customStyle={{
            backgroundColor: "#44B0E8",
            padding: "4px 20px",
            width: "100px"
          }}
        />
        <CustomButton
          label="Delete"
          onClick={onDelete}
          color="primary"
          textColor="black"
          size="small"
          rounded={true}
          icon={FaTrashAlt}
          iconPosition="left"
          customStyle={{
            backgroundColor: "#44B0E8",
            padding: "4px 20px",
            width: "100px"
          }}
        />
      </div>

      {/* Main Header */}
      <h1 className="mb-4 text-2xl font-bold text-white sm:text-4xl">Gig Details</h1> {/* Adjusted size */}

      {/* Status Section */}
      <div className="mb-6 flex items-center">
        <p className="mr-2 text-sm text-white"><strong>Status:</strong></p>
        <Badge
          label={status}
          color={status === "open" ? "green" : status === "in-progress" ? "secondary" : "gray"}
          textColor="white"
          rounded={true}
          size="small"
        />
      </div>

      {/* Gig Title and Image */}
      <div className="mb-4 flex items-start">
        {/* Updated profile picture */}
        <div className="mr-4 size-12 overflow-hidden rounded-full bg-gray-700">
          <img
            src={user?.profile?.picture || "/default-profile.png"}
            alt="Gig Profile"
            className="size-full object-cover"
          />
        </div>
        <h2 className="text-2xl font-semibold text-white">{title}</h2>
      </div>

      {/* Description */}
      <p className="mb-2 text-sm font-bold text-white">Description:</p>
      <p className="mb-4 text-gray-300">{description}</p>

      {/* Responsive Price, Due Date, and Location with Icons */}
      <div className="mb-6 flex flex-col justify-center gap-6 text-sm text-white sm:flex-row">
        <div className="flex flex-col items-center">
          <div className="flex items-center">
            <FaDollarSign className="mr-2" />
            <span>{price ? `${price} Tokens` : "TBD"}</span>
          </div>
          <span className="ml-4 text-xs text-gray-400">Price</span>
        </div>

        <div className="flex flex-col items-center">
          <div className="flex items-center">
            <FaCalendarAlt className="mr-2" />
            <span>{dueDate ? dueDate.toDate().toLocaleDateString() : "N/A"}</span>
          </div>
          <span className="ml-2 text-xs text-gray-400">Due Date</span>
        </div>

        <div className="flex flex-col items-center">
          <div className="flex items-center">
            <FaMapMarkerAlt className="mr-2" />
            <span>{location}</span>
          </div>
          <span className="ml-6 text-xs text-gray-400">Location</span>
        </div>
      </div>

      {/* Tags */}
      <div>
        <h4 className="text-sm font-semibold text-gray-400">Tags:</h4>
        <div className="mt-2 flex gap-2">
          <Badge
            label={category}
            color="beige"
            textColor="black"
            outline={true}
            outlineColor="beige"
            rounded={true}
            size="small"
          />
          <Badge
            label={`${location}`}
            color="beige"
            textColor="black"
            outline={true}
            outlineColor="beige"
            rounded={true}
            size="small"
          />
        </div>
      </div>
    </div>
  );
}

export default GigDetails;
