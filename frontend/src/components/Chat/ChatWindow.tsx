// ChatWindow.tsx
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

  // Scroll to the bottom of the chat window
  const scrollToBottom = () => {
    if (chatEndRef.current) {
      chatEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  };

  // Trigger scroll to bottom whenever messages change
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  return (
    <div className="flex-1 p-4 overflow-y-auto bg-slate-800">
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
