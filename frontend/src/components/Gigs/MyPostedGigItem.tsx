// src/components/Gigs/MyPostedGigItem.tsx
import React from "react";
import Avatar from "../Avatar/Avatar"; // Import your custom Avatar component
import Label from "../Common/Label"; // Import your custom Label component

type MyPostedGigItemProps = {
  title: string;
  dateRange: string;
  category: string;
  avatarUrl: string;
};

const MyPostedGigItem: React.FC<MyPostedGigItemProps> = ({
  title,
  dateRange,
  category,
  avatarUrl,
}) => {
  return (
    <div className="flex items-center justify-between p-4 bg-gray-900 rounded-xl">
      <div className="flex items-start space-x-4">
        <Avatar image={avatarUrl} alt="User Avatar" /> {/* Custom Avatar */}
        <div className="flex flex-col text-left"> {/* Added text-left class */}
          <h2 className="text-white font-semibold">{title}</h2>
          <p className="text-gray-400 text-sm">{dateRange}</p>
        </div>
      </div>
      <div className="ml-4"> {/* Added margin to separate label from text */}
        <Label text={category} /> {/* Custom Label */}
      </div>
    </div>
  );
};

export default MyPostedGigItem;
