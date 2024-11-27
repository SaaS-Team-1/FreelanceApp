import React from "react";
import { HiX } from "react-icons/hi"; 

interface UndoButtonProps {
  onClick: () => void; // Add onClick prop type
}

export function UndoButton({ onClick }: UndoButtonProps) {
  return (
    <button
      onClick={onClick} 
      className="flex items-center justify-between text-white"
      style={{
        backgroundColor: "rgba(255, 73, 64, 0.33)", 
        border: "2px solid rgba(255, 73, 64, 0.33)",
        borderRadius: "7px", 
        padding: "3px 12px", 
        fontFamily: "'Inter', sans-serif", 
        fontSize: "14px", 
        // fontWeight: "bold", 
      }}
    >
      <span style={{ marginLeft: "8px" }}>Undo</span> {/* Left margin for text */}
      <span
        className="ml-2 flex items-center justify-center"
        style={{
          border: "2px solid rgba(255, 0, 0, 1)", 
          borderRadius: "50%", 
          width: "20px", 
          height: "20px",
          color: "rgba(255, 0, 0, 1)", 
          marginLeft: "12px", 
        }}
      >
        <HiX style={{ fontSize: "12px" }} /> {/* Smaller X icon */}
      </span>
    </button>
  );
}
