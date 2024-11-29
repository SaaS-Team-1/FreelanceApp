import React, { useState } from "react";
import ReactDOM from "react-dom"; // Import ReactDOM for portals
import { User, Gig } from "@/utils/database/schema";
import { doc, updateDoc, serverTimestamp, Timestamp } from "firebase/firestore";
import CustomButton from "@/components/Buttons/CustomButton";
import { useNavigate } from "react-router-dom";
import { useFirestore } from "@/utils/reactfire";

interface InterestedGigglersProps {
  gig: Gig;
  users: User[];
  onGigUpdate: (updatedGig: Gig) => void;
}

const InterestedGigglers: React.FC<InterestedGigglersProps> = ({
  gig,
  users,
  onGigUpdate,
}) => {
  const db = useFirestore();
  const navigate = useNavigate();
  const [showModal, setShowModal] = useState(false);

  const assignedGiggler = users.find(
    (user) => user.userId === gig.selectedApplicantId,
  );
  const otherApplicants = users.filter((user) => {
    if (!assignedGiggler) return true;
    return user.userId !== assignedGiggler.userId;
  });

  const handleAssignGig = async (applicantId: string) => {
    try {
      const gigDocRef = doc(db, "gigs", gig.gigId);
      await updateDoc(gigDocRef, {
        selectedApplicantId: applicantId,
        status: "in-progress",
        updatedAt: serverTimestamp(),
      });

      const updatedGig: Gig = {
        ...gig,
        selectedApplicantId: applicantId,
        status: "in-progress",
        updatedAt: serverTimestamp() as unknown as Timestamp,
      };

      onGigUpdate(updatedGig);
    } catch (error) {
      console.error("Error assigning gig:", error);
      alert("Failed to assign gig. Please try again.");
    }
  };

  const handleMarkComplete = async () => {
    try {
      const gigDocRef = doc(db, "gigs", gig.gigId);
      await updateDoc(gigDocRef, {
        status: "completed",
        updatedAt: serverTimestamp(),
      });

      const updatedGig: Gig = {
        ...gig,
        status: "completed",
        updatedAt: serverTimestamp() as unknown as Timestamp,
      };

      onGigUpdate(updatedGig);
    } catch (error) {
      console.error("Error marking gig as completed:", error);
      alert("Failed to mark gig as completed. Please try again.");
    }
  };

  const handleMessageClick = (userId: string) => {
    navigate(`/app/chat?user=${userId}`);
  };

  // Modal JSX
  const Modal = () => (
    <>
      <div className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm"></div>
      <div className="fixed inset-0 z-50 flex items-center justify-center">
        <div className="w-full max-w-3xl rounded-lg bg-gray-800 p-6">
          <h3 className="mb-4 text-xl font-semibold text-white">
            All Interested Gigglers
          </h3>
          <div className="max-h-[400px] overflow-y-auto">
            {otherApplicants.map((applicant) => (
              <div key={applicant.userId} className="p-2">
                <div className="flex items-center justify-between">
                  <div
                    className="flex cursor-pointer items-center"
                    onClick={() =>
                      alert(`View profile of ${applicant.displayName}`)
                    }
                  >
                    <img
                      src={
                        applicant.profile.picture ||
                        "https://via.placeholder.com/40"
                      }
                      alt={applicant.displayName}
                      className="mr-3 size-10 rounded-full"
                    />
                    <span className="text-white">
                      {applicant.displayName} has shown interest in this gig
                    </span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <CustomButton
                      label="Assign Gig"
                      onClick={() => handleAssignGig(applicant.userId)}
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
  );

  return (
    <div className="relative mt-4 rounded-lg bg-gray-900 p-4">
      {/* Assigned Giggler Section */}
      {assignedGiggler && gig.status !== "open" && (
        <div className="mb-1">
          <h4 className="mb-2 mt-4 text-2xl font-semibold text-white">
            Assigned Giggler
          </h4>
          <div className="flex items-center justify-between p-2">
            <div
              className="flex cursor-pointer items-center"
              onClick={() =>
                alert(`View profile of ${assignedGiggler.displayName}`)
              }
            >
              <img
                src={
                  assignedGiggler.profile.picture ||
                  "https://via.placeholder.com/40"
                }
                alt={assignedGiggler.displayName}
                className="mr-3 size-10 rounded-full"
              />
              <span className="font-semibold text-white">
                {gig.status === "completed"
                  ? `${assignedGiggler.displayName} was assigned`
                  : `${assignedGiggler.displayName} is assigned`}
              </span>
            </div>
            <div className="flex items-center space-x-2">
              {gig.status === "awaiting-confirmation" && (
                <CustomButton
                  label="Complete"
                  onClick={handleMarkComplete}
                  color="green"
                  textColor="black"
                  size="small"
                  rounded={true}
                />
              )}
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

      {/* Divider */}
      {assignedGiggler && gig.status !== "open" && (
        <hr className="my-4 border-t border-gray-700" />
      )}

      {/* Interested Gigglers Section */}
      {gig.status === "open" && (
        <>
          <h4 className="mb-2 text-2xl font-semibold text-white">
            Interested Gigglers
          </h4>
          <div>
            {otherApplicants.length > 0 ? (
              <>
                {otherApplicants.slice(0, 2).map((applicant, index) => (
                  <div key={applicant.userId} className="p-2">
                    <div className="flex items-center justify-between">
                      <div
                        className="flex cursor-pointer items-center"
                        onClick={() =>
                          alert(`View profile of ${applicant.displayName}`)
                        }
                      >
                        <img
                          src={
                            applicant.profile.picture ||
                            "https://via.placeholder.com/40"
                          }
                          alt={applicant.displayName}
                          className="mr-3 size-10 rounded-full"
                        />
                        <span className="text-white">
                          {applicant.displayName} has shown interest in this gig
                        </span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <CustomButton
                          label="Assign Gig"
                          onClick={() => handleAssignGig(applicant.userId)}
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
                    {index < otherApplicants.length - 1 && (
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
        </>
      )}

      {/* Use React Portal for the Modal */}
      {showModal && ReactDOM.createPortal(<Modal />, document.body)}
    </div>
  );
};

export default InterestedGigglers;
