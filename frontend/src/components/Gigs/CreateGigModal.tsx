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

  const [newGig, setNewGig] = useState<Gig>({
    gigId: "",
    title: "",
    description: "",
    price: 0,
    dueDate: new Timestamp(Math.floor(Date.now() / 1000), 0), // Default to current date/time
    status: "open",
    listerId: user?.uid || "",
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
    if (gig.description.length < 2)
      errors.push("Description must contain at least 2 characters.");
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
      await updateDoc(gigDoc, { gigId: gigDoc.id });

      onCreate();

      alert("Gig successfully created.");
      onClose();
    } catch (error) {
      console.error("Error creating gig:", error);
      alert("There was an error creating the gig. Please try again.");
    }
  };

  const handleDateChange = (newTimestamp: Timestamp | null) => {
    if (newTimestamp && newTimestamp.seconds > 0) {
      setNewGig({ ...newGig, dueDate: newTimestamp });
    } else {
      alert("Invalid date or time. Please choose a valid date.");
      setNewGig({ ...newGig, dueDate: new Timestamp(Math.floor(Date.now() / 1000), 0) });
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm">
      <div className="w-full max-w-2xl rounded-lg bg-white p-6 shadow-xl">
        <h2 className="mb-4 text-3xl font-bold">Create New Gig</h2>
        <div className="space-y-4">
          {/* Title Input */}
          <div>
            <label className="mb-2 block text-sm font-medium text-slate-700">Title</label>
            <input
              type="text"
              value={newGig.title}
              onChange={(e) =>
                setNewGig({ ...newGig, title: e.target.value })
              }
              className="mt-1 w-full rounded-lg border-gray-300 bg-slate-100 p-3 text-gray-800 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-500"
            />
          </div>
          {/* Description Input */}
          <div>
            <label className="mb-2 block text-sm font-medium text-slate-700">Description</label>
            <textarea
              value={newGig.description}
              onChange={(e) =>
                setNewGig({ ...newGig, description: e.target.value })
              }
              className="mt-1 w-full rounded-lg border-gray-300 bg-gray-100 p-3 text-gray-800 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-500"
            />
          </div>
          {/* Price and Location on the Same Line */}
          <div className="flex flex-col gap-6 md:flex-row">
            <div className="relative w-full">
              <label className="block text-sm font-medium text-slate-700">Price</label>
              <input
                type="number"
                value={newGig.price || ""}
                onChange={(e) =>
                  setNewGig({
                    ...newGig,
                    price: e.target.value === "" ? 0 : parseFloat(e.target.value),
                  })
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
                value={newGig.location}
                onChange={(e) =>
                  setNewGig({ ...newGig, location: e.target.value })
                }
                className="mt-1 w-full rounded-lg border-slate-300 bg-slate-100 p-3 pr-10 text-gray-800 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-500"
              />
              <FaMapMarkerAlt className="absolute bottom-3 right-4 text-slate-400" />
            </div>
          </div>
          {/* Category Input */}
          <div className="relative">
            <label className="block text-sm font-medium text-slate-700">Category</label>
            <input
              type="text"
              value={newGig.category}
              onChange={(e) =>
                setNewGig({ ...newGig, category: e.target.value })
              }
              className="mt-1 w-full rounded-lg border-slate-300 bg-slate-100 p-3 pr-10 text-slate-800 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-500"
            />
            <FaTag className="absolute bottom-3 right-4 text-slate-400" />
          </div>
          {/* Date Picker */}
          <DatePicker dueDate={newGig.dueDate} onDateChange={handleDateChange} />
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
            label="Create Gig"
            onClick={handleCreate}
            color="primary"
            textColor="white"
            size="medium"
            rounded={false}
          />
        </div>
      </div>
    </div>
  );
};

export default CreateGigModal;
