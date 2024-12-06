import React, { useState } from "react";
import ReactDOM from "react-dom"; // Import ReactDOM for portals
import { User, Gig } from "@/utils/database/schema";
import { doc, updateDoc, serverTimestamp, Timestamp, query, where, getDocs ,addDoc} from "firebase/firestore";
import CustomButton from "@/components/Buttons/CustomButton";
import { useNavigate } from "react-router-dom";
import { useFirestore } from "@/utils/reactfire";
import {FaRegMessage, FaUserCheck } from "react-icons/fa6";
import { applicationsRef,notificationsRef, chatsRef } from "@/utils/database/collections";
import UserProfilePicture from "@/components/Avatar/UserProfilePicture"; // Import UserProfilePicture for hover details
import { ReCaptchaEnterpriseProvider } from "firebase/app-check";

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
  
      await updateDoc(doc(db, "gigs", gig.gigId), {
        selectedApplicantId: applicantId,
        status: "in-progress",
        updatedAt: serverTimestamp(),
      });

      const applicationsQuery = query(
        applicationsRef(db),
        where("gigId", "==", gig.gigId),
      );
      const pendingApps = await getDocs(applicationsQuery);

      const updatePromises = pendingApps.docs.map(appDoc =>
        updateDoc(doc(applicationsRef(db), appDoc.id), {
          status: appDoc.data().applicantId === applicantId ? "assigned" : "discarded",
          updatedAt: serverTimestamp(),
        })
      );
      await Promise.all(updatePromises);


      const chatQuery = query(
        chatsRef(db),
        where("gigId", "==", gig.gigId),
        where("applicantId", "==", applicantId)
       );
       
       const chatDocs = await getDocs(chatQuery);
       console.log(chatDocs)
       const chatUpdates = chatDocs.docs.map(doc => 
        updateDoc(doc.ref, {
          lastUpdatedTime: serverTimestamp()
        })
       );
       console.log(chatUpdates)
       await Promise.all(chatUpdates);
      
      
      const notificationPromises = [];
      // Notification for the selected applicant
      notificationPromises.push(
        addDoc(notificationsRef(db), {
          userId: applicantId, // This is the selected applicant's ID
          notificationMessage: `Congratulations! You have been selected for the gig.`,
          createdAt: serverTimestamp(),
        })
      );
  
      // Notification for other applicants
      pendingApps.docs.forEach((appDoc) => {
        const otherApplicantId = appDoc.data().applicantId;
        notificationPromises.push(
          addDoc(notificationsRef(db), {
            userId: otherApplicantId, // This is for each discarded applicant
            notificationMessage: `Sorry, the gig you applied for has been assigned to someone else.`,
            createdAt: serverTimestamp(),
          })
        );
      });
  
      // Wait for all notifications to be created
      await Promise.all(notificationPromises);
  
      // Step 4: Update the gig state in the UI
      const updatedGig: Gig = {
        ...gig,
        selectedApplicantId: applicantId,  // Make sure the gig state reflects the selected applicant
        status: "in-progress",
        updatedAt: serverTimestamp() as unknown as Timestamp,
      };
  
      onGigUpdate(updatedGig); // Notify the UI about the gig update
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

  const handleMessageClick = (applicantId: string) => {
    navigate(`/app/chat?user=${applicantId}`);
  };

  // Modal JSX
  const Modal = () => (
    <>
      <div className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm"></div>
      <div className="fixed inset-0 z-50 flex items-center justify-center">
        <div className="w-full max-w-3xl rounded-lg bg-gray-800 p-6">
          <h3 className="mb-3 text-xl font-semibold text-white">
            All Interested Gigglers
          </h3>
          <div className="max-h-[400px] overflow-y-auto">
            {otherApplicants.map((applicant) => (
              <div key={applicant.userId} className="p-2">
                    <div className="flex items-center justify-between">
                    
                    <div className="flex items-center">
                    <UserProfilePicture
                      user={applicant}
                      size="medium"
                      hoverDetails={true}
                      rounded={true}
                      position="default"
                    />
                      
                    <span className="ml-3 text-white ">
                      {applicant.displayName} has shown interest in this gig
                    </span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <CustomButton
                      // label="Assign"
                      icon={FaUserCheck}
                      onClick={() => handleAssignGig(applicant.userId)}
                      color="green"
                      textColor="black"
                      size="medium"
                      rounded={true}
                    />
                    <CustomButton
                      // label="Message"
                      icon={FaRegMessage}
                      onClick={() => handleMessageClick(applicant.userId)}
                      color="primary"
                      textColor="black"
                      size="medium"
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
              size="small"
              rounded={true}
            />
          </div>
        </div>
      </div>
    </>
  );

  return (
    <div className="relative mt-2 rounded-lg bg-gray-900 p-4">
      {/* Assigned Giggler Section */}
      {assignedGiggler && gig.status !== "open" && (
        <div className="mb-1">
          <h4 className="mb-2 mt-4 text-2xl font-semibold text-white">
            Assigned Giggler
          </h4>
          <div className="flex items-center justify-between p-2">
              <div className="flex items-center">
              <UserProfilePicture
                user={assignedGiggler}
                size="medium"
                hoverDetails={true}
                rounded={true}
                position="above"
              />
              <span className="ml-3 font-semibold text-white">
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
                  size="medium"
                  rounded={true}
                />
              )}
              <CustomButton
                label="Message"
                icon={FaRegMessage}
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
                    <div className="flex items-center">
                    <UserProfilePicture
                    user={applicant}
                    size="medium"
                    hoverDetails={true}
                    rounded={true}
                    position="above"
                    />
                          <span className="ml-3 font-semibold text-white">
                            
                          {applicant.displayName.length > 11 ? (
                          <>
                            {applicant.displayName} has shown interest in
                            <br />
                            <span className="text-white">this gig</span>
                          </>
                        ) : (
                          <>
                            {applicant.displayName} has shown interest in this gig
                          </>
                        )}
                        </span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <CustomButton
                          label="Assign Gig"
                          icon={FaUserCheck}
                          onClick={() => handleAssignGig(applicant.userId)}
                          color="green"
                          textColor="black"
                          size="small"
                          rounded={true}
                        />
                        <CustomButton
                          label="Message"
                          icon={FaRegMessage}
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
