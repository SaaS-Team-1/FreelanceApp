
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
        // setMessage((prevMessage) => prevMessage + "\n");
      } else {
        // enter = send the message
        e.preventDefault();
        handleSend();
      }
    }
  };

  return (
    <div className="p-4 bg-slate-700 flex items-center border-t border-gray-700">
      <textarea
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder="Type your message here..."
        className="flex-1 p-3 rounded-lg bg-gray-800 text-white outline-none placeholder-gray-500 resize-none h-12"
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
