"use client";

import { Rating } from "flowbite-react";

export function ComponentRating() {
  return (
    <Rating>
      <Rating.Star />
      <Rating.Star />
      <Rating.Star />
      <Rating.Star />
      <Rating.Star filled={false} />
      <p
        className="ml-2 text-sm font-medium text-gray-500 dark:text-gray-400"
        style={{ fontFamily: "'Inter', sans-serif" }} // Apply Inter font
      >
        4.95(51)
      </p>
    </Rating>
  );
}
