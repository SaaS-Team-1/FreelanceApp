import React from "react";
import { FaComments } from "react-icons/fa";
import PostedGigItemHome from "./PostedGigItemHome";
import { Gig, User } from "@/utils/database/schema";
import Badge from "@/components/Buttons/CustomBadge";
import CustomButton from "@/components/Buttons/CustomButton";
import { UndoButton } from "@/components/Buttons/UndoButton";
import { useNavigate } from "react-router-dom";
import { FaCheck } from "react-icons/fa";


interface PostedGigListProps {
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

function PostedGigList({
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
}: PostedGigListProps) {
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
        className={`relative rounded-lg p-4 shadow-sm transition-transform duration-200 ease-in-out ${
          selectedGig && selectedGig.title === gig.title
            ? "border border-blue-400 bg-blue-100 text-blue-700"
            : "bg-white text-slate-800"
        } ${enableSelection ? "cursor-pointer" : ""} 
          ${hoverEffect ? "hover:bg-slate-100" : ""}`}
        onClick={() => enableSelection && onSelectGig && onSelectGig(gig)}
      >
          {showUndoButton && (
            <div className="absolute right-4 top-4">
              <UndoButton onClick={() => onUndoClick && onUndoClick(gig.gigId)} />
            </div>
          )}

          {showCompletedButton && (
            <div className="absolute right-12 top-5">
              <CustomButton
                label="Complete Gig"
                icon={FaCheck}
                onClick={() => onCompleteClick && onCompleteClick(gig.gigId)}
                color="green"
                textColor="white"
                size="small"
                rounded={true}
              />
            </div>
          )}

          {showChatIcon && (
            <div className="absolute right-2 top-6">
              <CustomButton
                onClick={() => handleMessageClick(lister.userId)}
                color="primary"
                textColor="white"
                size="small"
                icon={FaComments}
                iconPosition="middle"
                rounded={true}
              />
            </div>
          )}

          <div className="mb-2 flex items-center">
            <div className="ml-3 flex flex-col">
              <h3 className="whitespace-normal break-words text-lg font-semibold text-slate-900 pr-[120px]">
                {gig.title}</h3>
              {showDateWithLine && (
                <p className="mt-1 text-xs text-blue-600">
                  {formatDate(gig.dueDate)}
                </p>
              )}
            </div>
          </div>

          {showDateWithLine && <div className="mt-1 border-t border-blue-200"></div>}
          
          <p className="mt-2 whitespace-normal break-words text-slate-700">
            {gig.description.length >70? gig.description.slice(0, 70) + "..." : gig.description}
          </p>

          <div className="mt-2 flex flex-wrap items-center gap-2">
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
              label={`${gig.price} Tokens`}
              color="beige"
              textColor="black"
              outline={true}
              outlineColor="beige"
              rounded={true}
              size="small"
            />
            <Badge
              label={gig.location}
              color="beige"
              textColor="black"
              outline={true}
              outlineColor="beige"
              rounded={true}
              size="small"
            />
          </div>

          {showSeeMoreButton && (
            <div className="mt-1 flex justify-end">
              <CustomButton
                label="See More"
                onClick={() => onSeeMoreClick && onSeeMoreClick(gig)}
                color="primary"
                textColor="white"
                size="small"
                rounded={true}
              />
            </div>
          )}
        </div>
      ))}
      
    </div>
  );
}

export default PostedGigList
