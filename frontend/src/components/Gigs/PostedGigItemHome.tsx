// /home/shusaku/projects/FreelanceApp/frontend/src/components/Gigs/PostedGigItemHome.tsx
import React from "react";
import GigItemBase, { GigItemBaseProps } from "./GigItemBase"; // Ensure the import path is correct

// New component that extends GigItemBase and adds the custom SeeMoreButton
const PostedGigItemHome: React.FC<GigItemBaseProps> = (props) => {
  return (
      <GigItemBase {...props} />
  );
};

export default PostedGigItemHome;
