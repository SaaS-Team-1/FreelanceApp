function AwaitingAssigningBadge() {
  return (
    <span
      className="inline-block text-white"
      style={{
        backgroundColor: "rgba(255, 106, 0, 0.6)", // Custom orange color
        borderRadius: "9999px", // Fully rounded corners
        fontFamily: "'Inter', sans-serif", // Apply Inter font
        fontWeight: "normal", // Ensure the text is not bold
        fontSize: "12px", // Smaller text size
        padding: "2px 8px", // Minimal padding for a badge look
      }}
    >
      Awaiting Assigning
    </span>
  );
}

function AssignedBadge() {
  return (
    <span
      className="inline-block text-white"
      style={{
        backgroundColor: "rgba(255, 106, 0, 0.6)", // Custom orange color
        borderRadius: "9999px", // Fully rounded corners
        fontFamily: "'Inter', sans-serif", // Apply Inter font
        fontWeight: "normal", // Ensure the text is not bold
        fontSize: "12px", // Smaller text size
        padding: "2px 8px", // Minimal padding for a badge look
      }}
    >
      Assigned
    </span>
  );
}

function FinishedBadge() {
  return (
    <span
      className="inline-block text-white"
      style={{
        backgroundColor: "rgba(255, 106, 0, 0.6)", // Custom orange color
        borderRadius: "9999px", // Fully rounded corners
        fontFamily: "'Inter', sans-serif", // Apply Inter font
        fontWeight: "normal", // Ensure the text is not bold
        fontSize: "12px", // Smaller text size
        padding: "2px 8px", // Minimal padding for a badge look
      }}
    >
      Finished
    </span>
  );
}

function CompletedBadge() {
  return (
    <span
      className="inline-block text-white"
      style={{
        backgroundColor: "rgba(255, 106, 0, 0.6)", // Custom orange color
        borderRadius: "9999px", // Fully rounded corners
        fontFamily: "'Inter', sans-serif", // Apply Inter font
        fontWeight: "normal", // Ensure the text is not bold
        fontSize: "12px", // Smaller text size
        padding: "2px 8px", // Minimal padding for a badge look
      }}
    >
      Completed
    </span>
  );
}

export { AwaitingAssigningBadge, AssignedBadge, FinishedBadge, CompletedBadge };
