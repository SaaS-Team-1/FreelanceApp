import React, { useState, useEffect } from "react";
import { Gig } from "@/utils/database/schema";
import { Timestamp } from "firebase/firestore";
import CustomButton from "@/components/Buttons/CustomButton";

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
      applicantIds: [],
      location: "Remote",
      category: "",
    }
  );

  useEffect(() => {
    if (gig) {
      setEditedGig(gig);
    }
  }, [gig, isOpen]);

  const handleSave = () => {
    const wordCount = editedGig.description.trim().split(/\s+/).length;

    if (wordCount < 25) {
      alert("Description must contain at least 25 words.");
      return;
    }

    onSave(editedGig);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm">
      <div className="w-[800px] max-w-full rounded-lg bg-gray-900 p-6 text-white shadow-lg">
        <h2 className="mb-4 text-3xl font-bold">{title}</h2>
        <div className="space-y-4">
          <div>
            <label className="mb-2 block text-sm font-bold">Title</label>
            <input
              type="text"
              value={editedGig.title}
              onChange={(e) => setEditedGig({ ...editedGig, title: e.target.value })}
              className="w-full rounded border-gray-700 bg-gray-800 p-2 text-white"
            />
          </div>
          <div>
            <label className="mb-2 block text-sm font-bold">Description</label>
            <textarea
              value={editedGig.description}
              onChange={(e) => setEditedGig({ ...editedGig, description: e.target.value })}
              className="h-40 w-full rounded border-gray-700 bg-gray-800 p-2 text-white"
            />
          </div>
          <div className="flex gap-4">
            <div className="w-1/2">
              <label className="mb-2 block text-sm font-bold">Price</label>
              <input
                type="number"
                value={editedGig.price}
                onChange={(e) => setEditedGig({ ...editedGig, price: Number(e.target.value) })}
                className="w-full rounded border-gray-700 bg-gray-800 p-2 text-white"
              />
            </div>
            <div className="w-1/2">
              <label className="mb-2 block text-sm font-bold">Category</label>
              <input
                type="text"
                value={editedGig.category}
                onChange={(e) => setEditedGig({ ...editedGig, category: e.target.value })}
                className="w-full rounded border-gray-700 bg-gray-800 p-2 text-white"
              />
            </div>
          </div>
          <div>
            <label className="mb-2 block text-sm font-bold">Location</label>
            <input
              type="text"
              value={editedGig.location}
              onChange={(e) => setEditedGig({ ...editedGig, location: e.target.value })}
              className="w-full rounded border-gray-700 bg-gray-800 p-2 text-white"
            />
          </div>
          <div>
            <label className="mb-2 block text-sm font-bold">Due Date</label>
            <input
              type="date"
              value={
                editedGig.dueDate
                  ? new Date(editedGig.dueDate.seconds * 1000).toISOString().split("T")[0]
                  : ""
              }
              onChange={(e) =>
                setEditedGig({
                  ...editedGig,
                  dueDate: new Timestamp(new Date(e.target.value).getTime() / 1000, 0),
                })
              }
              className="w-full rounded border-gray-700 bg-gray-800 p-2 text-white"
            />
          </div>
        </div>
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
