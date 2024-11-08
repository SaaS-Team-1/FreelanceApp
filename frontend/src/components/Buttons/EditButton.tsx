import { HiPencil } from "react-icons/hi"; // Import the pencil icon

export function EditButton() {
  return (
    <button
      className="flex items-center justify-start text-black" // Aligns content to the left
      style={{
        backgroundColor: "rgba(68, 176, 232, 1)", // Custom blue color
        borderRadius: "9999px", // Fully rounded corners
        padding: "5px 16px", // Padding for button size
        fontFamily: "'Inter', sans-serif", // Apply Inter font
        fontSize: "18px", // Adjust text size
        lineHeight: "1",
        fontWeight: "normal", // Regular font weight
      }}
    >
      <HiPencil className=" ml-0 mr-1.5 text-2xl" /> {/* Small margin-right for spacing */}
      <span className="mr-4">Edit</span> {/* Small margin for text */}
    </button>
  );
}
