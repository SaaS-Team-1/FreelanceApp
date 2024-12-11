// src/components/Buttons/CustomBadge.tsx
import React from "react";
import { IconType } from "react-icons";

interface BadgeProps {
  size?: "small" | "medium" | "large"; // Size of the badge
  icon?: IconType; // Corrected to use IconType
  iconPosition?: "left" | "right"; // Position of the icon
  outline?: boolean; // Whether the badge is outlined
  rounded?: boolean; // Rounded corners
  textColor?: "black" | "white" | "primary" | "tertiary" | "secondary"; // Text color
  className?: string; // Custom class name
}

function Badge({
  children,
}: React.PropsWithChildren<BadgeProps>) {

  return (
    <span
      className={`inline-flex items-center justify-center ${sizeClass} ${borderClass} ${colorClass} ${textClass} ${roundedClass} font-normal ${className}`}
      style={{ fontFamily: "'Inter', sans-serif" }}
    >
      {children}
    </span>
  );
}
