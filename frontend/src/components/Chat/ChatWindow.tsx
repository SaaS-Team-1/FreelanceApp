import React, { useEffect, useRef } from "react";
import MessageBubble from "./MessageBubble";

interface ChatWindowProps {
  messages: {
    text: string;
    timestamp: string;
    isSentByCurrentUser: boolean;
  }[];
}

const ChatWindow: React.FC<ChatWindowProps> = ({ messages }) => {
  const chatEndRef = useRef<HTMLDivElement>(null);

  // Scroll to the bottom when a new message is added
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]); // Trigger whenever `messages` changes

  return (
    <div className="flex-1 p-4 overflow-y-auto bg-gray-900">
      {messages.map((message, index) => (
        <MessageBubble
          key={index}
          message={message.text}
          timestamp={message.timestamp}
          isSentByCurrentUser={message.isSentByCurrentUser}
        />
      ))}
      <div ref={chatEndRef} />
    </div>
  );
};

export default ChatWindow;
