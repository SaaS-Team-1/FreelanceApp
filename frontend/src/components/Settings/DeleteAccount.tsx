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
        className="flex items-center justify-center px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600"
      >
        Delete Account
      </button>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-gray-800 rounded-lg shadow-lg p-6 max-w-sm w-full">
            <h2 className="text-white text-lg font-bold mb-4">
              Confirm Account Deletion
            </h2>
            <p className="text-gray-300 text-sm mb-6">
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
