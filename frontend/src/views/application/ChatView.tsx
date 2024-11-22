

import { useState, useEffect } from "react";
import { useFirestore, useUser } from "@/utils/reactfire";
import { getDocs, query, where, orderBy } from "firebase/firestore";
import ChatHeader from "@/components/Chat/ChatHeader";
import ChatWindow from "@/components/Chat/ChatWindow";
import MessageInput from "@/components/Chat/MessageInput";
import { chatsRef, chatMessagesRef } from "@/utils/database/collections";

function ChatPage() {
  const { data: user } = useUser(); // Get current user
  const db = useFirestore();
  const [chats, setChats] = useState<any[]>([]);
  const [selectedChat, setSelectedChat] = useState<any | null>(null);
  const [messages, setMessages] = useState<any[]>([]);

  // Fetch chats for the current user
  useEffect(() => {
    if (user) {
      const q = query(chatsRef(db), where("userId", "==", user.uid));
      getDocs(q).then((snapshot) => {
        const chatData = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setChats(chatData);

        // Automatically select the first chat if available
        if (chatData.length > 0) {
          setSelectedChat(chatData[0]);
        }
      });
    }
  }, [user, db]);

  // Fetch messages for the selected chat
  useEffect(() => {
    if (selectedChat) {
      const q = query(
        chatMessagesRef(db),
        where("chatId", "==", selectedChat.id),
        orderBy("timestamp", "asc")
      );

      getDocs(q).then((snapshot) => {
        const messagesData = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setMessages(messagesData);
      });
    }
  }, [selectedChat, db]);

  return (
    <div className="h-screen flex flex-col">
      {selectedChat ? (
        <>
          <ChatHeader
            user={{
              name: selectedChat.userName, // Assuming chat data has userName
              profilePicture: selectedChat.userProfilePicture, // Assuming chat data has profile picture
            }}
            status={selectedChat.status}
          />
          <ChatWindow
            messages={messages.map((message) => ({
              text: message.content,
              timestamp: new Date(message.timestamp.seconds * 1000).toLocaleString(), // Convert Firestore timestamp
              isSentByCurrentUser: message.senderId === user?.uid,
            }))}
          />
          <MessageInput
            onSend={(message) => {
              console.log("Message sent:", message);
              // Placeholder for message sending functionality
            }}
          />
        </>
      ) : (
        <div className="text-white text-center p-8">No chats available</div>
      )}
    </div>
  );
}

export default ChatPage;
