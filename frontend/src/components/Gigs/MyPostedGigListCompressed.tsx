import React from "react";
import { Link } from "react-router";
import { Gig, User } from "@/utils/database/schema";
import GigItem from "./GigItem";
import CompressedGigItem from "./CompressedGigItem";

function MyPostedGigListCompressed({
  gigs,
  user,
}: {
  gigs: Gig[];
  user: User;
}) {
  return (
    <div className="flex h-96 max-w-sm flex-col justify-items-center rounded-xl border bg-surface-container-low">
      <h2 className="w-full rounded-t-xl bg-primary-container py-2 text-center text-2xl font-semibold">
        My Gigs
      </h2>
      <div className="scrollbar grow overflow-y-scroll pl-2">
        {gigs.map((gig, index) => (
          <React.Fragment key={index}>
            <Link
              to={`posted-gigs/?gigId=` + gig.gigId}
              className="m-2 flex items-center gap-4 rounded-xl bg-surface-container-high hover:bg-surface-container"
            >
              <CompressedGigItem gig={gig} lister={user} isCompressed/>
            </Link>
          </React.Fragment>
        ))}
      </div>
    </div>
  );
}

export default MyPostedGigListCompressed;
