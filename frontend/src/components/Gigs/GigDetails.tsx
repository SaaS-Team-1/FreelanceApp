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
  showEdit?: boolean; // Optional prop to show/hide Edit button
  showDelete?: boolean; // Optional prop to show/hide Delete button
}

const GigDetails: React.FC<GigDetailsProps> = ({
  gig,
  user,
  onEditSave,
  onDelete,
  showEdit = true, // Default to show the Edit button
  showDelete = true, // Default to show the Delete button
}) => {
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false); // Modal state for "See More"
  const [currentGig, setCurrentGig] = useState<Gig>(gig);

  const location = gig.location || user?.profile?.location || "Remote";

  // Update currentGig whenever a new gig is selected
  useEffect(() => {
    setCurrentGig(gig);
  }, [gig]);

  const renderDeleteButton = () => (
    <CustomButton
      label="Delete"
      onClick={onDelete}
      disabled={gig.status !== "open"}
      color={gig.status === "open" ? "primary" : "gray"}
      textColor={gig.status === "open" ? "black" : "white"}
      size="medium"
      rounded={true}
      icon={FaTrashAlt}
      iconPosition="left"
      customStyle={{
        backgroundColor: gig.status === "open" ? "#44B0E8" : "#b0b0b0",
        padding: "6px 20px",
        width: "120px",
      }}
    />
  );

  const renderGigDetails = (isModal: boolean = false) => (
    <div className={isModal ? "pr-4" : "max-h-[600px] overflow-auto pr-4"}>
      <div className="mb-1 flex items-center justify-between">
        <h1 className="text-2xl font-bold text-white sm:text-4xl">Gig Details</h1>
        <div className="flex flex-col gap-2">
          {showEdit && (
            <CustomButton
              label="Edit"
              onClick={() => {
                setIsEditModalOpen(true);
                setIsDetailModalOpen(false); // Close Gig Details Modal
              }}
              color="primary"
              textColor="black"
              size="medium"
              rounded={true}
              icon={FaPen}
              iconPosition="left"
              customStyle={{
                backgroundColor: "#44B0E8",
                padding: "6px 20px",
                width: "120px",
              }}
            />
          )}
          {renderDeleteButton()}
        </div>
      </div>

      <div className="mb-6 flex items-center">
        <p className="mr-2 text-sm text-white">
          <strong>Status:</strong>
        </p>
        <Badge
          label={gig.status}
          color={
            gig.status === "open"
              ? "green"
              : gig.status === "in-progress"
              ? "secondary"
              : gig.status === "awaiting-confirmation"
              ? "warning"
              : "gray"
          }
          textColor="white"
          rounded={true}
          size="small"
        />
      </div>

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

      <p className="mb-2 text-sm font-bold text-white">Description:</p>
      <p className="mb-4 text-gray-300">{gig.description}</p>

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
              {gig.dueDate
                ? `${new Date(gig.dueDate.seconds * 1000).toLocaleDateString("en-GB")} at ${new Date(
                    gig.dueDate.seconds * 1000
                  ).toLocaleTimeString("en-GB", {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}`
                : "N/A"}
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
          <Badge
            label={`${gig.price ? `${gig.price} Tokens` : "TBD"}`}
            color="beige"
            textColor="black"
            outline={true}
            outlineColor="beige"
            rounded={true}
            size="small"
          />
        </div>
      </div>

      {!isModal && (
        <div className="mt-4 flex justify-end">
          <CustomButton
            label="See More"
            onClick={() => setIsDetailModalOpen(true)}
            color="primary"
            textColor="black"
            size="medium"
            rounded={true}
          />
        </div>
      )}
    </div>
  );

  return (
    <div className="relative">
      <div className={`rounded-lg bg-gray-900 p-4 shadow-lg ${isDetailModalOpen ? "blur-sm" : ""}`}>
        {renderGigDetails()}
      </div>

      {isEditModalOpen && (
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
      )}

      {isDetailModalOpen && (
        <>
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm"></div>
          <div className="fixed inset-0 z-50 flex items-center justify-center">
            <div className="w-3/4 max-w-4xl overflow-hidden rounded-lg bg-gray-800 p-8">
              {renderGigDetails(true)}
              <div className="mt-4 flex justify-end">
                <CustomButton
                  label="Close"
                  onClick={() => setIsDetailModalOpen(false)}
                  color="red"
                  textColor="black"
                  size="medium"
                  rounded={true}
                />
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default GigDetails;
