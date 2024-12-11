import { useState } from "react";
import { Gig, User } from "@/utils/database/schema";
import CustomButton from "@/components/Buttons/CustomButton";
import GigDetailModal from "@/components/Gigs/GigDetailModal";
import { Firestore } from "firebase/firestore";
import { Badge } from "flowbite-react";

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
  enableSelection = true,
  selectedGig = null,
  showSeeMoreButton = true,
  showDateWithLine = false,
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
    <div className="space-y-4 py-5 sm:space-y-8">
      {gigs.map(({ gig, lister }, index) => (
        <div
          key={index}
          className={`relative rounded-lg shadow-sm transition-transform duration-200 ease-in-out ${
            selectedGig && selectedGig.title === gig.title
              ? "border border-blue-400 bg-blue-100 text-blue-700"
              : "bg-surface-container-low text-on-surface"
          } ${enableSelection ? "cursor-pointer" : ""} 
            ${hoverEffect ? "hover:bg-surface-container" : ""}`} // Hover effect applied conditionally
          onClick={() => enableSelection && handleSeeMoreClick(gig, lister)} // Conditional click handler
        >
          <div className="mb-2 flex items-center rounded-xl bg-primary-container p-2 ">
            <div className="flex flex-col">
              <h3 className="flex whitespace-normal break-words text-lg font-bold text-on-primary-container">
                {gig.title.toUpperCase()}
              </h3>
              {gig.dueDate && (
                <p className="mt-1 text-xs text-on-primary-container">
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
          {showDateWithLine && <div className="mt-1 border-t"></div>}
          {/* Render gig description (first 100 characters) */}
          <p className="my-4 line-clamp-4 w-full px-3 text-on-surface">
            {gig.description}
          </p>

          <div className="flex w-full items-center justify-center gap-2 p-3">
            <div className="mr-auto flex flex-col space-y-2 justify-center items-center sm:flex-row sm:space-x-2 sm:space-y-0">
              <Badge size="sm" color="yellow">{`${gig.price} ⛃⛂`}</Badge>
              <Badge size="sm" color="secondary-container">
                {gig.category}
              </Badge>
              <Badge size="sm" color="secondary-container">
                {gig.location}
              </Badge>
            </div>

            {showSeeMoreButton && (
              <CustomButton
                label="See More"
                onClick={() => handleSeeMoreClick(gig, lister)} // Open the modal with the selected gig
                color="primary"
                textColor="white"
                size="small"
                rounded={false}
              />
            )}
          </div>
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
