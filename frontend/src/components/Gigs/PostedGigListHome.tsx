import React from "react";
import PostedGigItemHome from "./PostedGigItemHome";
import Badge from "@/components/Buttons/CustomBadge"; // Ensure the correct import path for Badge
import CustomButton from "@/components/Buttons/CustomButton"; // Import the CustomButton component
import { IconType } from "react-icons"; // Import IconType for typing

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
  showSeeMoreButton?: boolean; // Add a prop to control the display of the "See More" button
}

const PostedGigListHome: React.FC<PostedGigListHomeProps> = ({ gigs, showSeeMoreButton = false }) => {
  return (
    <div className="space-y-4"> {/* Reduce spacing between gig containers */}
      {gigs.map((gig, index) => (
        <div
          key={index}
          className="rounded-lg bg-gray-800 p-4 shadow-lg transition-transform hover:scale-105" // Adjust padding to remove unnecessary space
        >
          <PostedGigItemHome
            title={gig.title}
            dateRange={gig.dateRange}
            avatarUrl={gig.avatarUrl}
            description={gig.description}
            category={""}
          />
          {/* Remove excessive spacing between description and badges */}
          <div className="mt-2 flex flex-wrap items-center gap-2"> {/* Use flex wrap and align items */}
            <Badge
              label={gig.category.label}
              color="beige"
              textColor="black"
              outline={true}
              outlineColor="beige"
              rounded={true}
              size="small"
            />
            <Badge
              label={gig.location.label}
              color="beige"
              textColor="black"
              outline={true}
              outlineColor="beige"
              rounded={true}
              size="small"
            />
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
                size="small"
              />
            ) : (
              <Badge
                label={gig.price.label}
                color="beige"
                textColor="black"
                outline={true}
                outlineColor="beige"
                rounded={true}
                size="small"
              />
            )}
          </div>
          {/* Conditionally render the "See More" button */}
          {showSeeMoreButton && (
            <div className="mt-4 flex justify-end">
              <CustomButton
                label="See More"
                onClick={() => alert("See more clicked!")} // Replace with desired function
                color="primary"
                textColor="white"
                size="small"
                rounded={true}
              />
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default PostedGigListHome;
