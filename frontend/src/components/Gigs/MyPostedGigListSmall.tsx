import React from "react";
import { FaComments } from "react-icons/fa";
import PostedGigItemHome from "./PostedGigItemHome";
import { Gig, User } from "@/utils/database/schema";
import Badge from "@/components/Buttons/CustomBadge";
import CustomButton from "@/components/Buttons/CustomButton";
import { UndoButton } from "@/components/Buttons/UndoButton";
import { useNavigate } from "react-router-dom";
import { FaCheck } from "react-icons/fa";


interface PostedGigListSmallProps {
  gigs: { gig: Gig; lister: User }[];
  onSelectGig?: (gig: Gig) => void;
  onSeeMoreClick?: (gig: Gig) => void;
  onCompleteClick?: (gigId: string) => void;
  onUndoClick ? :(gigId: string) => void;
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
  onUndoClick ,
  enableSelection = true,
  selectedGig = null,
  showSeeMoreButton = true,
  showChatIcon = false,
  showCompletedButton = false,
  showDateWithLine = false,
  showUndoButton = false,
  hoverEffect = true,
}: PostedGigListSmallProps) {
  const navigate = useNavigate();

  const formatDate = (dueDate: any) => {
    try {
      // Handle different date formats
      const date = dueDate?.seconds 
        ? new Date(dueDate.seconds * 1000)  // Firestore timestamp
        : dueDate instanceof Date 
        ? dueDate                           // JavaScript Date object
        : new Date(dueDate);                // String or number timestamp

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
          className={`relative rounded-lg p-4 shadow-lg transition-transform duration-200 ease-in-out 
            ${selectedGig && selectedGig.title === gig.title
              ? "bg-[rgba(5,54,78,0.59)] text-white"
              : "bg-gray-900 text-gray-300"
            } ${enableSelection ? "cursor-pointer" : ""}
            ${hoverEffect ? "hover:bg-gray-700" : ""}`}
          onClick={() => enableSelection && onSelectGig && onSelectGig(gig)}
        >


          {/* Header with title and date */}
          <div className="mb-2">
            <h3 className="whitespace-normal break-words text-sm font-semibold text-white">
              {gig.title}
            </h3>
            {showDateWithLine && (
              <p className="mt-1 text-xs text-orange-500">
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
                  rounded={true}
                />
              )}
              {showUndoButton && (
                <UndoButton 
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
                  rounded={true}
                />
              )}
              {showSeeMoreButton && (
                <CustomButton
                  label="See More"
                  onClick={() => onSeeMoreClick && onSeeMoreClick(gig)}
                  color="primary"
                  textColor="white"
                  size="small"
                  rounded={true}
                />
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

export default PostedGigListSmall
