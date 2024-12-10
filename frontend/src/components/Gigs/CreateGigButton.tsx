import React, { useState } from "react";
import { Gig } from "@/utils/database/schema";
import CreateGigModal from "./CreateGigModal";

interface CreateGigButtonProps {
  onCreateSave: (newGig: Gig) => void; // Callback for saving the new gig
}

const CreateGigButton: React.FC<CreateGigButtonProps> = ({ onCreateSave }) => {
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  return (
    <div>
      {/* Button to open the Create Modal */}

      <button
        className="flex w-96 items-center justify-center rounded-full bg-primary py-3 text-sm font-semibold text-on-primary"
        onClick={() => setIsCreateModalOpen(true)}
      >
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
