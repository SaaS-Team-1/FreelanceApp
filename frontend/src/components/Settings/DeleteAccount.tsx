import React, { useState } from "react";
import CustomButton from "../Buttons/CustomButton";

const DeleteAccount: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const handleConfirm = () => {
    console.log("Account deletion confirmed.");
    setIsModalOpen(false);
  };

  return (
    <div>
      {/* Trigger Button */}
      <button
        onClick={openModal}
        className="flex items-center justify-center rounded-md bg-red-500 px-4 py-2 text-white hover:bg-red-600"
      >
        Delete Account
      </button>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="w-full max-w-sm rounded-lg bg-gray-800 p-6 shadow-lg">
            <h2 className="mb-4 text-lg font-bold text-white">
              Confirm Account Deletion
            </h2>
            <p className="mb-6 text-sm text-gray-300">
              Are you sure you want to delete your account? This action cannot
              be undone.
            </p>
            <div className="flex justify-end space-x-4">
              <CustomButton
                label="Cancel"
                onClick={closeModal}
                color="gray"
                textColor="white"
              />
              <CustomButton
                label="Confirm"
                onClick={handleConfirm}
                color="red"
                textColor="white"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DeleteAccount;
