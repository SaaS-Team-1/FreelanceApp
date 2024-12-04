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

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <div className="w-full grow bg-gray-800 p-4">
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
