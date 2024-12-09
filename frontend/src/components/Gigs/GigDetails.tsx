import React, { useState, useEffect } from "react";
import { User, Gig } from "@/utils/database/schema";
import CustomButton from "@/components/Buttons/CustomButton"; // Import your button component
import EditCreateGigModal from "./EditCreateGigModal"; // Import your modal component
import {
  FaPen,
  FaTrashAlt,
  FaDollarSign,
  FaCalendarAlt,
  FaMapMarkerAlt,
} from "react-icons/fa";
import UserProfilePicture from "@/components/Avatar/UserProfilePicture"; // Import the UserProfilePicture component

import { useFirestore } from "@/utils/reactfire";
import {
  doc,
  updateDoc,
  getDocs,
  query,
  where,
  writeBatch,
  serverTimestamp,
  addDoc,
} from "firebase/firestore";
import ReactDOM from "react-dom";
import {
  applicationsRef,
  gigsRef,
  chatsRef,
  notificationsRef,
} from "@/utils/database/collections";
import { Application } from "@/utils/database/schema";
import { Badge } from "flowbite-react";

interface GigDetailsProps {
  gig: Gig;
  user: User | null; // Allow user to be nullable
  onEditSave: (updatedGig: Gig) => void;
  onDelete: (gigId: string) => void;
  showEdit?: boolean; // Optional prop to show/hide Edit button
  showDelete?: boolean; // Optional prop to show or remove Delete button
  showSeeMoreButton?: boolean; // Optional prop to show/hide See More button
}

const GigDetails: React.FC<GigDetailsProps> = ({
  gig,
  user,
  onDelete,
  showEdit = true, // Default to show the Edit button
  showDelete = true, // Default to not show the Delete button
}) => {
  const db = useFirestore();
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false); // Modal state for "See More"
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false); // Modal state for delete confirmation
  const [currentGig, setCurrentGig] = useState<Gig>(gig);

  const location = gig.location || user?.profile?.location || "Remote";

  // Update currentGig whenever a new gig is selected
  useEffect(() => {
    setCurrentGig(gig);
  }, [gig]);

  const formatDate = (dueDate: any) => {
    try {
      // Handle different date formats
      const date = dueDate?.seconds
        ? new Date(dueDate.seconds * 1000) // Firestore timestamp
        : dueDate instanceof Date
          ? dueDate // JavaScript Date object
          : new Date(dueDate); // String or number timestamp

      return date.toLocaleDateString("en-GB", {
        weekday: "long",
        day: "2-digit",
        month: "long",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
    } catch (error) {
      console.error("Error formatting date:", error);
      return "Date unavailable";
    }
  };

  const handleDeleteConfirm = async () => {
    try {
      if (gig.status !== "open") {
        alert("You can only delete a gig if its status is 'open'.");
        return;
      }
      await updateDoc(doc(gigsRef(db), gig.gigId), { status: "deleted" });

      const applicationsQuery = query(
        applicationsRef(db),
        where("gigId", "==", gig.gigId),
      );
      const applicationsSnapshot = await getDocs(applicationsQuery);

      for (const applicationDoc of applicationsSnapshot.docs) {
        const applicationData = applicationDoc.data() as Application;

        await updateDoc(doc(applicationsRef(db), applicationDoc.id), {
          status: "discarded",
        });

        await addDoc(notificationsRef(db), {
          userId: applicationData.applicantId,
          notificationMessage: `Your pending gig "${gig.title}" has been deleted.`,
          createdAt: serverTimestamp(),
        });

        if (applicationData.chatId) {
          await updateDoc(doc(chatsRef(db), applicationData.chatId), {
            lastUpdate: serverTimestamp(),
          });
        }
      }

      // Notify the parent component
      onDelete(gig.gigId);
      setIsDeleteModalOpen(false);
    } catch (error) {
      console.error("Error deleting gig or updating applications:", error);
      alert("Failed to delete the gig. Please try again.");
    }
  };

  const renderDeleteButton = () => {
    if (!showDelete) return null;
    return (
      <CustomButton
        label="Delete"
        onClick={() => setIsDeleteModalOpen(true)}
        disabled={gig.status !== "open"}
        color={"primary"}
        textColor={"black"}
        size="medium"
        rounded={false}
        icon={FaTrashAlt}
        iconPosition="left"
        customStyle={{
          backgroundColor:
            gig.status === "open" ? "bg-blue-400" : "bg-gray-400",
          padding: "6px 20px",
          width: "120px",
        }}
      />
    );
  };

  const renderGigDetails = (isModal: boolean = false) => (
    <div className={isModal ? "pr-4" : "h-fit pr-4"}>
      <div className="mb-1 flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900 sm:text-4xl">
          Gig Details
        </h1>
        <div className="flex flex-col gap-2">
          {showEdit && (
            <CustomButton
              label="Edit"
              onClick={() => {
                setIsEditModalOpen(true);
                setIsDetailModalOpen(false); // Close Gig Details Modal
              }}
              disabled={gig.status !== "open"}
              color={"primary"}
              textColor={"black"}
              size="medium"
              rounded={false}
              icon={FaPen}
              iconPosition="left"
              customStyle={{
                backgroundColor:
                  gig.status === "open" ? "bg-blue-400" : "bg-gray-400",
              }}
            />
          )}
          {renderDeleteButton()}
        </div>
      </div>

      <div className="mb-6 flex items-center">
        <p className="mr-2 text-sm text-gray-900">
          <strong>Status:</strong>
        </p>
        <Badge
          color={
            gig.status === "open"
              ? "green"
              : gig.status === "in-progress"
                ? "secondary"
                : gig.status === "awaiting-confirmation"
                  ? "warning"
                  : "gray"
          }
        >
          {gig.status}
        </Badge>
      </div>

      <div className="mb-4 flex items-start gap-4">
        <UserProfilePicture
          user={
            user ||
            ({
              profile: { bio: "", location: "", picture: "" },
              stats: {},
            } as unknown as User)
          }
          size="large"
          hoverDetails={true}
          rounded={true}
        />
        <h2 className="text-2xl font-semibold text-gray-900">{gig.title}</h2>
      </div>

      <p className="mb-2 text-sm font-bold text-gray-900">Description:</p>
      <p className="mb-4 text-gray-900">{gig.description}</p>

      <div className="mb-6 flex flex-col justify-center gap-6 text-sm text-gray-900 sm:flex-row">
        <div className="flex flex-col items-center">
          <div className="flex items-center">
            <FaDollarSign className="mr-2" />
            <span>{gig.price ? `${gig.price}` : "TBD"}</span>
          </div>
          <span className="ml-4 text-xs text-gray-900">Price</span>
        </div>
        <div className="flex flex-col items-center">
          <div className="flex  items-center">
            <FaCalendarAlt className="mr-2" />
            <span>{formatDate(gig.dueDate)}</span>
          </div>
          <span className="ml-2 text-xs text-gray-900">Due Date</span>
        </div>
        <div className="flex flex-col items-center">
          <div className="flex items-center">
            <FaMapMarkerAlt className="mr-2" />
            <span>{location}</span>
          </div>
          <span className="ml-6 text-xs text-gray-900">Location</span>
        </div>
      </div>
      <div>
        <h4 className="text-sm font-semibold text-gray-900">Tags:</h4>
        <div className="mt-2 flex gap-2">
          <Badge>{gig.category}</Badge>

          <Badge>{location}</Badge>

          <Badge>{gig.price ? `${gig.price} Tokens` : "TBD"}</Badge>
        </div>
      </div>
    </div>
  );

  const DetailModal = () => (
    <>
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm"></div>
      <div className="fixed inset-0 z-50 flex items-center justify-center">
        <div className="w-3/4 max-w-4xl overflow-hidden rounded-lg bg-white p-8">
          {renderGigDetails(true)}
          <div className="mt-4 flex justify-end">
            <CustomButton
              label="Close"
              onClick={() => setIsDetailModalOpen(false)}
              color="red"
              textColor="black"
              size="medium"
              rounded={false}
            />
          </div>
        </div>
      </div>
    </>
  );

  return (
    <div className="relative">
      <div className="rounded-lg bg-white p-4 shadow-lg">
        {renderGigDetails()}
      </div>

      {isEditModalOpen && (
        <EditCreateGigModal
          gig={currentGig}
          isOpen={isEditModalOpen}
          onClose={() => setIsEditModalOpen(false)}
          editable
        />
      )}

      {/* Render Detail Modal using React Portal */}
      {isDetailModalOpen &&
        ReactDOM.createPortal(<DetailModal />, document.body)}

      {/* Render Delete Confirmation Modal */}
      {isDeleteModalOpen &&
        ReactDOM.createPortal(
          <>
            <div className="fixed inset-0 bg-white backdrop-blur-sm"></div>
            <div className="fixed inset-0 z-50 flex items-center justify-center">
              <div className="w-3/4 max-w-lg rounded-lg bg-white p-6">
                <h3 className="text-lg font-bold text-gray-800">
                  Are you sure you want to delete this gig?
                </h3>
                <p className="mt-2 text-gray-800">{gig.title}</p>
                <div className="mt-4 flex justify-end gap-4">
                  <CustomButton
                    label="Cancel"
                    onClick={() => setIsDeleteModalOpen(false)}
                    color="white"
                    textColor="primary"
                    size="small"
                    outline={true}
                    rounded={false}
                  />
                  <CustomButton
                    label="Confirm"
                    onClick={handleDeleteConfirm}
                    color="red"
                    textColor="black"
                    size="small"
                    rounded={false}
                  />
                </div>
              </div>
            </div>
          </>,
          document.body,
        )}
    </div>
  );
};

export default GigDetails;
