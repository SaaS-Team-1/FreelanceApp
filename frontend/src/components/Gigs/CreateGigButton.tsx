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
      <CustomButton
        label="Create Gig"
        onClick={() => setIsCreateModalOpen(true)}
        color="secondary"
        textColor="black"
        size="medium"
        rounded={true}
        icon={FaPlus}
        iconPosition="left"
        customStyle={{
          backgroundColor: "#44B0E8",
          padding: "6px 20px",
          width: "140px",
        }}
      />

      {/* Create Modal */}
      {isCreateModalOpen && (
        <CreateGigModal
          onCreate={(newGig) => {
            onCreateSave({
              ...newGig,
              createdAt: Timestamp.now(),
              updatedAt: Timestamp.now(),
            });
            setIsCreateModalOpen(false); // Close the modal
          }}
          onClose={() => setIsCreateModalOpen(false)} // Close the modal
        />
      )}
    </div>
  );
};

export default CreateGigButton;