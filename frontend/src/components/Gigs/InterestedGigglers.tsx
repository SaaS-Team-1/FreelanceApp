import React, { useState } from "react";
import { User, Gig } from "@/utils/database/schema";
import CustomButton from "@/components/Buttons/CustomButton";
import { useNavigate } from "react-router-dom";

interface InterestedGigglersProps {
  gig: Gig;
  users: User[]; // Full list of users to find applicants from
}

const InterestedGigglers: React.FC<InterestedGigglersProps> = ({ gig, users }) => {
  const navigate = useNavigate();
  const [showModal, setShowModal] = useState(false); // For "See More" modal
  const [showUnassignModal, setShowUnassignModal] = useState(false); // For "Unassign Confirmation" modal

  // Find the assigned giggler
  const assignedGiggler = users.find(user => user.userId === gig.selectedApplicantId);

  // Find other applicants (excluding assigned giggler)
  const otherApplicants = users.filter(
    user => gig.applicantIds.includes(user.userId) && user.userId !== gig.selectedApplicantId
  );

  const handleMessageClick = (userId: string) => {
    navigate(`/app/chat?user=${userId}`);
  };

  const handleUnassign = () => {
    // Mock sending an email and notification
    alert(`Email sent to ${assignedGiggler?.email} to confirm unassignment.`);
    setShowUnassignModal(false);
  };

  return (
    <div className={`relative mt-4 rounded-lg bg-gray-900 p-4`}>
      {assignedGiggler && (
        <div className="mb-1">
          <h4 className="mb-2 mt-4 text-2xl font-semibold text-white">Assigned Giggler</h4>
          <div className="flex items-center justify-between p-2">
            <div
              className="flex cursor-pointer items-center"
              onClick={() => alert(`View profile of ${assignedGiggler.displayName}`)}
            >
              <img
                src={assignedGiggler.profile.picture || "https://via.placeholder.com/40"}
                alt={assignedGiggler.displayName}
                className="mr-3 size-10 rounded-full"
              />
              <span className="font-semibold text-white">{assignedGiggler.displayName} is assigned</span>
            </div>
            <div className="flex items-center space-x-2">
              <CustomButton
                label="Unassign"
                onClick={() => setShowUnassignModal(true)}
                color="red"
                textColor="black"
                size="small"
                rounded={true}
              />
              <CustomButton
                label="Message"
                onClick={() => handleMessageClick(assignedGiggler.userId)}
                color="primary"
                textColor="black"
                size="small"
                rounded={true}
              />
            </div>
          </div>
        </div>
      )}

      {assignedGiggler && <div className="mb-3 border-t-2 border-white"></div>}

      <h4 className="mb-2 text-2xl font-semibold text-white">Interested Gigglers</h4>
      <div>
        {otherApplicants.length > 0 ? (
          <>
            {otherApplicants.slice(0, 2).map((applicant, index) => (
              <div key={applicant.userId} className="p-2">
                <div className="flex items-center justify-between">
                  <div
                    className="flex cursor-pointer items-center"
                    onClick={() => alert(`View profile of ${applicant.displayName}`)}
                  >
                    <img
                      src={applicant.profile.picture || "https://via.placeholder.com/40"}
                      alt={applicant.displayName}
                      className="mr-3 size-10 rounded-full"
                    />
                    <span className="text-white">{applicant.displayName} has shown interest in this Gig</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <CustomButton
                      label="Assign Gig"
                      onClick={() => alert(`Assigned to ${applicant.displayName}`)}
                      color="green"
                      textColor="black"
                      size="small"
                      rounded={true}
                    />
                    <CustomButton
                      label="Message"
                      onClick={() => handleMessageClick(applicant.userId)}
                      color="primary"
                      textColor="black"
                      size="small"
                      rounded={true}
                    />
                  </div>
                </div>
                {otherApplicants.length > 1 && index < otherApplicants.length - 1 && (
                  <div className="my-2 border-t border-white"></div>
                )}
              </div>
            ))}
            {otherApplicants.length > 2 && (
              <div className="mt-1 flex justify-end">
                <CustomButton
                  label="See More"
                  onClick={() => setShowModal(true)}
                  color="primary"
                  textColor="black"
                  size="small"
                  rounded={true}
                />
              </div>
            )}
          </>
        ) : (
          <p className="text-gray-500">No other applicants yet.</p>
        )}
      </div>

      {/* Modal for showing all interested gigglers */}
      {showModal && (
        <>
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm"></div>
          <div className="fixed inset-0 z-50 flex items-center justify-center">
            <div className="w-full max-w-2xl rounded-lg bg-gray-800 p-6">
              <h3 className="mb-4 text-xl font-semibold text-white">All Interested Gigglers</h3>
              <div className="max-h-[400px] overflow-y-auto">
                {otherApplicants.map((applicant, index) => (
                  <div key={applicant.userId} className="p-2">
                    <div className="flex items-center justify-between">
                      <div
                        className="flex cursor-pointer items-center"
                        onClick={() => alert(`View profile of ${applicant.displayName}`)}
                      >
                        <img
                          src={applicant.profile.picture || "https://via.placeholder.com/40"}
                          alt={applicant.displayName}
                          className="mr-3 size-10 rounded-full"
                        />
                        <span className="text-white">{applicant.displayName} has shown interest in this Gig</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <CustomButton
                          label="Assign Gig"
                          onClick={() => alert(`Assigned to ${applicant.displayName}`)}
                          color="green"
                          textColor="black"
                          size="small"
                          rounded={true}
                        />
                        <CustomButton
                          label="Message"
                          onClick={() => handleMessageClick(applicant.userId)}
                          color="primary"
                          textColor="black"
                          size="small"
                          rounded={true}
                        />
                      </div>
                    </div>
                    {index < otherApplicants.length - 1 && <div className="my-2 border-t border-white"></div>}
                  </div>
                ))}
              </div>
              <div className="mt-2 flex justify-end">
                <CustomButton
                  label="Close"
                  onClick={() => setShowModal(false)}
                  color="red"
                  textColor="black"
                  size="medium"
                  rounded={true}
                />
              </div>
            </div>
          </div>
        </>
      )}

      {/* Unassign Confirmation Modal */}
      {showUnassignModal && (
        <>
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm"></div>
          <div className="fixed inset-0 z-50 flex items-center justify-center">
            <div className="w-full max-w-lg rounded-lg bg-gray-800 p-6">
              <h3 className="mb-4 text-xl font-semibold text-white">Confirm Unassignment</h3>
              <p className="mb-4 text-gray-300">
                Are you sure you want to unassign {assignedGiggler?.displayName} from this gig?
              </p>
              <div className="flex justify-end gap-4">
                <CustomButton
                  label="Cancel"
                  onClick={() => setShowUnassignModal(false)}
                  color="white"
                  textColor="primary"
                  size="small"
                  outline={true}
                  rounded={true}
                />
                <CustomButton
                  label="Confirm"
                  onClick={handleUnassign}
                  color="red"
                  textColor="black"
                  size="small"
                  rounded={true}
                />
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default InterestedGigglers;