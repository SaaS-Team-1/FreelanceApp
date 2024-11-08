import { HiUser } from "react-icons/hi";

export function SeeProfileButton() {
  return (
    <a
      href="/profile" // Replace with your desired link
      className="flex items-center justify-center text-black"
      style={{
        backgroundColor: "rgba(68, 176, 232, 1)", // Custom blue color
        borderRadius: "9999px", // Fully rounded corners
        padding: "2px 6px", // Reduced padding for a smaller button size
        lineHeight: "1", // Adjusted line height for vertical centering
        fontFamily: "'Inter', sans-serif", // Apply Inter font
        fontWeight: "normal", // Ensure the text is not bold
        textDecoration: "none", // Remove underline
        fontSize: "12px", // Smaller text size
      }}
    >
      <HiUser className="mr-1" style={{ fontSize: "16px" }} /> {/* Smaller icon size */}
      See Profile
    </a>
  );
}
