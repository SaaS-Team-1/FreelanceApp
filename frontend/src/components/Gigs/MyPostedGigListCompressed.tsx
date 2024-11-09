// src/components/Gigs/MyPostedGigList.tsx
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
  ];

  return (
    <div className="text-center mb-4">
      <div className="p-6 bg-gray-900 rounded-2xl shadow-xl border border-gray-700">
      <h2 className="text-white text-lg mb-2">My Posted Gigs</h2> {/* Title outside the frame */}
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
        <a href="#" className="text-blue-400 text-sm mt-4 block text-center">
          See Details
        </a>
      </div>
    </div>
  );
};

export default MyPostedGigListCompressed;
