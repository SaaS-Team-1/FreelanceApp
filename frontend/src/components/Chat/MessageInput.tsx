


import React, { useState } from "react";
import { addDoc } from "firebase/firestore";
import { chatMessagesRef } from "@/utils/database/collections";
import { Timestamp } from "firebase/firestore";


interface MessageInputProps {
  chatId: string;
  currentUserId: string;
  recipientId: string;
  db: any;
  onMessageSent: () => void; // New callback prop
}

const MessageInput: React.FC<MessageInputProps> = ({
  chatId,
  currentUserId,
  recipientId,
  db,
  onMessageSent,
}) => {
  const [message, setMessage] = useState("");

  const handleSend = async () => {
    if (message.trim()) {
      try {
        await addDoc(chatMessagesRef(db), {
          chatId,
          senderId: currentUserId,
          sentToId: recipientId,
          content: message,
          timestamp: Timestamp.now(), // Use Timestamp from Firestore
          isRead: false,
        });
        setMessage("");
        onMessageSent(); // Notify parent component to update chats
      } catch (error) {
        console.error("Error sending message:", error);
      }
    }
  };
  

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="w-full p-4 bg-gray-800 flex items-center border-t border-gray-700">
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
