import { useState } from "react";
import EditCreateGigModal from "./EditCreateGigModal";
import { Button } from "flowbite-react";

function CreateGigButton({
  children,
  color,
}: React.PropsWithChildren<{ color: string }>) {
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  return (
    <>
      {/* Button to open the Create Modal */}

      <Button color={color} onClick={() => setIsCreateModalOpen(true)}>
        {children}
      </Button>

      {/* Create Modal */}
      {isCreateModalOpen && (
        <EditCreateGigModal
          isOpen={isCreateModalOpen}
          onClose={() => setIsCreateModalOpen(false)} // Close the modal
        />
      )}
    </>
  );
}

export default CreateGigButton;
