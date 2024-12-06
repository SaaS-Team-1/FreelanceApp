import React from "react";
import { Gig, User } from "@/utils/database/schema";
import { FaDollarSign, FaCalendarAlt, FaMapMarkerAlt } from "react-icons/fa";
import Badge from "@/components/Buttons/CustomBadge";
import CustomButton from "@/components/Buttons/CustomButton";


interface GigDetailsModalProps {
  gig: Gig;
  lister: User | null; // Lister details
  onClose: () => void; // Close modal function
  currentUserId: string; // Current logged-in user ID
  onGoToMyGigs: () => void; // Callback for "Go to My Gigs" button
  currentUser: User; // Current user details
}

const GigDetailsModal: React.FC<GigDetailsModalProps> = ({
  gig,
  lister,
  onClose,
  currentUserId,
  onGoToMyGigs,
  currentUser,
}) => {
  // Determine who the lister is (currentUser or chatPartner)
  const isCurrentUserLister = gig.listerId === currentUserId;

  // Ensure userToDisplay has all fields with fallback values
  const userToDisplay: User = isCurrentUserLister
    ? {
        userId: currentUser.userId,
        email: currentUser.email,
        displayName: currentUser.displayName || "Unknown User",
        profile: {
          bio: currentUser.profile?.bio || "No bio available",
          credits: currentUser.profile?.credits || 0,
          picture: currentUser.profile?.picture || "/default-avatar.jpg",
          location: currentUser.profile?.location || "Unknown location",
        },
        completedGigs: currentUser.completedGigs || 0,
        averageRating: currentUser.averageRating || 0,
        
      }
    : {
        userId: lister?.userId || "Unknown ID",
        email: lister?.email || "Unknown email",
        displayName: lister?.displayName || "Unknown User",
        profile: {
          bio: lister?.profile?.bio || "No bio available",
          credits: lister?.profile?.credits || 0,
          picture: lister?.profile?.picture || "/default-avatar.jpg",
          location: lister?.profile?.location || "Unknown location",
        },
    
        completedGigs: lister?.completedGigs || 0,
        averageRating: lister?.averageRating || 0,
       
      };

  const location = gig.location || userToDisplay.profile.location || "Remote";

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
          <h1 className="text-2xl font-bold text-white sm:text-3xl">
            Gig Details
          </h1>
          <CustomButton
            label="Close"
            onClick={onClose}
            color="secondary"
            size="small"
          />
        </div>

        {/* Gig Title and Profile Picture */}
        <div className="mb-4 flex items-start">
          {/* <div className="mr-4">
            <UserProfilePicture
              user={userToDisplay}
              size="large"
              hoverDetails={false}
              rounded={true}
            />
          </div> */}
          <div>
            <h2 className="text-2xl font-semibold text-white">{gig.title}</h2>
            <p className="text-sm text-gray-300">
              <strong>Lister:</strong>{" "}
              {isCurrentUserLister ? "You" : userToDisplay.displayName}
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
                      "en-GB",
                    )} at ${new Date(
                      gig.dueDate.seconds * 1000,
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
