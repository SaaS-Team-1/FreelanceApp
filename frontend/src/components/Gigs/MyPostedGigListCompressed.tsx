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
    <div className="scrollbar h-96 max-w-sm overflow-y-scroll rounded-xl border border-gray-700 bg-gray-800 p-4 shadow-lg">
      <h2 className="header-bg-extension sticky top-0 z-10 bg-gray-800 p-2 text-center text-lg text-white">
        My Posted Gigs
      </h2>
      {gigs.map((gig, index) => (
        <React.Fragment key={index}>
          <MyPostedGigItemCompressed gig={gig} lister={user} />
          {index < gigs.length - 1 && (
            <hr className="my-4 border-gray-700" /> // Divider between items
          )}
        </React.Fragment>
      ))}
      <button
        onClick={() => navigate("/app/posted-gigs")}
        className="mt-4 block text-center text-sm text-blue-400"
      >
        See Details
      </button>
    </div>
  );
}

export default MyPostedGigListCompressed;
