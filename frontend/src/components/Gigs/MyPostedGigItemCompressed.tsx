// src/components/Gigs/MyPostedGigItemCompressed.tsx
import React from "react";
import MyPostedGigItemBase, { MyPostedGigItemBaseProps } from "./MyPostedGigItemBase"; // Import the type

const MyPostedGigItemCompressed: React.FC<MyPostedGigItemBaseProps> = (props) => {
  return <MyPostedGigItemBase {...props} isCompressed={true} />;
};

export default MyPostedGigItemCompressed;
