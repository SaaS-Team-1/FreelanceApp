// src/components/Gigs/MyPostedGigItem.tsx
import React from "react";
import MyPostedGigItemBase, { MyPostedGigItemBaseProps } from "./GigItemBase"; // Import the type

const MyPostedGigItem: React.FC<MyPostedGigItemBaseProps> = (props) => {
  return <MyPostedGigItemBase {...props} isCompressed={false} />;
};

export default MyPostedGigItem;
