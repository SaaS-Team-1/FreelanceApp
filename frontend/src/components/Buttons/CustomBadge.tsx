// Badge.tsx
import React from "react";

interface BadgeProps {
  label: string;
  color?: "primary" | "secondary" | "warning" | "gray"; // Color variants
  size?: "small" | "medium" | "large"; // Size variants
  textColor?: "black" | "white"; // Text color option
}

const colorClasses = {
  primary: "bg-blue-500",
  secondary: "bg-orange-400",
  warning: "bg-red-500",
  gray: "bg-gray-500",
};

const sizeClasses = {
  small: "text-xs px-2 py-3", // Smaller text size with less padding
  medium: "text-sm px-3 py-1.5", // Medium text size with moderate padding
  large: "text-md px-4 py-2", // Larger text size with more padding
};

const textColorClasses = {
  black: "text-black",
  white: "text-white",
};

const Badge: React.FC<BadgeProps> = ({
  label,
  color = "primary", // Default color
  size = "medium", // Default size
  textColor = "white", // Default text color
}) => {
  const colorClass = colorClasses[color];
  const sizeClass = sizeClasses[size];
  const textClass = textColorClasses[textColor];

  return (
    <span
      className={`inline-block ${colorClass} ${sizeClass} ${textClass} rounded-full font-normal`}
      style={{ fontFamily: "'Inter', sans-serif" }}
    >
      {label}
    </span>
  );
};

export default Badge;
