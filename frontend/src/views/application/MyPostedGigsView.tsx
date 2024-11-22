import React from "react";
import PostedGigListHome from "@/components/Gigs/PostedGigListHome";
import { FaEuroSign } from "react-icons/fa"; // Import icon for the price badge

const MyPostedGigsView: React.FC = () => {

  return (
    <div className="flex flex-1 flex-col space-y-6 p-6">
      {/* Page Title */}
      <h2 className="mb-4 text-2xl font-semibold text-gray-900 dark:text-white">
        My Posted Gigs
      </h2>

      {/* Remove or change background color */}
      <div className="rounded-2xl p-6 shadow-lg">
        {/* <PostedGigListHome gigs={gigs} /> */}
      </div>
    </div>
  );
};

export default MyPostedGigsView;
