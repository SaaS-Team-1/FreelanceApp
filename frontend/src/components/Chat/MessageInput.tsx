

import React, { useState } from "react";

interface MessageInputProps {
  onSend: (message: string) => void;
}

const MessageInput: React.FC<MessageInputProps> = ({ onSend }) => {
  const [message, setMessage] = useState("");

  const handleSend = () => {
    if (message.trim()) {
      onSend(message);
      setMessage("");
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter") {
      if (e.shiftKey) {
        // Allow newline with Shift+Enter
      } else {
        e.preventDefault(); // Prevent default Enter behavior
        handleSend();
      }
    }
  };

  return (
    <div className="w-4/5 p-4 bg-gray-800 flex items-center border-t border-gray-700">
      <textarea
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder="Type your message here..."
        className="flex-1 p-3 rounded-lg bg-gray-800 text-white outline-none placeholder-gray-500 resize-none h-12 overflow-y-auto scrollbar"
      />
      <button
        onClick={handleSend}
        className="ml-3 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
      >
        Send
      </button>
    </div>
  );
};

export default MessageInput;


