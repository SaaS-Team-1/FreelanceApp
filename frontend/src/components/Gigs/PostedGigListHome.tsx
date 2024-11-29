import React, { useState } from "react";
import { FaComments } from "react-icons/fa";
import { Gig, User } from "@/utils/database/schema";
import Badge from "@/components/Buttons/CustomBadge";
import CustomButton from "@/components/Buttons/CustomButton";
import { UndoButton } from "@/components/Buttons/UndoButton";
import GigDetailModal from "@/components/Gigs/GigDetailModal";
import { Firestore } from "firebase/firestore";

interface PostedGigListHomeProps {
  gigs: { gig: Gig; lister: User }[]; // List of gigs with lister data
  onSelectGig?: (gig: Gig) => void; // Optional prop for selecting a gig
  enableSelection?: boolean; // Prop to enable/disable selection
  selectedGig?: Gig | null; // To determine the selected gig for background change
  showSeeMoreButton?: boolean; // Prop to conditionally show "See More" button
  showChatIcon?: boolean; // Optional prop to show the chat icon
  showCompletedButton?: boolean; // Optional prop to show the "Completed Gig" button
  showDateWithLine?: boolean; // Optional prop to show/hide the date with a white line
  showUndoButton?: boolean; // New prop to optionally display the UndoButton
  hoverEffect?: boolean; // Prop to conditionally apply hover effect
  userId?: string; // Optional logged-in user's ID
  db?: Firestore; // Optional Firestore database instance
}

function PostedGigListHome({
  gigs,
  onSelectGig,
  enableSelection = true,
  selectedGig = null,
  showSeeMoreButton = true,
  showChatIcon = false,
  showCompletedButton = false,
  showDateWithLine = false,
  showUndoButton = false,
  hoverEffect = true,
  userId,
  db,
}: PostedGigListHomeProps) {
  const [selectedGigDetails, setSelectedGigDetails] = useState<Gig | null>(
    null,
  ); // State to manage the selected gig for modal
  const [selectedListerDetails, setSelectedListerDetails] =
    useState<User | null>(null); // State to manage the selected lister for modal
  const [isModalOpen, setIsModalOpen] = useState(false); // State to control modal visibility

  const handleSeeMoreClick = (gig: Gig, lister: User) => {
    setSelectedGigDetails(gig); // Set the selected gig for the modal
    setSelectedListerDetails(lister); // Set the selected lister for the modal
    setIsModalOpen(true); // Open the modal
  };

  const handleCloseModal = () => {
    setIsModalOpen(false); // Close the modal
    setSelectedGigDetails(null); // Reset selected gig details
  };

  return (
    <div className="space-y-4">
      {gigs.map(({ gig, lister }, index) => (
        <div
          key={index}
          className={`relative rounded-lg p-4 shadow-lg transition-transform duration-200 ease-in-out ${
            selectedGig && selectedGig.title === gig.title
              ? "bg-[rgba(5,54,78,0.59)] text-white"
              : "bg-gray-900 text-gray-300"
          } ${enableSelection ? "cursor-pointer" : ""} 
            ${hoverEffect ? "hover:bg-gray-700" : ""}`} // Hover effect applied conditionally
          onClick={() => enableSelection && handleSeeMoreClick(gig, lister)} // Conditional click handler
        >
          {showUndoButton && (
            <div className="absolute right-4 top-4">
              <UndoButton
                onClick={() => alert(`Undo clicked for gig: ${gig.title}`)}
              />
            </div>
          )}

          {showCompletedButton && (
            <div className="absolute right-12 top-5">
              <CustomButton
                label="Completed Gig"
                onClick={() => onCompleteClick && onCompleteClick(gig.gigId)}
                color="green"
                textColor="white"
                size="small"
                rounded={true}
              />
            </div>
          )}

          {showChatIcon && (
            <div className="absolute right-2 top-6">
              <CustomButton
                onClick={() => handleMessageClick(lister.userId)}
                color="primary"
                textColor="white"
                size="small"
                icon={FaComments}
                iconPosition="middle"
                rounded={true}
              />
            </div>
          )}

          <div className="mb-2 flex items-center">
            <div className="ml-3 flex flex-col">
              <h3 className="whitespace-normal break-words pr-[120px] text-lg font-semibold text-white">
                {gig.title}
              </h3>
              {showDateWithLine && (
                <p className="mt-1 text-xs text-orange-500">
                  {new Date(gig.dueDate.seconds * 1000).toLocaleDateString(
                    "en-GB",
                    {
                      weekday: "long",
                      day: "2-digit",
                      month: "long",
                      year: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                    },
                  )}
                </p>
              )}
            </div>
          </div>

          {/* Render a white line if date is shown */}
          {showDateWithLine && (
            <div className="mt-1 border-t border-white"></div>
          )}
          {/* Render gig description (first 100 characters) */}
          <p className="mt-2 text-gray-300">
            {gig.description.length > 100
              ? gig.description.slice(0, 100) + "..."
              : gig.description}
          </p>

          <div className="mt-2 flex flex-wrap items-center gap-2">
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
              label={`€${gig.price.toFixed(2)}`}
              color="beige"
              textColor="black"
              outline={true}
              outlineColor="beige"
              rounded={true}
              size="small"
            />
            <Badge
              label={gig.location}
              color="beige"
              textColor="black"
              outline={true}
              outlineColor="beige"
              rounded={true}
              size="small"
            />
          </div>

          {showSeeMoreButton && (
            <div className="mt-1 flex justify-end">
              <CustomButton
                label="See More"
                onClick={() => handleSeeMoreClick(gig, lister)} // Open the modal with the selected gig
                color="primary"
                textColor="white"
                size="small"
                rounded={true}
              />
            </div>
          )}
        </div>
      ))}

      {/* Gig Details Modal */}
      {selectedGigDetails && selectedListerDetails && (
        <GigDetailModal
          gig={selectedGigDetails}
          lister={selectedListerDetails}
          isOpen={isModalOpen}
          userId={userId} // Pass the logged-in user's ID
          db={db} // Pass the Firestore database instance
          onClose={handleCloseModal}
        />
      )}
    </div>
  );
}

export default PostedGigListHome;
