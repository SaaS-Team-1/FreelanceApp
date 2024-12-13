import { useState } from "react";
import EditCreateGigModal from "./EditCreateGigModal";
import { Button } from "flowbite-react";

function CreateGigButton({
  children,
  color,
  className,
}: React.PropsWithChildren<{ color: string; className: string }>) {
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  return (
    <>
      {/* Button to open the Create Modal */}

      <Button
        color={color}
        className={className}
        onClick={() => setIsCreateModalOpen(true)}
      >
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
