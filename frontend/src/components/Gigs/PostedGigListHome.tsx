// /home/shusaku/projects/FreelanceApp/frontend/src/components/Gigs/PostedGigListHome.tsx
import React from "react";
import PostedGigItemHome from "./PostedGigItemHome";

const PostedGigListHome: React.FC = () => {
  // Sample data for multiple gig items
  const gigs = [
    {
      title: "Video Editor Needed",
      dateRange: "20 November - 23 November",
      category: "Video Editing",
      avatarUrl: "https://via.placeholder.com/40",
      description: "I'm looking for a creative video editor to produce a captivating 10-20 second intro for my project centered around peaceful...",
      location: "Leuven",
      price: "60€",
    },
    {
      title: "Video Editor Needed",
      dateRange: "20 November - 23 November",
      category: "Video Editing",
      avatarUrl: "https://via.placeholder.com/40",
      description: "I'm launching a new project focused on motivation and self-development, and I'm looking for a talented social media editor...",
      location: "Leuven",
      price: "50€",
    },
    {
      title: "Video Editor Needed",
      dateRange: "20 November - 23 November",
      category: "Video Editing",
      avatarUrl: "https://via.placeholder.com/40",
      description: "I'm launching a new project focused on motivation and self-development, and I'm looking for a talented social media editor...",
      location: "Leuven",
      price: "50€",
    },
    // Add more items as needed
  ];

  return (
    <div className="space-y-6"> {/* Adds vertical spacing between items */}
      {gigs.map((gig, index) => (
        <PostedGigItemHome
          key={index}
          title={gig.title}
          dateRange={gig.dateRange}
          category={gig.category}
          avatarUrl={gig.avatarUrl}
          description={gig.description}
          location={gig.location}
          price={gig.price}
        />
      ))}
    </div>
  );
};

export default PostedGigListHome;
