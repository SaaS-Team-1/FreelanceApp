import React from "react";
import ReactDOM from "react-dom";
import CustomButton from "@/components/Buttons/CustomButton";
import { Gig } from "@/utils/database/schema";
import { FaDollarSign, FaCalendarAlt, FaMapMarkerAlt } from "react-icons/fa";
import Badge from "@/components/Buttons/CustomBadge";
import { Firestore, doc, setDoc } from "firebase/firestore";

interface GigDetailModalProps {
  gig: Gig;
  isOpen: boolean;
  onClose: () => void;
  userId?: string; // Optional logged-in user's ID
  db?: Firestore; // Optional Firestore database instance
}

const GigDetailModal: React.FC<GigDetailModalProps> = ({ gig, isOpen, onClose, userId, db }) => {
  if (!isOpen) return null;

  const handleApply = async () => {
    if (!userId || !db) return;

    // try {
    //   const applicationRef = doc(db, "applications", `${userId}_${gig.gigId}`);
    //   await setDoc(applicationRef, {
    //     gigId: gig.gigId,
    //     userId: userId,
    //     appliedAt: new Date().toISOString(),
    //   });
    //   alert("Application submitted successfully!");
    //   onClose(); // Close the modal after applying
    // } catch (error) {
    //   console.error("Error applying to gig:", error);
    //   alert("Failed to apply for the gig. Please try again.");
    // }
  };

  const location = gig.location || "Remote";

  return ReactDOM.createPortal(
    <>
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm"></div>
      <div className="fixed inset-0 z-50 flex items-center justify-center">
        <div className="w-3/4 max-w-4xl overflow-hidden rounded-lg bg-gray-800 p-8">
          <div className="pr-4">
            <h1 className="text-2xl font-bold text-white sm:text-4xl">{gig.title}</h1>
            <p className="mb-4 text-gray-300">{gig.description}</p>

            <div className="mb-6 flex flex-col justify-center gap-6 text-sm text-white sm:flex-row">
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
                      ? `${new Date(gig.dueDate.seconds * 1000).toLocaleDateString("en-GB")}`
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
    </>,
    document.body
  );
};

export default GigDetailModal;
