import React, { useState } from "react";
import { Dropdown } from "flowbite-react";
import { FaFilter } from "react-icons/fa";

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
        dismissOnClick={false}
        label={
          <button className="flex items-center justify-center rounded-full bg-primary p-2 text-on-primary transition-all hover:bg-primary/90">
            <FaFilter />
          </button>
        }
        inline
        arrowIcon={false}
        color="gray"
      >
        {/* "Clear All" Option */}
        <Dropdown.Item
          onClick={clearAllCategories}
          className="font-semibold text-error"
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
            <span className="truncate capitalize">{category}</span>
          </Dropdown.Item>
        ))}
      </Dropdown>
    </div>
  );
};

export default FilterButton;
