// src/components/Buttons/CustomBadge.tsx
import React from "react";
import { IconType } from "react-icons";

interface BadgeProps {
  label: string;
  color?: "primary" | "secondary" | "warning" | "gray" | "black" | "green" | "red" | "white" | "beige"; // Background color
  outlineColor?: "primary" | "secondary" | "warning" | "gray" | "black" | "green" | "red" | "white" | "beige"; // Border color
  size?: "small" | "medium" | "large"; // Size of the badge
  icon?: IconType; // Corrected to use IconType
  iconPosition?: "left" | "right"; // Position of the icon
  outline?: boolean; // Whether the badge is outlined
  rounded?: boolean; // Rounded corners
  textColor?: "black" | "white" | "primary"; // Text color
  className?: string; // Custom class name

}

const colorClasses: { [key in NonNullable<BadgeProps['color']>]: string } = {
  primary: "bg-blue-500",
  secondary: "bg-orange-500",
  warning: "bg-red-500",
  gray: "bg-gray-500",
  black: "bg-[rgba(11,33,44,1)]",
  green: "bg-[rgba(42,168,21,1)]",
  red: "bg-[rgba(255,73,64,0.67)]",
  white: "bg-white",
  beige: "bg-[rgba(225,217,217,1)]",
};

const borderColorClasses: { [key in NonNullable<BadgeProps['outlineColor']>]: string } = {
  primary: "border-blue-500",
  secondary: "border-orange-500",
  warning: "border-red-500",
  gray: "border-gray-500",
  black: "border-[rgba(11,33,44,1)]",
  green: "border-[rgba(42,168,21,1)]",
  red: "border-[rgba(255,73,64,0.67)]",
  white: "border-white",
  beige: "border-[rgba(0,0,0,0.5)]",
};

const sizeClasses: { [key: string]: string } = {
  small: "px-3 py-1 text-sm",
  medium: "px-4 py-2 text-md",
  large: "px-6 py-3 text-lg",
};

const textColorClasses: { [key in NonNullable<BadgeProps['textColor']>]: string } = {
  black: "text-black",
  white: "text-white",
  primary: "text-blue-500",
};

const Badge: React.FC<BadgeProps> = ({
  label,
  color = "primary",
  outlineColor,
  size = "medium",
  icon: Icon,
  iconPosition = "left",
  outline = false,
  rounded = false,
  textColor = "white",
  className = "", // Default empty string for custom class

}) => {
  const colorClass = colorClasses[color];
  const sizeClass = sizeClasses[size];
  const textClass = textColorClasses[textColor];
  const borderClass = outline ? `border ${borderColorClasses[outlineColor || color]}` : "";
  const roundedClass = rounded ? "rounded-full" : "rounded-md";

  return (
    <span
      className={`inline-flex items-center justify-center ${sizeClass} ${borderClass} ${colorClass} ${textClass} ${roundedClass} font-normal ${className}`}
      style={{ fontFamily: "'Inter', sans-serif" }}
    >
      {Icon && iconPosition === "left" && <Icon className="mr-2" />}
      <span className="text-center">{label}</span>
      {Icon && iconPosition === "right" && <Icon className="ml-2" />}
    </span>
  );
};

export default Badge;
