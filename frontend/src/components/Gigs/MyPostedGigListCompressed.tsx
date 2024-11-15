import React from "react";
import MyPostedGigItemCompressed from "./MyPostedGigItemCompressed";

const MyPostedGigListCompressed: React.FC = () => {
  // Sample data for the list of gigs
  const gigs = [
    {
      title: "Dog Sitter Needed",
      dateRange: "20 November - 23 November",
      category: "Dogsitting",
    },
    {
      title: "Video Editing (7min Video)",
      dateRange: "12 December",
      category: "Video Editing",
    },
    {
      title: "Airport Pickup Charleroi",
      dateRange: "23 November",
      category: "Transport",
    },
    {
      title: "Airport Pickup Charleroi",
      dateRange: "23 November",
      category: "Transport",
    },
    {
      title: "Airport Pickup Charleroi",
      dateRange: "23 November",
      category: "Transport",
    },
  ];

  return (
    <div className="scrollbar h-96 max-w-sm overflow-y-scroll rounded-xl border border-gray-700 bg-gray-900 p-4 shadow-lg">
      <h2 className="sticky top-0 z-10 bg-gray-900 p-2 text-center text-lg text-white header-bg-extension">
        My Posted Gigs
      </h2>
      {gigs.map((gig, index) => (
        <React.Fragment key={index}>
          <MyPostedGigItemCompressed
            title={gig.title}
            dateRange={gig.dateRange}
            category={gig.category}
            avatarUrl={gig.avatarUrl}
          />
          {index < gigs.length - 1 && (
            <hr className="my-4 border-gray-700" /> // Divider between items
          )}
        </React.Fragment>
      ))}
      <a href="#" className="mt-4 block text-center text-sm text-blue-400">
        See Details
      </a>
    </div>
  );
};

export default MyPostedGigListCompressed;
