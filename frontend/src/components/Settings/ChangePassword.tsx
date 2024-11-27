import React, { useState } from "react";
import CustomButton from "../Buttons/CustomButton";
import ArrowButton from "../Buttons/ArrowButton";

const ChangePassword: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const handleConfirm = () => {
    if (newPassword !== confirmPassword) {
      alert("New password and confirmation do not match.");
      return;
    }
    // Perform password update logic here
    console.log("Password successfully updated.");
    console.log("Old Password:", oldPassword);
    console.log("New Password:", newPassword);

    // Reset fields and close modal
    setOldPassword("");
    setNewPassword("");
    setConfirmPassword("");
    setIsModalOpen(false);
  };

  return (
    <div>
      <div onClick={openModal}>
        <ArrowButton />
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="w-full max-w-sm rounded-lg bg-gray-800 p-6 shadow-lg">
            <h2 className="mb-4 text-lg font-bold text-white">
              Change Password
            </h2>

            {/* Password Fields */}
            <div className="space-y-4">
              <div>
                <label className="mb-2 block text-sm text-gray-300">
                  Old Password
                </label>
                <input
                  type="password"
                  value={oldPassword}
                  onChange={(e) => setOldPassword(e.target.value)}
                  className="w-full rounded-md bg-gray-700 p-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter old password"
                />
              </div>
              <div>
                <label className="mb-2 block text-sm text-gray-300">
                  New Password
                </label>
                <input
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="w-full rounded-md bg-gray-700 p-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter new password"
                />
              </div>
              <div>
                <label className="mb-2 block text-sm text-gray-300">
                  Confirm New Password
                </label>
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full rounded-md bg-gray-700 p-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Confirm new password"
                />
              </div>
            </div>

            {/* Buttons */}
            <div className="mt-6 flex justify-end space-x-4">
              <CustomButton
                label="Cancel"
                onClick={closeModal}
                color="gray"
                textColor="white"
              />
              <CustomButton
                label="Confirm"
                onClick={handleConfirm}
                color="primary"
                textColor="white"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ChangePassword;
