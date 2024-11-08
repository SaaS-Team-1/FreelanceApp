// "use client";

import { useState } from "react";
import { Rating } from "flowbite-react";

export function RatingStar() {
  const [rating, setRating] = useState(0); // State to hold the selected rating

  const handleSelect = (selectedRating: number) => {
    setRating(selectedRating); // Update the rating state when a star is clicked
  };

  return (
    <div className="flex items-center">
      <Rating>
        {[1, 2, 3, 4, 5].map((star) => (
          <Rating.Star
            key={star}
            filled={star <= rating}
            onClick={() => handleSelect(star)} // Handle star click
          />
        ))}
      </Rating>
      <p
        className="ml-2 text-sm font-medium text-gray-500 dark:text-gray-400"
        style={{ fontFamily: "'Inter', sans-serif" }} // Apply Inter font
      >
        {rating > 0 ? `${rating} / 5` : 'No rating selected'}
      </p>
    </div>
  );
}
