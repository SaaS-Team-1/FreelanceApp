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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="w-full max-w-2xl rounded-lg bg-white p-6 shadow-xl">
        <h2 className="mb-6 text-2xl font-bold text-gray-800">{title}</h2>
        <div className="space-y-6">
          {/* Title Input */}
          <div>
            <label className="block text-sm font-medium text-slate-700">Title</label>
            <input
              type="text"
              value={editedGig.title}
              onChange={(e) =>
                setEditedGig({ ...editedGig, title: e.target.value })
              }
              className="mt-1 w-full rounded-lg border-gray-300 bg-slate-100 p-3 text-gray-800 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-500"
            />
          </div>
          {/* Description Input */}
          <div>
            <label className="block text-sm font-medium text-slate-700">Description</label>
            <textarea
              value={editedGig.description}
              onChange={(e) =>
                setEditedGig({ ...editedGig, description: e.target.value })
              }
              className="mt-1 w-full rounded-lg border-slate-300 bg-gray-100 p-3 text-gray-800 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-500"
              rows={6}
            />
          </div>
          {/* Price and Location */}
          <div className="flex flex-col gap-6 md:flex-row">
            <div className="relative w-full">
              <label className="block text-sm font-medium text-slate-700">Price</label>
              <input
                type="number"
                disabled={mode === "edit"}
                value={editedGig.price}
                onChange={(e) =>
                  setEditedGig({ ...editedGig, price: Number(e.target.value) })
                }
                className="mt-1 w-full rounded-lg border-slate-300 bg-slate-100 p-3 pr-10 text-slate-800 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-500"
                placeholder="0"
              />
              <FaDollarSign className="absolute bottom-3 right-4 text-slate-400" />
            </div>
            <div className="relative w-full">
              <label className="block text-sm font-medium text-slate-700">Location</label>
              <input
                type="text"
                value={editedGig.location}
                onChange={(e) =>
                  setEditedGig({ ...editedGig, location: e.target.value })
                }
                className="mt-1 w-full rounded-lg border-slate-300 bg-slate-100 p-3 pr-10 text-slate-800 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-500"
              />
              <FaMapMarkerAlt className="absolute bottom-3 right-4 text-slate-400" />
            </div>
          </div>
          {/* Category Input */}
          <div className="relative">
            <label className="block text-sm font-medium text-slate-700">Category</label>
            <input
              type="text"
              value={editedGig.category}
              onChange={(e) =>
                setEditedGig({ ...editedGig, category: e.target.value })
              }
              className="mt-1 w-full rounded-lg border-slate-300 bg-slate-100 p-3 pr-10 text-slate-800 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-500"
            />
            <FaTag className="absolute bottom-3 right-4 text-slate-400" />
          </div>
          {/* Due Date Picker */}
          <div>
            <DatePicker
              dueDate={editedGig.dueDate}
              onDateChange={(newTimestamp) =>
                setEditedGig({ ...editedGig, dueDate: newTimestamp })
              }
            />
          </div>
        </div>
        {/* Buttons */}
        <div className="mt-6 flex justify-end gap-4">
          <CustomButton
            label="Cancel"
            onClick={onClose}
            color="white"
            textColor="primary"
            size="medium"
            outline={true}
            rounded={false}
          />
          <CustomButton
            label={mode === "edit" ? "Save Changes" : "Create Gig"}
            onClick={handleSave}
            color="black"
            textColor="white"
            size="medium"
            rounded={false}
          />
        </div>
      </div>
    </div>
  );
};

export default EditCreateGigModal;
