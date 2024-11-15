// src/components/Gigs/PostedGigListHome.tsx
import React from "react";
import PostedGigItemHome from "./PostedGigItemHome";
import Badge from "@/components/Buttons/CustomBadge"; // Ensure the correct import path for Badge
import { IconType } from "react-icons"; // Import IconType for typing
import { FaEuroSign } from "react-icons/fa"; // Import icon if needed

interface Gig {
  title: string;
  dateRange: string;
  category: { label: string };
  location: { label: string };
  price: { label: string; icon?: IconType }; // Ensure icon is of type IconType
  avatarUrl: string;
  description: string;
}

interface PostedGigListHomeProps {
  gigs: Gig[];
}

const PostedGigListHome: React.FC<PostedGigListHomeProps> = ({ gigs }) => {
  return (
    <div className="space-y-6">
      {gigs.map((gig, index) => (
        <div
          key={index}
          className="mb-4 space-y-2 rounded-lg  bg-gray-800 p-6 shadow-lg transition-transform hover:scale-105"
          style={{ marginBottom: '20px' }} // Adds space between gig containers
        >
          <PostedGigItemHome
            title={gig.title}
            dateRange={gig.dateRange}
            avatarUrl={gig.avatarUrl}
            description={gig.description}
            category={""}
          />
          <div className="mt-4 flex flex-wrap gap-4">
            {/* Category badge without icon */}
            <Badge
              label={gig.category.label}
              color="beige"
              textColor="black"
              outline={true}
              outlineColor="beige"
              rounded={true}
            />
            {/* Location badge without icon */}
            <Badge
              label={gig.location.label}
              color="beige"
              textColor="black"
              outline={true}
              outlineColor="beige"
              rounded={true}
            />
            {/* Price badge with icon on the right */}
            {gig.price.icon ? (
              <Badge
                label={gig.price.label}
                color="beige"
                textColor="black"
                outline={true}
                outlineColor="beige"
                rounded={true}
                icon={gig.price.icon} // Pass icon as IconType
                iconPosition="right"
              />
            ) : (
              <Badge
                label={gig.price.label}
                color="beige"
                textColor="black"
                outline={true}
                outlineColor="beige"
                rounded={true}
              />
            )}
          </div>
        </div>
      ))}
    </div>
  );
};

export default PostedGigListHome;
