// src/components/Gigs/MyPostedGigItem.tsx
import React from "react";
import Avatar from "../Avatar/Avatar"; // Import your custom Avatar component
import Label from "../Common/Label"; // Import your custom Label component

type MyPostedGigItemProps = {
  title: string;
  dateRange: string;
  category: string;
};

const MyPostedGigItem: React.FC<MyPostedGigItemProps> = ({
  title,
  dateRange,
  category,
}) => {
  return (
    <div className="flex items-center justify-between p-4 bg-transparent rounded-lg">
      <div className="flex items-center">
        <Avatar/> {/* Using your custom Avatar component */}
        <div className="ml-4">
          <h2 className="text-white font-semibold">{title}</h2>
          <p className="text-gray-300 text-sm">{dateRange}</p>
        </div>
      </div>
      <Label text={category} />
    </div>
  );
};

export default MyPostedGigItem;
