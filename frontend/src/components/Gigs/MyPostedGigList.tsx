import { Gig, User } from "@/utils/database/schema";
import { useEffect, useRef } from "react";
import GigItem from "./GigItem";

interface PostedGigListProps {
  gigs: { gig: Gig; lister: User }[];
  onSelectGig: (gig: Gig) => void;
  selectedGig?: Gig | null;
}

function PostedGigList({
  gigs,
  onSelectGig,
  selectedGig = null,
}: PostedGigListProps) {
  const selectedRef = useRef(null);

  useEffect(() => {
    if (selectedRef && selectedRef.current) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (selectedRef.current as any).scrollIntoView();
    }
  }, [selectedRef]);

  return (
    <div className="space-y-4" id="my-posted-gig-list">
      {gigs.map(
        ({ gig, lister }) =>
          gig && (
            <div
              className="mr-4"
              ref={selectedGig?.gigId === gig.gigId ? selectedRef : undefined}
            >
              <GigItem
                gig={gig}
                lister={lister}
                enableSelection
                showStatus
                isSelected={selectedGig?.gigId === gig.gigId}
                onSeeMoreClick={onSelectGig}
              />
            </div>
          ),
      )}
    </div>
  );
}

export default PostedGigList;
