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
        className={`max-w-xs break-words rounded-lg px-4 py-2 ${
          isSentByCurrentUser
            ? "bg-blue-300 text-black"
            : "bg-gray-100 text-black"
        }`}
      >
        <p>{message}</p>
        <p className="mt-1 text-xs text-orange-800">{timestamp}</p>
      </div>
    </div>
  );
};

export default MessageBubble;
