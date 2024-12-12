import { useState } from "react";
import { Gig, User } from "@/utils/database/schema";
import GigDetailModal from "@/components/Gigs/GigDetailModal";
import { Firestore } from "firebase/firestore";
import GigItem from "./GigItem";

interface PostedGigListHomeProps {
  gigs: { gig: Gig; lister: User }[]; // List of gigs with lister data
  onSelectGig?: (gig: Gig) => void; // Optional prop for selecting a gig
  enableSelection?: boolean; // Prop to enable/disable selection
  selectedGig?: Gig | null; // To determine the selected gig for background change
  showSeeMoreButton?: boolean; // Prop to conditionally show "See More" button
  showChatIcon?: boolean; // Optional prop to show the chat icon
  showCompletedButton?: boolean; // Optional prop to show the "Completed Gig" button
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
    <div className="space-y-4 py-5 sm:space-y-8" id="posted-gig-list-home">
      {gigs.map(({ gig, lister }) => (
        <GigItem gig={gig} lister={lister} showSeeMoreButton onSeeMoreClick={handleSeeMoreClick}/>
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
