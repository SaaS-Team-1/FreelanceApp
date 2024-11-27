import React, { useState } from "react";
import { Dropdown } from "flowbite-react";

interface FilterButtonProps {
  categories: string[];
  onCategorySelect: (selectedCategories: string[]) => void;
}

const FilterButton: React.FC<FilterButtonProps> = ({
  categories,
  onCategorySelect,
}) => {
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);

  const toggleCategory = (category: string) => {
    const updatedCategories = selectedCategories.includes(category)
      ? selectedCategories.filter((cat) => cat !== category) // Remove category
      : [...selectedCategories, category]; // Add category

    setSelectedCategories(updatedCategories);
    onCategorySelect(updatedCategories); // Notify parent of changes
  };

  const clearAllCategories = () => {
    setSelectedCategories([]);
    onCategorySelect([]); // Notify parent that all categories are cleared
  };

  return (
    <div className="relative inline-block text-left">
      <Dropdown
        label={
          <div className="flex items-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="size-5 text-gray-500"
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
        {/* "Clear All" Option */}
        <Dropdown.Item
          onClick={clearAllCategories}
          className="font-semibold text-red-500"
        >
          Clear All
        </Dropdown.Item>

        {/* Category Options */}
        {categories.map((category) => (
          <Dropdown.Item
            key={category}
            onClick={() => toggleCategory(category)}
            className="flex items-center"
          >
            <input
              type="checkbox"
              checked={selectedCategories.includes(category)}
              className="mr-2"
              readOnly
            />
            <span className="truncate">{category}</span>
          </Dropdown.Item>
        ))}
      </Dropdown>
    </div>
  );
};

export default FilterButton;
