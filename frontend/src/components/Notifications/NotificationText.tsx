import React, { useState } from 'react';

const NotificationText = ({ text, time }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  // Define the maximum length for the text before truncation
  const MAX_LENGTH = 50;

  // Toggle the text expansion
  const toggleExpanded = () => {
    setIsExpanded(!isExpanded);
  };

  return (
    <div className="flex flex-col">
      <p className="text-sm text-white">
        {isExpanded || text.length <= MAX_LENGTH ? (
          text
        ) : (
          <>
            {text.slice(0, MAX_LENGTH)}...
            <span
              className="text-blue-400 cursor-pointer"
              onClick={toggleExpanded}
            >
              {" "}Read more
            </span>
          </>
        )}
        {isExpanded && (
          <span
            className="text-blue-400 cursor-pointer"
            onClick={toggleExpanded}
          >
            {" "}Show less
          </span>
        )}
      </p>
      <span className="text-xs text-blue-500">{time}</span>
    </div>
  );
};

export default NotificationText;

