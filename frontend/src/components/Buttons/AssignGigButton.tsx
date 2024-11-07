export function AssignGigButton() {
    return (
      <button
        className="flex items-center justify-center text-black"
        style={{
          backgroundColor: "rgba(42, 168, 21, 1)", // Custom green color
          borderRadius: "9999px", // Fully rounded corners
          padding: "3px 6px", // Minimal padding for a smaller button size
          lineHeight: "1", // Adjusted line height for compact content
          fontFamily: "'Inter', sans-serif", // Apply Inter font
          fontWeight: "normal", // Ensure the text is not bold
          fontSize: "12px", // Smaller text size for compact appearance
        }}
      >
        Assign Gig
      </button>
    );
  }
  