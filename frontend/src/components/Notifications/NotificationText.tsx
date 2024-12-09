import { Timestamp } from "firebase/firestore";
import React, { useState } from "react";

interface NotificationTextProps {
  text: string;
  time: Timestamp;
}

const NotificationText = ({ text, time }: NotificationTextProps) => {
  const [isExpanded, setIsExpanded] = useState(false);

  // Define the maximum length for the text before truncation
  const MAX_LENGTH = 50;

  // Toggle the text expansion
  const toggleExpanded = () => {
    setIsExpanded(!isExpanded);
  };

  return (
    <div className="flex flex-col">
      <p className="text-sm text-slate-800">
        {text && (isExpanded || text.length <= MAX_LENGTH) ? (
          text
        ) : (
          <>
            {text && text.slice(0, MAX_LENGTH)}...
            <span
              className="cursor-pointer text-blue-400"
              onClick={toggleExpanded}
            >
              {" "}
              Read more
            </span>
          </>
        )}
        {isExpanded && (
          <span
            className="cursor-pointer text-blue-400"
            onClick={toggleExpanded}
          >
            {" "}
            Show less
          </span>
        )}
      </p>
      <span className="text-xs text-blue-500">{time.toString()}</span>
    </div>
  );
};

export default NotificationText;
