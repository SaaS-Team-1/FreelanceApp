// src/components/Gigs/MyPostedGigItemCompressed.tsx
import React from "react";
import GigItemBase, { GigItemBaseProps } from "./GigItemBase"; // Import the type

const MyPostedGigItemCompressed: React.FC<GigItemBaseProps> = (props) => {
  return <GigItemBase {...props} isCompressed={true} />;
};

export default MyPostedGigItemCompressed;
