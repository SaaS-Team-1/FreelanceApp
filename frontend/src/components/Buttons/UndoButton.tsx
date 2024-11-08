import { HiX } from "react-icons/hi"; // Import the close "X" icon

export function UndoButton() {
  return (
    <button
      className="flex items-center justify-between text-white"
      style={{
        backgroundColor: "rgba(255, 73, 64, 0.33)", // Semi-transparent red background
        border:"2px solid rgba(255, 73, 64, 0.33)",
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

//"rgba(255, 73, 64, 0.33)" : "rgba(177, 60, 60, 1)", // More prominent color in light mode
//isDarkMode ? "2px solid rgba(255, 73, 64, 0.33)":"2px solid rgba(255, 72, 72, 1)"
 

// import { HiX } from "react-icons/hi"; // Import the close "X" icon
// import { useEffect, useState } from "react";

// export function UndoButton() {
//   const [isDarkMode, setIsDarkMode] = useState(false);

//   useEffect(() => {
//     // Check if dark mode is enabled
//     const darkModeMediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
//     setIsDarkMode(darkModeMediaQuery.matches);

//     const handleChange = (e: { matches: boolean | ((prevState: boolean) => boolean); }) => {
//       setIsDarkMode(e.matches);
//     };

//     // Listen for changes in theme preference
//     darkModeMediaQuery.addEventListener("change", handleChange);

//     return () => {
//       darkModeMediaQuery.removeEventListener("change", handleChange);
//     };
//   }, []);

//   const backgroundColor = isDarkMode
//     ? "rgba(255, 73, 64, 0.33)" // Color for dark mode
//     : "rgba(100, 0, 0, 0.17)"; // issue with color 

    

//   return (
//     <button
//       className="flex items-center justify-between text-white"
//       style={{
//         backgroundColor: backgroundColor, // Apply different color based on mode
//         border: `2px solid ${backgroundColor}`, // Match the border with the background
//         borderRadius: "9999px", // Fully rounded corners
//         padding: "6px 12px", // Adjust padding for text and icon
//         fontFamily: "'Inter', sans-serif", // Apply Inter font
//         fontSize: "14px", // Adjust text size
//         fontWeight: "bold", // Regular font weight
//       }}
//     >
//       <span style={{ marginLeft: "8px" }}>Undo</span> {/* Left margin for text */}
//       <span
//         className="ml-2 flex items-center justify-center"
//         style={{
//           border: "2px solid rgba(255, 0, 0, 1)", // Red outline for icon
//           borderRadius: "50%", // Circle shape
//           width: "20px", // Circle size
//           height: "20px",
//           color: "rgba(255, 0, 0, 1)", // Red icon color
//           marginLeft: "12px", // Space between text and icon
//         }}
//       >
//         <HiX style={{ fontSize: "12px" }} /> {/* Smaller X icon */}
//       </span>
//     </button>
//   );}