import React from "react";
import { HiX } from "react-icons/hi"; // Ensure this import is available

interface UndoButtonProps {
  onClick: () => void; // Add onClick prop type
}

export function UndoButton({ onClick }: UndoButtonProps) {
  return (
    <button
      onClick={onClick} // Use the onClick prop
      className="flex items-center justify-between text-white"
      style={{
        backgroundColor: "rgba(255, 73, 64, 0.33)", // Semi-transparent red background
        border: "2px solid rgba(255, 73, 64, 0.33)",
        borderRadius: "9999px", // Fully rounded corners
        padding: "6px 12px", // Adjust padding for text and icon
        fontFamily: "'Inter', sans-serif", // Apply Inter font
        fontSize: "14px", // Adjust text size
        fontWeight: "bold", // Regular font weight
      }}
    >
      <span style={{ marginLeft: "8px" }}>Undo</span> {/* Left margin for text */}
      <span
        className="ml-2 flex items-center justify-center"
        style={{
          border: "2px solid rgba(255, 0, 0, 1)", // Red outline
          borderRadius: "50%", // Circle shape
          width: "20px", // Circle size
          height: "20px",
          color: "rgba(255, 0, 0, 1)", // Red icon color
          marginLeft: "12px", // Space between text and icon
        }}
      >
        <HiX style={{ fontSize: "12px" }} /> {/* Smaller X icon */}
      </span>
    </button>
  );
}
