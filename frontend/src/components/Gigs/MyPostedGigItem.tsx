// src/components/Gigs/MyPostedGigItem.tsx
import React from "react";
import GigItemBase, { GigItemBaseProps } from "./GigItemBase"; // Import the type

const MyPostedGigItem: React.FC<GigItemBaseProps> = (props) => {
  return <GigItemBase {...props} isCompressed={false} />;
};

export default MyPostedGigItem;
