import React, { useState, useEffect } from "react";
import { Gig } from "@/utils/database/schema";
import { Timestamp, doc, updateDoc, addDoc } from "firebase/firestore";
import { FaDollarSign, FaMapMarkerAlt, FaClock } from "react-icons/fa";
import { gigsRef } from "@/utils/database/collections";
import { useFirestore, useUser } from "@/utils/reactfire";
import { Button, Datepicker } from "flowbite-react";

const categories = [
  "Academic Support & Tutoring",
  "Software Development & Programming",
  "Design & Creative Work",
  "Writing & Editing",
  "Research Assistance",
  "Data Entry & Analysis",
  "Marketing & Social Media",
  "Translation & Language Services",
  "Event Planning & Support",
  "Technical & IT Support",
  "Others",
];

interface GigModalProps {
  gig?: Gig;
  isOpen: boolean;
  onClose: () => void;
  editable?: boolean;
}

function EditCreateGigModal({
  gig,
  isOpen,
  onClose,
  editable = false,
}: GigModalProps) {
  const db = useFirestore();
  const { data: user } = useUser();

  const [gigData, setGigData] = useState<Gig>(() => {
    const defaultGig: Gig = {
      gigId: "",
      title: "",
      description: "",
      price: 0,
      dueDate: new Timestamp(Math.floor(Date.now() / 1000), 0),
      status: "open",
      listerId: user?.uid || "",
      selectedApplicantId: "",
      createdAt: new Timestamp(Math.floor(Date.now() / 1000), 0),
      updatedAt: new Timestamp(Math.floor(Date.now() / 1000), 0),
      location: "Remote",
      category: "",
    };

    return gig || defaultGig;
  });

  // Handle escape key and outside clicks
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };

    if (isOpen) {
      document.addEventListener("keydown", handleEscape);
      return () => document.removeEventListener("keydown", handleEscape);
    }
  }, [isOpen, onClose]);

  useEffect(() => {
    if (gig && isOpen) {
      setGigData(gig);
    }
  }, [gig, isOpen]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      if (editable && gig) {
        const gigDocRef = doc(gigsRef(db), gig.gigId);
        await updateDoc(gigDocRef, {
          title: gigData.title.trim(),
          description: gigData.description.trim(),
          price: gigData.price,
          dueDate: gigData.dueDate,
          status: gigData.status,
          location: gigData.location.trim(),
          category: gigData.category.trim(),
          updatedAt: Timestamp.now(),
        });
        alert("Gig successfully updated.");
        onClose();
      } else {
        const newGigData = {
          ...gigData,
          createdAt: Timestamp.now(),
          updatedAt: Timestamp.now(),
        };
        const gigDoc = await addDoc(gigsRef(db), newGigData);
        await updateDoc(gigDoc, { gigId: gigDoc.id });
        alert("Gig successfully created.");
        onClose();
      }
    } catch (error) {
      console.error(`Error ${editable ? "updating" : "creating"} gig:`, error);
      alert(
        `There was an error ${editable ? "updating" : "creating"} the gig. Please try again.`,
      );
    }
  };

  const handleDateChange = (date: Date | null) => {
    if (!date) return;
    const newTimestamp = Timestamp.fromDate(date);
    setGigData({ ...gigData, dueDate: newTimestamp });
  };

  const handleTimeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const [hours, minutes] = e.target.value.split(":").map(Number);
    const currentDate = gigData.dueDate.toDate();
    currentDate.setHours(hours, minutes);
    setGigData({ ...gigData, dueDate: Timestamp.fromDate(currentDate) });
  };

  const handleOutsideClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
      onClick={handleOutsideClick}
    >
      <div className="mx-10 w-full max-w-2xl rounded-xl bg-surface-container-lowest shadow-xl sm:m-0">
        <div className="mb-2 rounded-xl bg-primary-container p-2 text-center">
          <h3 className="text-2xl my-2 font-bold text-on-primary-container lg:text-4xl">
            {editable ? "Edit Gig" : "Create New Gig"}
          </h3>
        </div>

        <form
          onSubmit={handleSubmit}
          className="scrollbar max-h-[90vh] space-y-6 overflow-y-scroll p-6"
        >
          {/* Title Input */}
          <div>
            <label className="block text-sm font-bold text-primary">
              Title
            </label>
            <input
              type="text"
              value={gigData.title}
              onChange={(e) =>
                setGigData({ ...gigData, title: e.target.value })
              }
              required
              minLength={10}
              maxLength={60}
              className="mt-1 w-full rounded-lg border-0 bg-surface-container p-3 text-on-surface shadow-sm focus:border-0 focus:bg-surface-container-highest focus:ring-0"
            />
          </div>
          {/* Description Input */}
          <div>
            <label className="block text-sm font-bold text-primary">
              Description
            </label>
            <textarea
              value={gigData.description}
              onChange={(e) =>
                setGigData({ ...gigData, description: e.target.value })
              }
              required
              minLength={10}
              className="mt-1 w-full rounded-lg border-0 bg-surface-container p-3 text-on-surface shadow-sm focus:border-0 focus:bg-surface-container-highest focus:ring-0"
              rows={6}
            />
          </div>
          {/* Price and Location */}
          <div className="flex flex-col gap-6 md:flex-row">
            <div className="relative w-full">
              <label className="block text-sm font-bold text-primary">
                Price
              </label>
              <input
                type="number"
                disabled={editable}
                value={gigData.price || ""}
                onChange={(e) =>
                  setGigData({
                    ...gigData,
                    price:
                      e.target.value === "" ? 0 : parseFloat(e.target.value),
                  })
                }
                required
                min={10}
                max={1000000}
                className="mt-1 w-full rounded-lg border-0 bg-surface-container p-3 pr-10 text-on-surface shadow-sm focus:border-0 focus:bg-surface-container-highest focus:ring-0"
                placeholder="0"
              />
              <FaDollarSign className="text-slate-400 absolute bottom-4 right-4" />
            </div>
            <div className="relative w-full">
              <label className="block text-sm font-bold text-primary">
                Location
              </label>
              <input
                type="text"
                value={gigData.location}
                onChange={(e) =>
                  setGigData({ ...gigData, location: e.target.value })
                }
                required
                className="mt-1 w-full rounded-lg border-0 bg-surface-container p-3 pr-10 text-on-surface shadow-sm focus:border-0 focus:bg-surface-container-highest focus:ring-0"
              />
              <FaMapMarkerAlt className="text-slate-400 absolute bottom-4 right-4" />
            </div>
          </div>
          {/* Category Input */}
          <div className="relative w-full">
            <label className="block text-sm font-bold text-primary">
              Category
            </label>
            <select
              value={gigData.category}
              onChange={(e) =>
                setGigData({ ...gigData, category: e.target.value })
              }
              required
              className="mt-1 w-full appearance-none rounded-lg border-0 bg-surface-container p-3 pr-10 text-on-surface shadow-sm focus:border-0 focus:bg-surface-container-highest focus:ring-0"
            >
              <option value="" disabled className="text-on-surface">
                Select a category
              </option>
              {categories.map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
          </div>
          {/* Due Date Picker */}
          <div className="flex flex-col gap-4 md:flex-row">
            <div className="relative w-full md:w-1/2">
              <label className="mb-1 block text-sm font-bold text-primary">
                Due Date
              </label>
              <Datepicker
                minDate={new Date(Date.now())}
                color="surface-container"
                value={gigData.dueDate.toDate()}
                onChange={(date) => handleDateChange(date)}
                required
              />
            </div>
            <div className="relative w-full md:w-1/2">
              <label className="mb-1 block text-sm font-bold text-primary">
                Due Time
              </label>
              <div className="relative">
                <input
                  type="time"
                  value={gigData.dueDate.toDate().toLocaleTimeString("en-US", {
                    hour12: false,
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                  onChange={handleTimeChange}
                  className="block w-full rounded-lg border-0 bg-surface-container p-2.5 text-sm leading-none focus:border-0 focus:bg-surface-container-highest focus:ring-0"
                  required
                />
                <FaClock className="absolute right-4 top-3 text-gray-400" />
              </div>
            </div>
          </div>
          {/* Buttons */}
          <div className="mt-6 flex justify-end gap-4">
            <Button onClick={onClose} color="surface-container" type="button">
              Close
            </Button>
            <Button color="primary" type="submit">
              {editable ? "Save Changes" : "Create Gig"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default EditCreateGigModal;
