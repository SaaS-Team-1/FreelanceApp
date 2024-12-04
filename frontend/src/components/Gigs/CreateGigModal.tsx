import React, { useState } from "react";
import { Gig } from "@/utils/database/schema";
import { Timestamp, addDoc, updateDoc } from "firebase/firestore"; // Firestore imports
import CustomButton from "@/components/Buttons/CustomButton";
import { FaDollarSign, FaTag, FaMapMarkerAlt } from "react-icons/fa";
import DatePicker from "@/components/Calendar/DatePicker";
import { gigsRef } from "@/utils/database/collections"; // Your Firestore collection reference
import { useFirestore, useUser } from "@/utils/reactfire"; // Hook for Firestore instance

interface CreateGigModalProps {
  onClose: () => void;
  onCreate: () => void;
}

const CreateGigModal: React.FC<CreateGigModalProps> = ({ onClose, onCreate }) => {
  const db = useFirestore(); // Firestore instance
  const { data: user } = useUser();
  if(!user){
    return;
  }
  const [newGig, setNewGig] = useState<Gig>({
    gigId: "", 
    title: "",
    description: "",
    price: 0,
    dueDate: new Timestamp(Math.floor(Date.now() / 1000), 0),
    status: "open",
    listerId: user.uid as string, // Should be populated by the logged-in user
    selectedApplicantId: "",
    createdAt: new Timestamp(Math.floor(Date.now() / 1000), 0),
    updatedAt: new Timestamp(Math.floor(Date.now() / 1000), 0),
    location: "Remote",
    category: "",
  });

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

    return errors;
  };

  const handleCreate = async () => {
    const errors = validateGig(newGig);
    if (errors.length > 0) {
      alert(`Please fix the following errors:\n- ${errors.join("\n- ")}`);
      return;
    }

    try {
      const newGigData = {
        ...newGig,
        createdAt: Timestamp.now(),
        updatedAt: Timestamp.now(),
      };

      // Add gig to Firestore
      const gigDoc = await addDoc(gigsRef(db), newGigData);
      await Promise.all([
        updateDoc(gigDoc, {gigId: gigDoc.id})
      ]);

      onCreate;

      alert("Gig successfully created.");
      onClose();
    } catch (error) {
      console.error("Error creating gig:", error);
      alert("There was an error creating the gig. Please try again.");
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm">
      <div className="w-[800px] max-w-full rounded-lg bg-gray-900 p-6 text-white shadow-lg">
        <h2 className="mb-4 text-3xl font-bold">Create New Gig</h2>
        <div className="space-y-4">
          {/* Title Input */}
          <div>
            <label className="mb-2 block text-sm font-bold">Title</label>
            <input
              type="text"
              value={newGig.title}
              onChange={(e) =>
                setNewGig({ ...newGig, title: e.target.value })
              }
              className="w-full rounded border-gray-700 bg-gray-800 p-2 text-white"
            />
          </div>
          {/* Description Input */}
          <div>
            <label className="mb-2 block text-sm font-bold">Description</label>
            <textarea
              value={newGig.description}
              onChange={(e) =>
                setNewGig({ ...newGig, description: e.target.value })
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
                value={newGig.price}
                onChange={(e) =>
                  setNewGig({ ...newGig, price: Number(e.target.value) })
                }
                className="w-full rounded border-gray-700 bg-gray-800 p-2 pr-10 text-white"
              />
              <FaDollarSign className="absolute bottom-3 right-3 text-gray-100" />
            </div>
            <div className="relative w-1/2">
              <label className="mb-2 block text-sm font-bold">Location</label>
              <input
                type="text"
                value={newGig.location}
                onChange={(e) =>
                  setNewGig({ ...newGig, location: e.target.value })
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
              value={newGig.category}
              onChange={(e) =>
                setNewGig({ ...newGig, category: e.target.value })
              }
              className="w-full rounded border-gray-700 bg-gray-800 p-2 pr-10 text-white"
            />
            <FaTag className="absolute bottom-3 right-3 text-gray-100" />
          </div>
          {/* Date Picker */}
          <DatePicker
            dueDate={newGig.dueDate}
            onDateChange={(newTimestamp) =>
              setNewGig({ ...newGig, dueDate: newTimestamp })
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
            label="Create Gig"
            onClick={handleCreate}
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

export default CreateGigModal;