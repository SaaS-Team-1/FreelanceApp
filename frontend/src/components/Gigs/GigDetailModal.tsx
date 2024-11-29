import React from "react";
import ReactDOM from "react-dom";
import CustomButton from "@/components/Buttons/CustomButton";
import { Application, Chat, Gig, User } from "@/utils/database/schema";
import { FaDollarSign, FaCalendarAlt, FaMapMarkerAlt } from "react-icons/fa";
import Badge from "@/components/Buttons/CustomBadge";
import { Firestore, Timestamp, addDoc, updateDoc } from "firebase/firestore";
import { query, where, getDocs } from "firebase/firestore";
import UserProfilePicture from "@/components/Avatar/UserProfilePicture"; // Import the UserProfilePicture component
import { applicationsRef, chatsRef } from "@/utils/database/collections";

interface GigDetailModalProps {
  gig: Gig;
  isOpen: boolean;
  onClose: () => void;
  userId?: string; // Optional logged-in user's ID
  db?: Firestore; // Optional Firestore database instance
  lister: User; // Add lister prop to display the user's profile picture and name
}

const GigDetailModal: React.FC<GigDetailModalProps> = ({
  gig,
  isOpen,
  onClose,
  userId,
  db,
  lister,
}) => {
  if (!isOpen) return null;

  const handleApply = async () => {
    if (!userId || !db) return;

    const chatRefs: { id: string; chat: Chat }[] = [];
    const applicationRefs: { id: string; application: Application }[] = [];

    // Generate a random Latin cover letter
    const latinPhrases = [
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
      "Vestibulum venenatis augue a felis aliquam bibendum.",
      "Curabitur auctor magna ut orci sodales, id vestibulum nunc mollis.",
      "Nullam ultricies ligula vel nulla feugiat pellentesque.",
      "Proin sed felis vel erat interdum tincidunt eget ac ligula.",
    ];
    const randomCoverLetter =
      latinPhrases[Math.floor(Math.random() * latinPhrases.length)];

    try {
      // Check if an application already exists for this gig and applicant
      const applicationRef = applicationsRef(db);
      const existingApplicationQuery = query(
        applicationRef,
        where("gigId", "==", gig.gigId),
        where("applicantId", "==", userId),
      );
      const existingApplications = await getDocs(existingApplicationQuery);

      if (!existingApplications.empty) {
        alert("You have already applied for this gig!");
        onClose();
        return; // Exit the function if an application already exists
      }

      const chatData: Partial<Chat> = {
        gigId: gig.gigId,
        applicationId: "",
        listerId: gig.listerId,
        applicantId: userId,
      };

      const chatDoc = await addDoc(chatsRef(db), chatData);
      chatData.chatId = chatDoc.id;
      chatRefs.push({ id: chatDoc.id, chat: chatData as Chat });

      const applicationData: Partial<Application> = {
        gigId: gig.gigId,
        applicantId: userId,
        listerId: gig.listerId,
        status: "pending",
        coverLetter: randomCoverLetter,
        appliedAt: Timestamp.now(),
        chatId: chatDoc.id,
      };

      const applicationDoc = await addDoc(applicationsRef(db), applicationData);
      applicationData.applicationId = applicationDoc.id;
      applicationRefs.push({
        id: applicationDoc.id,
        application: applicationData as Application,
      });

      updateDoc(chatDoc, { applicationId: applicationData.applicationId });

      alert("Application and chat created successfully!");
      onClose(); // Close the modal after applying
    } catch (error) {
      console.error("Error applying to gig:", error);
      alert("Failed to apply for the gig. Please try again.");
    }
  };

  const location = gig.location || "Remote";

  return ReactDOM.createPortal(
    <>
      <div
        className="fixed inset-0 z-10 flex items-center justify-center bg-black bg-opacity-50"
        onClick={onClose}
      >
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm"></div>
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="w-3/4 max-w-4xl overflow-hidden rounded-lg bg-gray-800 p-8">
            <div className="pr-4">
              {/* Lister Profile Picture and Name */}
              <div className="mb-4 flex items-center gap-4">
                <UserProfilePicture
                  user={lister}
                  size="large" // Display larger profile picture
                  hoverDetails={true} // Show hover details
                />
                <div>
                  <h3
                    className="w-fit text-nowrap text-lg font-bold text-white"
                    style={{
                      whiteSpace: "nowrap",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      maxWidth: "200px", // Adjust this to your desired max width
                    }}
                  >
                    {lister.displayName}
                  </h3>
                  {lister.profile.location && (
                    <p className="text-sm text-gray-400">
                      {lister.profile.location}
                    </p>
                  )}
                </div>
                <h2 className="text-2xl font-bold text-white">{gig.title}</h2>
              </div>

              <p className="mb-4 text-gray-300">{gig.description}</p>

              <div className="justify-left mb-6 flex flex-col gap-6 text-sm text-white sm:flex-row">
                <div className="flex flex-col items-center">
                  <div className="flex items-center">
                    <FaDollarSign className="mr-2" />
                    <span>{gig.price ? `${gig.price} Tokens` : "TBD"}</span>
                  </div>
                  <span className="ml-4 text-xs text-gray-400">Price</span>
                </div>
                <div className="flex flex-col items-center">
                  <div className="flex items-center">
                    <FaCalendarAlt className="mr-2" />
                    <span>
                      {gig.dueDate
                        ? `${new Date(
                            gig.dueDate.seconds * 1000,
                          ).toLocaleDateString("en-GB")}`
                        : "N/A"}
                    </span>
                  </div>
                  <span className="ml-2 text-xs text-gray-400">Due Date</span>
                </div>
                <div className="flex flex-col items-center">
                  <div className="flex items-center">
                    <FaMapMarkerAlt className="mr-2" />
                    <span>{location}</span>
                  </div>
                  <span className="ml-6 text-xs text-gray-400">Location</span>
                </div>
              </div>

              <div>
                <h4 className="text-sm font-semibold text-gray-400">Tags:</h4>
                <div className="mt-2 flex gap-2">
                  <Badge
                    label={gig.category}
                    color="beige"
                    textColor="black"
                    outline={true}
                    outlineColor="beige"
                    rounded={true}
                    size="small"
                  />
                  <Badge
                    label={location}
                    color="beige"
                    textColor="black"
                    outline={true}
                    outlineColor="beige"
                    rounded={true}
                    size="small"
                  />
                  <Badge
                    label={`${gig.price ? `${gig.price} Tokens` : "TBD"}`}
                    color="beige"
                    textColor="black"
                    outline={true}
                    outlineColor="beige"
                    rounded={true}
                    size="small"
                  />
                </div>
              </div>

              <div className="mt-4 flex justify-between">
                <CustomButton
                  label="Close"
                  onClick={onClose}
                  color="red"
                  textColor="black"
                  size="medium"
                  rounded={true}
                />
                {userId && db && (
                  <CustomButton
                    label="Apply"
                    onClick={handleApply} // Trigger the apply function
                    color="primary"
                    textColor="white"
                    size="medium"
                    rounded={true}
                  />
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>,
    document.body,
  );
};

export default GigDetailModal;
