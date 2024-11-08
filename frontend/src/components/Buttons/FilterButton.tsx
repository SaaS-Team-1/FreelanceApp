import React, { useState } from 'react';
import { Dropdown } from 'flowbite-react';

const FilterButton = () => {
  const [selectedFilter, setSelectedFilter] = useState("All");

  const handleSelect = (filter) => {
    setSelectedFilter(filter);
  };

  return (
    <div className="relative inline-block text-left">
      <Dropdown
        label={
          <div className="flex items-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 text-gray-500"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2a1 1 0 01-.293.707l-5.414 5.414A2 2 0 0014 13.414V18a1 1 0 01-.553.894l-4 2A1 1 0 018 20v-6.586a2 2 0 00-.586-1.414L2 6.707A1 1 0 012 6V4z"
              />
            </svg>
          </div>
        }
        inline
        arrowIcon={false}
        color="gray"
      >
        <Dropdown.Item onClick={() => handleSelect("All")}>
          All
        </Dropdown.Item>
        <Dropdown.Item onClick={() => handleSelect("Popular")}>
          Popular
        </Dropdown.Item>
        <Dropdown.Item onClick={() => handleSelect("Newest")}>
          Newest
        </Dropdown.Item>
        <Dropdown.Item onClick={() => handleSelect("Top Rated")}>
          Top Rated
        </Dropdown.Item>
      </Dropdown>
    </div>
  );
};

export default FilterButton;
