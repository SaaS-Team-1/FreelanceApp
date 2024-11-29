// CustomButton.tsx
import React from "react";
import { IconType } from "react-icons";

interface CustomButtonProps {
  label?: string;
  onClick: () => void;
  color?:
    | "primary"
    | "secondary"
    | "warning"
    | "gray"
    | "black"
    | "green"
    | "red"
    | "white"; // Background color
  outlineColor?:
    | "primary"
    | "secondary"
    | "warning"
    | "gray"
    | "black"
    | "green"
    | "red"
    | "white"; // Border color
  size?: "small" | "medium" | "large"; // Size of the button
  icon?: IconType; // Icon component from react-icons
  iconPosition?: "left" | "right" | "middle"; // Position of the icon
  outline?: boolean; // Whether the button is outlined
  rounded?: boolean; // Rounded corners
  disabled?: boolean; // Disable button
  textColor?: "black" | "white" | "primary"; // Text color
  customStyle?: React.CSSProperties;
}

const sizeClasses: { [key: string]: string } = {
  small: "px-3 py-1 text-sm",
  medium: "px-4 py-2 text-md",
  large: "px-6 py-3 text-lg",
};

const colorClasses: {
  [key in NonNullable<CustomButtonProps["color"]>]: string;
} = {
  primary: "bg-blue-500 hover:bg-blue-600",
  secondary: "bg-orange-500 hover:bg-orange-600",
  warning: "bg-red-500 hover:bg-red-600",
  gray: "bg-gray-500 hover:bg-gray-600",
  black: "bg-[rgba(11,33,44,1)] hover:bg-opacity-90",
  green: "bg-[rgba(42,168,21,1)] hover:bg-opacity-90",
  red: "bg-[rgba(255,73,64,0.67)] hover:bg-opacity-50",
  white: "bg-white hover:bg-gray-200", // White background with hover effect
};

const borderColorClasses: {
  [key in NonNullable<CustomButtonProps["outlineColor"]>]: string;
} = {
  primary: "border-blue-500",
  secondary: "border-orange-500",
  warning: "border-red-500",
  gray: "border-gray-500",
  black: "border-[rgba(11,33,44,1)]",
  green: "border-[rgba(42,168,21,1)]",
  red: "border-[rgba(255,73,64,0.67)]",
  white: "border-white",
};

const textColorClasses: {
  [key in NonNullable<CustomButtonProps["textColor"]>]: string;
} = {
  black: "text-black",
  white: "text-white",
  primary: "text-blue-500",
};

const CustomButton: React.FC<CustomButtonProps> = ({
  label,
  onClick,
  color = "primary",
  outlineColor,
  size = "medium",
  icon: Icon,
  iconPosition = "left",
  outline = false,
  rounded = false,
  disabled = false,
  textColor = "white", // Default text color
  customStyle, // Use customStyle here
}) => {
  const borderClass = outline
    ? `border ${borderColorClasses[outlineColor || color]}`
    : "";
  const backgroundClass = colorClasses[color]; // Always apply the background color
  const roundedClass = rounded ? "rounded-full" : "rounded-md";
  const textClass = textColorClasses[textColor];

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`flex items-center justify-center ${sizeClasses[size]} ${borderClass} ${backgroundClass} ${textClass} ${roundedClass} transition-colors duration-200 ${
        disabled ? "cursor-not-allowed opacity-50" : "hover:opacity-90"
      }`}
      style={customStyle} // Apply customStyle here
    >
      {Icon && iconPosition === "left" && <Icon className="mr-2" />}
      <span>{label}</span>
      {Icon && iconPosition === "right" && <Icon className="ml-2" />}
      {Icon && iconPosition === "middle" && <Icon className="mx-0" />}
    </button>
  );
};

export default CustomButton;
