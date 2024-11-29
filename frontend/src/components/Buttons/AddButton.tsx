import React from "react";
import { Button } from "flowbite-react";

const AddButton = ({ onClick }) => {
  return (
    <Button
      onClick={onClick}
      className="flex size-12 items-center justify-center rounded-full bg-orange-500 hover:bg-orange-600 focus:ring-4 focus:ring-orange-300 dark:bg-orange-500 dark:hover:bg-orange-600"
    >
      <span className="text-xl font-bold text-black">+</span>
    </Button>
  );
};

export default AddButton;
