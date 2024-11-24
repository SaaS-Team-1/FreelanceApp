import React from "react";
import { User, Gig } from "@/utils/database/schema";
import { FaDollarSign, FaCalendarAlt, FaMapMarkerAlt } from "react-icons/fa";
import Badge from "@/components/Buttons/CustomBadge";

interface GigDetailsModalProps {
  gig: Gig;
  lister: User | null; // Lister details
  onClose: () => void; // Close modal function
}

const GigDetailsModal: React.FC<GigDetailsModalProps> = ({
  gig,
  lister,
  onClose,
}) => {
  const location = gig.location || lister?.profile?.location || "Remote";

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50"
      onClick={onClose} // Close modal when clicking outside
    >
      <div
        className="relative max-w-lg w-full bg-gray-900 p-6 rounded-lg shadow-lg"
        onClick={(e) => e.stopPropagation()} // Prevent closing when clicking inside
      >
        {/* Modal Header */}
        <div className="mb-6 flex items-center justify-between">
          <h1 className="text-2xl font-bold text-white sm:text-3xl">
            Gig Details
          </h1>
        </div>

        {/* Status Badge */}
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
                : "gray"
            }
            textColor="white"
            rounded={true}
            size="small"
          />
        </div>

        {/* Gig Title and Image */}
        <div className="mb-4 flex items-start">
          <div className="mr-4 size-12 overflow-hidden rounded-full bg-gray-700">
            <img
              src={lister?.profile?.picture || "/default-profile.png"}
              alt="Lister Profile"
              className="size-full object-cover"
            />
          </div>
          <div>
            <h2 className="text-2xl font-semibold text-white">{gig.title}</h2>
            <p className="text-sm text-gray-300">
              <strong>Lister:</strong> {lister?.displayName || "Unknown"}
            </p>
          </div>
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
                {gig.dueDate
                  ? `${new Date(gig.dueDate.seconds * 1000).toLocaleDateString(
                      "en-GB"
                    )} at ${new Date(
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
    </div>
  );
};

export default GigDetailsModal;
