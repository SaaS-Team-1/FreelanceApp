import { Gig, User } from "@/utils/database/schema";
import GigItem from "./GigItem";
import { Button } from "flowbite-react";
import { FaCheck, FaComments, FaUndo } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

interface PostedGigListSmallProps {
  gigs: { gig: Gig; lister: User }[];
  onSeeMoreClick?: (gig: Gig) => void;
  onCompleteClick?: (gigId: string) => void;
  selectedGig?: Gig | null;
  showChatIcon?: boolean;
  showCompletedButton?: boolean;
}

function PostedGigListSmall({
  gigs,
  onSeeMoreClick,
  onCompleteClick,
  selectedGig = null,
  showChatIcon = false,
  showCompletedButton = false,
}: PostedGigListSmallProps) {
  const navigate = useNavigate();

  const handleMessageClick = (userId: string, gigId: string) => {
    navigate(`/app/chat/?userId=${userId}&gigId=${gigId}`);
  };

  return (
    <div className="space-y-4">
      {gigs.map(({ gig, lister }) => (
        <GigItem
          gig={gig}
          lister={lister}
          enableSelection
          isSelected={selectedGig?.gigId === gig.gigId}
          onSeeMoreClick={() => onSeeMoreClick && onSeeMoreClick(gig)}
        >
          <div className="flex gap-2 text-on-surface">
            {showCompletedButton && (
              <Button
                onClick={(e) => {
                  e.stopPropagation();
                  onCompleteClick && onCompleteClick(gig.gigId);
                }}
                color="primary"
                size="sm"
                className="size-fit"
              >
                <FaCheck className="mr-1 mt-0.5" />
                Complete
              </Button>
            )}
            {showChatIcon && (
              <Button
                onClick={(e) => {
                  e.stopPropagation();

                  handleMessageClick(lister.userId, gig.gigId);
                }}
                color="tertiary"
                size="sm"
                className="size-fit"
              >
                <FaComments className="text-lg" />
              </Button>
            )}
          </div>
        </GigItem>
      ))}
    </div>
  );
}

export default PostedGigListSmall;
