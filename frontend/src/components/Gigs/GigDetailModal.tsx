import React, { useEffect } from "react";
import { Application, Chat, Gig, User } from "@/utils/database/schema";
import { FaDollarSign, FaCalendarAlt, FaMapMarkerAlt } from "react-icons/fa";
import { Firestore, Timestamp, addDoc, updateDoc } from "firebase/firestore";
import { query, where, getDocs } from "firebase/firestore";
import UserProfilePicture from "@/components/Avatar/UserProfilePicture"; // Import the UserProfilePicture component
import {
  applicationsRef,
  chatsRef,
  notificationsRef,
} from "@/utils/database/collections";
import { Badge, Button, Modal } from "flowbite-react";

interface GigDetailModalProps {
  gig: Gig;
  isOpen: boolean;
  onClose: () => void;
  userId?: string; // Optional logged-in user's ID
  db?: Firestore; // Optional Firestore database instance
  lister: User; // Add lister prop to display the user's profile picture and name
}

function GigDetailModal({
  gig, isOpen, onClose, userId, db, lister,
}: GigDetailModalProps) {
  const [applied, setApplied] = React.useState(true);
  const checkApply = async () => {
    if (!userId || !db) return;

    const applicationRef = applicationsRef(db);
    const existingApplicationQuery = query(
      applicationRef,
      where("gigId", "==", gig.gigId),
      where("applicantId", "==", userId)
    );
    const existingApplications = await getDocs(existingApplicationQuery);

    if (!existingApplications.empty) {
      setApplied(true);
      return;
    } else {
      setApplied(false);
    }
  };

  useEffect(() => {
    checkApply();
  }, []);

  if (!isOpen) return null;

  const handleApply = async () => {
    if (!userId || !db) return;

    try {
      // Ensure necessary gig fields are defined
      if (!gig.gigId || !gig.listerId) {
        throw new Error("Gig data is incomplete.");
      }

      // Create application
      const applicationData: Partial<Application> = {
        gigId: gig.gigId,
        applicantId: userId,
        listerId: gig.listerId,
        status: "pending",
        coverLetter: "randomCoverLetter", // Customize if needed
        appliedAt: Timestamp.now(),
        chatId: "",
        applicationId: "",
      };

      const applicationDoc = await addDoc(applicationsRef(db), applicationData);

      // Create chat
      const chatData: Partial<Chat> = {
        gigId: gig.gigId,
        applicationId: applicationDoc.id,
        listerId: gig.listerId,
        applicantId: userId,
        lastUpdate: Timestamp.now(),
        chatId: "",
      };

      const chatDoc = await addDoc(chatsRef(db), chatData);

      // Update application and chat IDs
      await Promise.all([
        updateDoc(chatDoc, { chatId: chatDoc.id }),
        updateDoc(applicationDoc, {
          chatId: chatDoc.id,
          applicationId: applicationDoc.id,
        }),
      ]);

      await addDoc(notificationsRef(db), {
        userId: gig.listerId,
        notificationMessage: `New application for you gig: "${gig.title}".`,
        createdAt: Timestamp.now(),
      });

      // Set the application state to applied
      setApplied(true);

      alert("Application submitted successfully!");
      onClose();
    } catch (error) {
      console.error("Error applying to gig:", error);

      // Partial cleanup or recovery could be implemented here if needed
      alert("Failed to apply for the gig. Please try again.");
    }
  };

  const location = gig.location || "Remote";

  return (
    <Modal show={isOpen} onClose={onClose} dismissible>
      <Modal.Header>
        <div className="flex h-fit w-full items-center justify-stretch">
          <div className="flex items-center justify-self-start p-2 pr-4">
            <UserProfilePicture
              user={lister}
              size="large" // Display larger profile picture
              hoverDetails={true} // Show hover details
            />
            <div className="ml-4">
              <h3 className="w-fit max-w-56 truncate text-nowrap text-sm font-semibold text-on-primary-container">
                {lister.displayName}
              </h3>
              {lister.profile.location && (
                <p className="text-xs font-normal">{lister.profile.location}</p>
              )}
            </div>
            <div className="ml-3 self-stretch border-l border-on-primary-container" />
          </div>

          <h2 className="line-clamp-1 font-bold text-lg text-on-primary-container">
            {gig.title}
          </h2>
        </div>
      </Modal.Header>
      <Modal.Body>
        <div className="w-full  space-y-6 ">
          <div className="w-full px-6 pb-6">
            {/* Lister Profile Picture and Name */}

            <p className="mb-4 line-clamp-3 overflow-hidden rounded-xl bg-surface-container px-2 text-on-surface sm:line-clamp-none sm:py-4">
              {gig.description}
            </p>

            <div className="mb-6 flex flex-col justify-center gap-6 text-sm text-on-surface sm:flex-row">
              <div className="flex flex-col items-center">
                <div className="flex items-center">
                  <FaDollarSign className="mr-2" />
                  <span>{gig.price ? `${gig.price} Tokens` : "TBD"}</span>
                </div>
                <span className="ml-4 text-xs">Price</span>
              </div>
              <div className="flex flex-col items-center">
                <div className="flex items-center">
                  <FaCalendarAlt className="mr-2" />
                  <span>
                    {gig.dueDate
                      ? `${new Date(
                        gig.dueDate.seconds * 1000
                      ).toLocaleDateString("en-GB")}`
                      : "N/A"}
                  </span>
                </div>
                <span className="ml-2 text-xs">Due Date</span>
              </div>
              <div className="flex flex-col items-center">
                <div className="flex items-center">
                  <FaMapMarkerAlt className="mr-2" />
                  <span>{location}</span>
                </div>
                <span className="ml-6 text-xs">Location</span>
              </div>
            </div>

            <div className="flex flex-col items-center text-sm">
              <h4 className="text-sm font-semibold">Tags:</h4>
              <div className="mt-4 flex gap-2">
                <Badge color="yellow">
                  {gig.price ? `${gig.price} Tokens` : "TBD"}
                </Badge>
                <Badge color="secondary-container">{gig.category}</Badge>
                <Badge color="secondary-container">{location}</Badge>
              </div>
            </div>
          </div>
        </div>
      </Modal.Body>

      <Modal.Footer>
        <div className="flex w-full justify-end space-x-2">
          <Button onClick={onClose} color={"surface-container"} size="md">
            Close
          </Button>
          {userId && db && (
            <Button
              id="apply-button"
              onClick={handleApply} // Trigger the apply function
              color="primary"
              size="md"
              disabled={applied}
            >
              {!applied ? "Apply" : "Applied Already"}
            </Button>
          )}
        </div>
      </Modal.Footer>
    </Modal>
  );
}

export default GigDetailModal;
