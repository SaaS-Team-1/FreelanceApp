import React, { useState } from "react";
import { doc, addDoc, getDoc, updateDoc, getDocs, query, where, writeBatch } from "firebase/firestore";
import { chatMessagesRef, chatsRef } from "@/utils/database/collections";
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
        // Add the message to the chatMessages collection
        await addDoc(chatMessagesRef(db), {
          chatId,
          senderId: currentUserId,
          sentToId: recipientId,
          content: message,
          timestamp: Timestamp.now(), // Use Timestamp from Firestore
          isRead: false,
        });
  
        // Update the lastUpdate field in the chat document
        const chatRef = doc(chatsRef(db), chatId);
        await updateDoc(chatRef, {
          lastUpdate: Timestamp.now(),
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
    <div className="flex w-full items-center border-t border-gray-700 bg-gray-800 p-4">
      <textarea
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder="Type your message here..."
        className="scrollbar h-12 flex-1 resize-none overflow-y-auto rounded-lg bg-gray-800 p-3 text-white outline-none placeholder:text-gray-500"
      />
      <button
        onClick={handleSend}
        className="ml-3 rounded-lg bg-blue-500 px-4 py-2 text-white hover:bg-blue-600"
      >
        Send
      </button>
    </div>
  );
};

export default MessageInput;
