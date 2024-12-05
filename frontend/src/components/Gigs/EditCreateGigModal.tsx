import React, { useState, useEffect } from "react";
import { Gig } from "@/utils/database/schema";
import { Timestamp, doc, updateDoc } from "firebase/firestore"; // Firestore imports
import CustomButton from "@/components/Buttons/CustomButton";
import { FaDollarSign, FaTag, FaMapMarkerAlt } from "react-icons/fa";
import DatePicker from "@/components/Calendar/DatePicker";
import { gigsRef } from "@/utils/database/collections"; // Your Firestore collection reference
import { useFirestore } from "@/utils/reactfire"; // Hook for Firestore instance

interface EditCreateGigModalProps {
  gig?: Gig;
  title: string;
  isOpen: boolean;
  onSave: (gig: Gig) => void;
  onClose: () => void;
  mode: "edit" | "create";
}

const EditCreateGigModal: React.FC<EditCreateGigModalProps> = ({
  gig,
  title,
  isOpen,
  onSave,
  onClose,
  mode,
}) => {
  const db = useFirestore(); // Firestore instance
  const [editedGig, setEditedGig] = useState<Gig>(
    gig || {
      gigId: "",
      title: "",
      description: "",
      price: 0,
      dueDate: new Timestamp(new Date().getTime() / 1000, 0),
      status: "open",
      listerId: "",
      selectedApplicantId: undefined,
      createdAt: new Timestamp(new Date().getTime() / 1000, 0),
      updatedAt: new Timestamp(new Date().getTime() / 1000, 0),
      applicantIds: [],
      location: "Remote",
      category: "",
    },
  );

  useEffect(() => {
    if (gig) {
      setEditedGig(gig);
    }
  }, [gig, isOpen]);

  const validateGig = (gig: Gig) => {
    const errors: string[] = [];

    if (!gig.title.trim()) errors.push("Title is required.");
    if (!gig.description.trim()) errors.push("Description is required.");
    if (gig.description.trim().split(/\s+/).length < 25)
      errors.push("Description must contain at least 25 words.");
    if (!gig.location.trim()) errors.push("Location is required.");
    if (!gig.category.trim()) errors.push("Category is required.");
    if (gig.price <= 0) errors.push("Price must be greater than 0.");
    if (!gig.dueDate || !(gig.dueDate instanceof Timestamp))
      errors.push("Due Date is required and must be a valid timestamp.");
    if (
      !gig.status ||
      ![
        "open",
        "in-progress",
        "awaiting-confirmation",
        "completed",
        "deleted",
        "problem-reported",
      ].includes(gig.status)
    )
      errors.push("Status must be one of the predefined values.");
    if (!gig.listerId.trim()) errors.push("Lister ID is required.");

    return errors;
  };

  const handleSave = async () => {
    const errors = validateGig(editedGig);
    if (errors.length > 0) {
      alert(`Please fix the following errors:\n- ${errors.join("\n- ")}`);
      return;
    }

    try {
      if (mode === "edit" && gig) {
        const gigDocRef = doc(gigsRef(db), gig.gigId); // Reference to the gig document
        await updateDoc(gigDocRef, {
          title: editedGig.title.trim(),
          description: editedGig.description.trim(),
          price: editedGig.price,
          dueDate: editedGig.dueDate,
          status: editedGig.status,
          location: editedGig.location.trim(),
          category: editedGig.category.trim(),
          updatedAt: Timestamp.now(),
        });
        alert("Gig successfully updated.");
      } else if (mode === "create") {
        alert("Create mode is not implemented in this example.");
      }

      onSave(editedGig); // Notify parent of the save
      onClose();
    } catch (error) {
      console.error("Error updating gig:", error);
      alert("There was an error saving the gig. Please try again.");
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm">
      <div className="w-[800px] max-w-full rounded-lg bg-gray-900 p-6 text-white shadow-lg">
        <h2 className="mb-4 text-3xl font-bold">{title}</h2>
        <div className="space-y-4">
          {/* Title Input */}
          <div>
            <label className="mb-2 block text-sm font-bold">Title</label>
            <input
              type="text"
              value={editedGig.title}
              onChange={(e) =>
                setEditedGig({ ...editedGig, title: e.target.value })
              }
              className="w-full rounded border-gray-700 bg-gray-800 p-2 text-white"
            />
          </div>
          {/* Description Input */}
          <div>
            <label className="mb-2 block text-sm font-bold">Description</label>
            <textarea
              value={editedGig.description}
              onChange={(e) =>
                setEditedGig({ ...editedGig, description: e.target.value })
              }
              className="h-40 w-full rounded border-gray-700 bg-gray-800 p-2 text-white"
            />
          </div>
          {/* Price and Location on the Same Line */}
          <div className="flex gap-4">
            <div className="relative w-1/2">
              <label className="mb-2 block text-sm font-bold">Price</label>
              <input
                type="number"
                disabled={true}
                value={editedGig.price}
                onChange={(e) =>
                  setEditedGig({ ...editedGig, price: Number(e.target.value) })
                }
                className="w-full rounded border-gray-700 bg-gray-800 p-2 pr-10 text-white"
              />
              <FaDollarSign className="absolute bottom-3 right-3 text-gray-100" />
            </div>
            <div className="relative w-1/2">
              <label className="mb-2 block text-sm font-bold">Location</label>
              <input
                type="text"
                value={editedGig.location}
                onChange={(e) =>
                  setEditedGig({ ...editedGig, location: e.target.value })
                }
                className="w-full rounded border-gray-700 bg-gray-800 p-2 pr-10 text-white"
              />
              <FaMapMarkerAlt className="absolute bottom-3 right-3 text-gray-100" />
            </div>
          </div>
          {/* Category Input */}
          <div className="relative">
            <label className="mb-2 block text-sm font-bold">Category</label>
            <input
              type="text"
              value={editedGig.category}
              onChange={(e) =>
                setEditedGig({ ...editedGig, category: e.target.value })
              }
              className="w-full rounded border-gray-700 bg-gray-800 p-2 pr-10 text-white"
            />
            <FaTag className="absolute bottom-3 right-3 text-gray-100" />
          </div>
          {/* Date Picker */}
          <DatePicker
            dueDate={editedGig.dueDate}
            onDateChange={(newTimestamp) =>
              setEditedGig({ ...editedGig, dueDate: newTimestamp })
            }
          />
        </div>
        {/* Buttons */}
        <div className="mt-6 flex justify-end gap-4">
          <CustomButton
            label="Cancel"
            onClick={onClose}
            color="white"
            textColor="primary"
            size="small"
            outline={true}
            rounded={true}
            customStyle={{ borderColor: "#44B0E8" }}
          />
          <CustomButton
            label={mode === "edit" ? "Save Changes" : "Create Gig"}
            onClick={handleSave}
            color="primary"
            textColor="white"
            size="small"
            rounded={true}
          />
        </div>
      </div>
    </div>
  );
};

export default EditCreateGigModal;
