// src/components/Buttons/CustomBadge.tsx
import React from "react";
import { IconType } from "react-icons";

interface BadgeProps {
  label: string;
  color?:
    | "primary"
    | "secondary"
    | "warning"
    | "gray"
    | "black"
    | "green"
    | "red"
    | "white"
    | "beige"; // Background color
  outlineColor?:
    | "primary"
    | "secondary"
    | "warning"
    | "gray"
    | "black"
    | "green"
    | "red"
    | "white"
    | "beige"; // Border color
  size?: "small" | "medium" | "large"; // Size of the badge
  icon?: IconType; // Corrected to use IconType
  iconPosition?: "left" | "right"; // Position of the icon
  outline?: boolean; // Whether the badge is outlined
  rounded?: boolean; // Rounded corners
  textColor?: "black" | "white" | "primary"; // Text color
  className?: string; // Custom class name
}

const colorClasses: { [key in NonNullable<BadgeProps["color"]>]: string } = {
  primary: "bg-primary/10", // Light blue background
  secondary: "bg-secondary/10", // Light orange
  warning: "bg-red-100", // Light red
  gray: "bg-gray-100", // Soft gray
  black: "bg-gray-800", // Dark gray (for contrast in rare cases)
  green: "bg-green-100", // Light green
  red: "bg-red-100", // Light red
  white: "bg-white", // White background
  beige: "bg-beige-100", // Light beige
};

const borderColorClasses: {
  [key in NonNullable<BadgeProps["outlineColor"]>]: string;
} = {
  primary: "border-primary/30", // Lighter blue border
  secondary: "border-secondary/30", // Lighter orange
  warning: "border-red-300", // Lighter red
  gray: "border-gray-300", // Lighter gray
  black: "border-gray-800", // Dark gray
  green: "border-green-300", // Lighter green
  red: "border-red-300", // Lighter red
  white: "border-gray-200", // Subtle gray border for white
  beige: "border-beige-300", // Lighter beige
};

const sizeClasses: { [key: string]: string } = {
  small: "px-3 py-1 text-sm",
  medium: "px-4 py-2 text-md",
  large: "px-6 py-3 text-lg",
};

const textColorClasses: {
  [key in NonNullable<BadgeProps["textColor"]>]: string;
} = {
  black: "text-black",
  white: "text-slate-50", // Slightly soft white text for light contrasts
  primary: "text-primary/70", // Deep blue for readability
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
  textColor = "black",
  className = "",
}) => {
  const colorClass = colorClasses[color];
  const sizeClass = sizeClasses[size];
  const textClass = textColorClasses[textColor];
  const borderClass = outline
    ? `border ${borderColorClasses[outlineColor || color]}`
    : "";
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
