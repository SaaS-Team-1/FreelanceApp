import { HiX } from "react-icons/hi"; // Import the close "X" icon

interface FilterButtonProps {
  label: string; // Text to display inside the filter button
}

export function FilterButtonSelected({ label }: FilterButtonProps) {
  return (
    <button
      className="flex items-center justify-between text-white"
      style={{
        backgroundColor: "rgba(11, 33, 44, 1)", // Custom dark color
        borderRadius: "9999px", // Fully rounded corners
        padding: "6px 12px", // Adjust padding for text and icon
        fontFamily: "'Inter', sans-serif", // Apply Inter font
        fontSize: "14px", // Adjust text size
        fontWeight: "normal", // Regular font weight
      }}
    >
      <span>{label}</span>
      <span
        className="ml-2 flex items-center justify-center"
        style={{
          color: "white", // White icon color
          marginLeft: "8px", // Small space between text and icon
        }}
      >
        <HiX style={{ fontSize: "14px" }} /> {/* Small X icon */}
      </span>
    </button>
  );
}
