import React, { useState, useEffect } from "react";
import { User, Gig } from "@/utils/database/schema";
import CustomButton from "@/components/Buttons/CustomButton"; // Import your button component
import Badge from "@/components/Buttons/CustomBadge"; // Import your badge component
import EditCreateGigModal from "./EditCreateGigModal"; // Import your modal component
import { FaPen, FaTrashAlt, FaDollarSign, FaCalendarAlt, FaMapMarkerAlt } from "react-icons/fa";

interface GigDetailsProps {
  gig: Gig;
  user: User | null; // Allow user to be nullable
  onEditSave: (updatedGig: Gig) => void;
  onDelete: () => void;
}

const GigDetails: React.FC<GigDetailsProps> = ({ gig, user, onEditSave, onDelete }) => {
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [currentGig, setCurrentGig] = useState<Gig>(gig);

  const location = gig.location || user?.profile?.location || "Remote";

  // Update currentGig whenever a new gig is selected
  useEffect(() => {
    setCurrentGig(gig);
  }, [gig]);

  const handleEditClick = () => {
    setIsEditModalOpen(true);
  };

  return (
    <div className="relative  rounded-lg bg-gray-900 p-4 shadow-lg">
      <div className="max-h-[400px] overflow-y-auto pr-4">
        {/* Header */}
        <div className="mb-4 flex items-center justify-between">
          <h1 className="text-2xl font-bold text-white sm:text-4xl">Gig Details</h1>
          <div className="flex flex-col gap-2">
            <CustomButton
              label="Edit"
              onClick={handleEditClick}
              color="primary"
              textColor="black"
              size="medium"
              rounded={true}
              icon={FaPen}
              iconPosition="left"
              customStyle={{ backgroundColor: "#44B0E8", padding: "6px 20px", width: "120px" }}
            />
            <CustomButton
              label="Delete"
              onClick={onDelete}
              color="primary"
              textColor="black"
              size="medium"
              rounded={true}
              icon={FaTrashAlt}
              iconPosition="left"
              customStyle={{ backgroundColor: "#44B0E8", padding: "6px 20px", width: "120px" }}
            />
          </div>
        </div>

        {/* Status */}
        <div className="mb-6 flex items-center">
          <p className="mr-2 text-sm text-white"><strong>Status:</strong></p>
          <Badge
            label={gig.status}
            color={gig.status === "open" ? "green" : gig.status === "in-progress" ? "secondary" : "gray"}
            textColor="white"
            rounded={true}
            size="small"
          />
        </div>

        {/* Gig Title and Image */}
        <div className="mb-4 flex items-start">
          <div className="mr-4 size-12 overflow-hidden rounded-full bg-gray-700">
            <img
              src={user?.profile?.picture || "/default-profile.png"}
              alt="Gig Profile"
              className="size-full object-cover"
            />
          </div>
          <h2 className="text-2xl font-semibold text-white">{gig.title}</h2>
        </div>

        {/* Description */}
        <p className="mb-2 text-sm font-bold text-white">Description:</p>
        <p className="mb-4 text-gray-300">{gig.description}</p>

        {/* Price, Due Date, and Location */}
        <div className="mb-6 flex flex-col justify-center gap-6 text-sm text-white sm:flex-row">
          <div className="flex flex-col items-center">
            <div className="flex items-center">
              <FaDollarSign className="mr-2" />
              <span>{gig.price ? `${gig.price} Tokens` : "TBD"}</span>
            </div>
            <span className="ml-4 text-xs text-gray-400">Price</span>
          </div>

          <div className="flex flex-col items-center">
            <div className="flex items-center">
              <FaCalendarAlt className="mr-2" />
              <span>
                {gig.dueDate ? new Date(gig.dueDate.seconds * 1000).toLocaleDateString() : "N/A"}
              </span>
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
              label={gig.category}
              color="beige"
              textColor="black"
              outline={true}
              outlineColor="beige"
              rounded={true}
              size="small"
            />
            <Badge
              label={location}
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

      {/* Edit Modal */}
      <EditCreateGigModal
        title="Edit Gig"
        gig={currentGig}
        isOpen={isEditModalOpen}
        onSave={(updatedGig) => {
          onEditSave(updatedGig);
          setIsEditModalOpen(false);
        }}
        onClose={() => setIsEditModalOpen(false)}
        mode="edit"
      />
    </div>
  );
};

export default GigDetails;
