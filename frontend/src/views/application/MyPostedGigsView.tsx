// src/components/Gigs/MyPostedGigsView.tsx
import React from "react";
import PostedGigListHome from "@/components/Gigs/PostedGigListHome";
import { FaEuroSign } from "react-icons/fa"; // Import icon for the price badge

const MyPostedGigsView: React.FC = () => {
  // Sample dummy data for demonstration
  const gigs = [
    {
      title: "Video Editor Needed",
      dateRange: "20 November - 23 November",
      category: { label: "Video Editing" },
      location: { label: "Leuven" },
      price: { label: "60", icon: FaEuroSign }, // Pass icon as IconType
      avatarUrl: "https://via.placeholder.com/40",
      description: "I'm looking for a creative video editor to produce a captivating 10-20 second intro for my project centered around peaceful...",
    },
    {
      title: "Airport Pickup Charleroi",
      dateRange: "23 November",
      category: { label: "Transport" },
      location: { label: "Charleroi" },
      price: { label: "30", icon: FaEuroSign }, // Pass icon as IconType
      avatarUrl: "https://via.placeholder.com/40",
      description: "Need a driver for airport pickup in Charleroi...",
    },
    {
      title: "Chemistry Tutoring",
      dateRange: "25 November",
      category: { label: "Tutoring" },
      location: { label: "Leuven" },
      price: { label: "TBD", icon: FaEuroSign }, // Pass icon as IconType
      avatarUrl: "https://via.placeholder.com/40",
      description: "Looking for an experienced tutor for chemistry lessons...",
    },
  ];

  return (
    <div className="flex flex-1 flex-col space-y-6 p-6">
      {/* Page Title */}
      <h2 className="mb-4 text-2xl font-semibold text-gray-900 dark:text-white">
        My Posted Gigs
      </h2>

      {/* Pass data to the PostedGigListHome component */}
      <div className="rounded-2xl bg-gray-800 p-6 shadow-lg">
        <PostedGigListHome gigs={gigs} />
      </div>
    </div>
  );
};

export default MyPostedGigsView;
