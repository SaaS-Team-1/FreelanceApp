// src/components/Gigs/MyPostedGigList.tsx
import React from "react";
import MyPostedGigItem from "./MyPostedGigItem";

const MyPostedGigList: React.FC = () => {
  // Sample data for the list of gigs
  const gigs = [
    {
      title: "Dog Sitter Needed",
      dateRange: "20 November - 23 November",
      category: "Dogsitting",
      avatarUrl: "https://via.placeholder.com/40", // Replace with actual image URL
    },
    {
      title: "Video Editing (7min Video)",
      dateRange: "12 December",
      category: "Video Editing",
      avatarUrl: "https://via.placeholder.com/40", // Replace with actual image URL
    },
    {
      title: "Airport Pickup Charleroi",
      dateRange: "23 November",
      category: "Transport",
      avatarUrl: "https://via.placeholder.com/40", // Replace with actual image URL
    },
  ];

  return (
    <div className="p-6 bg-gray-900 rounded-2xl shadow-xl border border-gray-700">
      {gigs.map((gig, index) => (
        <React.Fragment key={index}>
          <MyPostedGigItem
            title={gig.title}
            dateRange={gig.dateRange}
            category={gig.category}
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
  );
};

export default MyPostedGigList;
