import React from "react";
import { FaComments } from "react-icons/fa";
import PostedGigItemHome from "./PostedGigItemHome";
import { Gig, User } from "@/utils/database/schema";
import Badge from "@/components/Buttons/CustomBadge";
import CustomButton from "@/components/Buttons/CustomButton";
import { UndoButton } from "@/components/Buttons/UndoButton";
import { useNavigate } from "react-router-dom";
import { FaCheck } from "react-icons/fa";
import { HiX } from "react-icons/hi";


interface PostedGigListSmallProps {
  gigs: { gig: Gig; lister: User }[];
  onSelectGig?: (gig: Gig) => void;
  onSeeMoreClick?: (gig: Gig) => void;
  onCompleteClick?: (gigId: string) => void;
  onUndoClick?: (gigId: string) => void;
  enableSelection?: boolean;
  selectedGig?: Gig | null;
  showSeeMoreButton?: boolean;
  showChatIcon?: boolean;
  showCompletedButton?: boolean;
  showDateWithLine?: boolean;
  showUndoButton?: boolean;
  hoverEffect?: boolean;
}

function PostedGigListSmall({
  gigs,
  onSelectGig,
  onSeeMoreClick,
  onCompleteClick,
  onUndoClick,
  enableSelection = true,
  selectedGig = null,
  showSeeMoreButton = true,
  showChatIcon = false,
  showCompletedButton = false,
  showDateWithLine = false,
  showUndoButton = false,
  hoverEffect = false,
}: PostedGigListSmallProps) {
  const navigate = useNavigate();

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

  const handleMessageClick = (userId: string) => {
    navigate(`/app/chat?user=${userId}`);
  };

  return (
    <div className="space-y-4">
      {gigs.map(({ gig, lister }, index) => (
        <div
          key={index}
          className={`relative rounded-lg p-4 shadow-sm transition-transform duration-200 ease-in-out ${
            selectedGig && selectedGig.title === gig.title
              ? "border border-blue-400 bg-blue-100 text-blue-700"
              : "bg-white text-slate-800"
          } ${enableSelection ? "cursor-pointer" : ""} 
            ${hoverEffect ? "hover:bg-slate-100" : ""}`}
          onClick={() => enableSelection && onSelectGig && onSelectGig(gig)}
        >
          {/* Header with title and date */}
          <div className="mb-2">
            <h3 className="whitespace-normal break-words text-lg font-semibold text-slate-900 pr-[120px]">
              {gig.title}
            </h3>
            {showDateWithLine && (
              <p className="mt-1 text-xs text-slate-500">
                {formatDate(gig.dueDate)}
              </p>
            )}
          </div>

          {/* Divider line */}
          {showDateWithLine && <div className="mt-1 border-t border-white" />}

          {/* Button row */}
          <div className="mt-4 flex items-center justify-between gap-2">
            <div className="flex gap-2">
              {showCompletedButton && (
                <CustomButton
                  label="Complete"
                  icon={FaCheck}
                  onClick={() => onCompleteClick && onCompleteClick(gig.gigId)}
                  color="green"
                  textColor="white"
                  size="small"
                  rounded={false}
                />
              )}
              {showUndoButton && (
                <CustomButton
                  label="Undo"
                  icon={HiX}
                  color="red"
                  textColor="black"
                  size="small"
                  rounded={false}
                  onClick={() => onUndoClick && onUndoClick(gig.gigId)} 
                />
              )}
            </div>

            <div className="flex gap-2">
              {showChatIcon && (
                <CustomButton
                  onClick={() => handleMessageClick(lister.userId)}
                  color="primary"
                  textColor="white"
                  size="medium"
                  icon={FaComments}
                  iconPosition="middle"
                  rounded={false}
                />
              )}
              {showSeeMoreButton && (
                <CustomButton
                  label="See More"
                  onClick={() => onSeeMoreClick && onSeeMoreClick(gig)}
                  color="primary"
                  textColor="white"
                  size="small"
                  rounded={false}
                />
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

export default PostedGigListSmall;
