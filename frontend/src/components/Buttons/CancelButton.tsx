export function CancelButton() {
  return (
    <button
      className="border focus:outline-none" // Tailwind classes for border and text color
      style={{
        backgroundColor: "rgba(240, 248, 255, 1)", // Custom light background color
        borderColor: "rgba(68, 176, 232, 1)", // Custom border color
        color: "rgba(68, 176, 232, 1)", // Custom text color
        borderRadius: "12px", // Rounded corners
        padding: "4px 18px", // Adjusted padding for proportional size
        fontFamily: "'Inter', sans-serif", // Apply Inter font
      }}
    >
      Cancel
    </button>
  );
}
