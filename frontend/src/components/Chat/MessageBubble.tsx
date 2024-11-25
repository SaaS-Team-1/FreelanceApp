
import React from "react";

interface MessageBubbleProps {
  message: string;
  timestamp: string;
  isSentByCurrentUser: boolean;
}


const MessageBubble: React.FC<MessageBubbleProps> = ({
  message,
  timestamp,
  isSentByCurrentUser,
}) => {
  return (
    <div
      className={`flex ${
        isSentByCurrentUser ? "justify-end" : "justify-start"
      } mb-2`}
    >
      <div
        className={`max-w-xs px-4 py-2 rounded-lg break-words ${
          isSentByCurrentUser ? "bg-blue-300 text-black" : "bg-gray-100 text-black"
        }`}
      >
        <p>{message}</p>
        <p className="text-xs text-orange-800 mt-1">{timestamp}</p>
        
      </div>
    </div>
  );
};


export default MessageBubble;
