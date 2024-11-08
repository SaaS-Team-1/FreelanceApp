import { HiTrash } from "react-icons/hi"; // Import the pencil icon

export function DeleteButton() {
  return (
    <button
      className="flex items-center justify-start text-black" // Aligns content to the left
      style={{
        backgroundColor: "rgba(68, 176, 232, 1)", // Custom blue color
        borderRadius: "9999px", // Fully rounded corners
        padding: "6px 16px", // Padding for button size
        fontSize: "18px", // Adjust text size
        lineHeight: "1",
        fontFamily: "'Inter', sans-serif", // Apply Inter font to match EditButton
        fontWeight: "normal", // Regular font weight
      }}
    >
      <HiTrash className=" mr-1.5 text-xl" /> {/* Small margin-right for spacing */}
      <span >Delete</span> {/* Small margin for text */}
    </button>
  );
}
