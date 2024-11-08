// CustomButton.tsx
import React from "react";
import { IconType } from "react-icons";

interface CustomButtonProps {
  label: string;
  onClick: () => void;
  color?: "primary" | "secondary" | "warning" | "gray"; // Variants for color
  size?: "small" | "medium" | "large"; // Variants for size
  icon?: IconType; // Icon component from react-icons
  iconPosition?: "left" | "right"; // Position of the icon relative to the text
  outline?: boolean; // Outline style for the button
  rounded?: boolean; // Rounded corners
  disabled?: boolean; // Disable button
}

const sizeClasses = {
  small: "px-3 py-1 text-sm",
  medium: "px-4 py-2 text-md",
  large: "px-6 py-3 text-lg",
};

const colorClasses = {
  primary: "bg-blue-500 text-white hover:bg-blue-600",
  secondary: "bg-orange-500 text-white hover:bg-orange-600",
  warning: "bg-red-500 text-white hover:bg-red-600",
  gray: "bg-gray-500 text-white hover:bg-gray-600",
};

const outlineClasses = {
  primary: "border border-blue-500 text-blue-500 hover:bg-blue-500 hover:text-white",
  secondary: "border border-orange-500 text-orange-500 hover:bg-orange-500 hover:text-white",
  warning: "border border-red-500 text-red-500 hover:bg-red-500 hover:text-white",
  gray: "border border-gray-500 text-gray-500 hover:bg-gray-500 hover:text-white",
};

const CustomButton: React.FC<CustomButtonProps> = ({
  label,
  onClick,
  color = "primary",
  size = "medium",
  icon: Icon,
  iconPosition = "left",
  outline = false,
  rounded = false,
  disabled = false,
}) => {
  const colorClass = outline ? outlineClasses[color] : colorClasses[color];
  const roundedClass = rounded ? "rounded-full" : "rounded-md";

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`flex items-center justify-center ${sizeClasses[size]} ${colorClass} ${roundedClass} transition-colors duration-200 ${
        disabled ? "opacity-50 cursor-not-allowed" : "hover:opacity-90"
      }`}
    >
      {Icon && iconPosition === "left" && <Icon className="mr-2" />}
      <span>{label}</span>
      {Icon && iconPosition === "right" && <Icon className="ml-2" />}
    </button>
  );
};

export default CustomButton;
