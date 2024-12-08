import React, { useState } from "react";
import CustomButton from "@/components/Buttons/CustomButton"; // Import your button component
import { FaPlus } from "react-icons/fa";
import { Gig } from "@/utils/database/schema";
import { Timestamp } from "firebase/firestore";
import CreateGigModal from "./CreateGigModal";

interface CreateGigButtonProps {
  onCreateSave: (newGig: Gig) => void; // Callback for saving the new gig
}

const CreateGigButton: React.FC<CreateGigButtonProps> = ({
  onCreateSave,
}) => {
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  return (
    <div>
      {/* Button to open the Create Modal */}

      <button className="flex w-96 justify-center items-center rounded-full bg-orange-500 py-3 text-sm font-semibold text-white" onClick={() => setIsCreateModalOpen(true)}>
          + Upload new gig
      </button>

      {/* Create Modal */}
      {isCreateModalOpen && (
        <CreateGigModal
          onCreate={() => {
            onCreateSave;
            setIsCreateModalOpen(false); // Close the modal
          }}
          onClose={() => setIsCreateModalOpen(false)} // Close the modal
        />
      )}
    </div>
  );
};

export default CreateGigButton;

