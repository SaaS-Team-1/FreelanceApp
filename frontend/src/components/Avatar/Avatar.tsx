// src/components/Avatar.tsx
import React from "react";
import { Avatar as FlowbiteAvatar } from "flowbite-react";

const Avatar = ({ image, alt = "User Avatar" }) => {
  return (
    <div>
      <FlowbiteAvatar
        img={image || undefined}
        alt={alt}
        rounded={true}
        className="border-2 border-transparent rounded-full"
      />
    </div>
  );
};

export default Avatar;
