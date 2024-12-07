import React from "react";
import { Gig, User } from "@/utils/database/schema";
import { FaDollarSign, FaCalendarAlt, FaMapMarkerAlt } from "react-icons/fa";
import Badge from "@/components/Buttons/CustomBadge";
import CustomButton from "@/components/Buttons/CustomButton";

interface GigDetailsModalProps {
  gig: Gig;
  lister: User | null;
  onClose: () => void;
  currentUserId: string;
  onGoToMyGigs: () => void;
  currentUser: User;
}

const GigDetailsModal: React.FC<GigDetailsModalProps> = ({
  gig,
  lister,
  onClose,
  currentUserId,
  onGoToMyGigs,
  currentUser,
}) => {
  const isCurrentUserLister = gig.listerId === currentUserId;

  if (gig.status === "deleted") {
    return (
      <div
        className="fixed inset-0 z-10 flex items-center justify-center bg-black bg-opacity-50"
        onClick={onClose}
      >
        <div
          className="relative w-full max-w-md rounded-lg bg-gray-900 p-6 shadow-lg"
          onClick={(e) => e.stopPropagation()}
        >
          <h1 className="text-center text-2xl font-bold text-white">
            Gig Deleted
          </h1>
          <div className="mt-6 flex justify-center">
            <CustomButton
              label="Close"
              onClick={onClose}
              color="secondary"
              size="medium"
            />
          </div>
        </div>
      </div>
    );
  }

  const userToDisplay = isCurrentUserLister
    ? currentUser
    : lister || {
        userId: "Unknown ID",
        email: "Unknown email",
        displayName: "Unknown User",
        profile: {
          bio: "No bio available",
          credits: 0,
          picture: "/default-avatar.jpg",
          location: "Unknown location",
        },
        completedGigs: 0,
        averageRating: 0,
      };

  const location = gig.location || userToDisplay.profile.location || "Remote";
  const dueDate =
    gig.dueDate &&
    new Date(gig.dueDate.seconds * 1000).toLocaleString("en-GB", {
      dateStyle: "short",
      timeStyle: "short",
    });

  return (
    <div
      className="fixed inset-0 z-10 flex items-center justify-center bg-black bg-opacity-50"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-lg rounded-lg bg-gray-900 p-10 shadow-lg"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="mb-6 flex items-center justify-between">
          <h1 className="text-2xl font-bold text-white">Gig Details</h1>
          <CustomButton
            label="Close"
            onClick={onClose}
            color="secondary"
            size="small"
          />
        </div>

        {/* Gig Title and Lister Info */}
        <div className="mb-4">
          <h2 className="text-2xl font-semibold text-white">{gig.title}</h2>
          <p className="text-sm text-gray-300">
            <strong>Lister:</strong>{" "}
            {isCurrentUserLister ? "You" : userToDisplay.displayName}
          </p>
        </div>

        {/* Description */}
        <p className="mb-2 text-sm font-bold text-white">Description:</p>
        <p className="mb-4 text-gray-300">{gig.description}</p>

        {/* Gig Details */}
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
              <span>{dueDate || "N/A"}</span>
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
        <div className="mb-4">
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

        {/* "Go to My Gigs" Button for Lister */}
        {isCurrentUserLister && (
          <div className="mt-6 flex justify-end">
            <CustomButton
              label="Go to My Gigs"
              onClick={onGoToMyGigs}
              color="primary"
              size="medium"
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default GigDetailsModal;
