import React from "react";
import { useNavigate } from "react-router-dom";
import MyPostedGigItemCompressed from "./MyPostedGigItemCompressed";
import { Gig, User } from "@/utils/database/schema";

function MyPostedGigListCompressed({
  gigs,
  user,
}: {
  gigs: Gig[];
  user: User;
}) {
  const navigate = useNavigate(); // Initialize navigate

  return (
    <div className="flex h-96 max-w-sm flex-col justify-items-center rounded-xl border bg-surface-container-low">
      <h2 className="w-full rounded-t-xl bg-primary-container py-2 text-center text-2xl font-semibold">
        My Gigs
      </h2>
      <div className="scrollbar grow overflow-y-scroll pl-2">
        {gigs.map((gig, index) => (
          <React.Fragment key={index}>
            <div className="m-2 flex items-center gap-4 rounded-xl bg-surface-container-high">
              <div className="flex flex-1 items-center justify-between">
                <MyPostedGigItemCompressed gig={gig} lister={user} />
              </div>
            </div>
          </React.Fragment>
        ))}
                {gigs.map((gig, index) => (
          <React.Fragment key={index}>
            <div className="m-2 flex items-center gap-4 rounded-xl bg-surface-container-high">
              <div className="flex flex-1 items-center justify-between">
                <MyPostedGigItemCompressed gig={gig} lister={user} />
              </div>
            </div>
          </React.Fragment>
        ))}

      </div>

      <button
        onClick={() => navigate("/app/posted-gigs")}
        className="my-2 justify-self-end text-center text-sm font-bold text-primary bg-secondary-container w-fit mx-auto rounded-full p-2"
      >
        See Details
      </button>
    </div>
  );
}

export default MyPostedGigListCompressed;
