// src/components/Gigs/MyPostedGigList.tsx
import React from "react";
import MyPostedGigItem from "./MyPostedGigItem";

const MyPostedGigList: React.FC = () => {
  // Sample data for the list of gigs
  const gigs = [
    {
      title: "Video Editor Needed",
      description:
        "I'm looking for a creative video editor to produce a captivating 10-20 second intro for my project centered around peaceful...",
      dateRange: "20 November - 23 November",
      category: "Video Editing",
      location: "Leuven",
      price: "60€",
      avatarUrl: "https://via.placeholder.com/40", // Replace with actual image URL
    },
    {
      title: "Airport Pickup Charleroi",
      description:
        "I need someone to pick me up from Charleroi Airport and drop me off in Leuven.",
      dateRange: "12 December",
      category: "Transport",
      location: "Charleroi",
      price: "30€",
      avatarUrl: "https://via.placeholder.com/40", // Replace with actual image URL
    },
    {
      title: "Chemistry Tutoring",
      description:
        "Looking for a tutor to help with high school level chemistry topics, focusing on exam preparation.",
      dateRange: "23 November",
      category: "Tutoring",
      location: "Leuven",
      price: "TBD",
      avatarUrl: "https://via.placeholder.com/40", // Replace with actual image URL
    },
  ];

  return (
    <div className="p-6 bg-gray-900 rounded-2xl shadow-xl border border-gray-700 space-y-4">
      {gigs.map((gig, index) => (
        <React.Fragment key={index}>
          <MyPostedGigItem
            title={gig.title}
            description={gig.description}
            dateRange={gig.dateRange}
            category={gig.category}
            location={gig.location}
            price={gig.price}
            avatarUrl={gig.avatarUrl}
          />
          {index < gigs.length - 1 && (
            <hr className="my-4 border-gray-700" /> // Divider between items
          )}
        </React.Fragment>
      ))}
    </div>
  );
};

export default MyPostedGigList;
