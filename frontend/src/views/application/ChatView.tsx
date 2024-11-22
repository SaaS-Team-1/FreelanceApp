import React, { useState } from "react";
import ChatHeader from "@/components/Chat/ChatHeader";
import ChatWindow from "@/components/Chat/ChatWindow";
import MessageInput from "@/components/Chat/MessageInput";
import ChatCard from "@/components/Chat/ChatCard";
import ConversationList from "@/components/Chat/ConversationList";

// Mock User
const mockUser = {
  userId: "user1",
  email: "user1@example.com",
  displayName: "John Doe",
  profile: {
    bio: "Experienced freelance developer with a passion for creating amazing projects.",
    credits: 120,
    picture: "https://via.placeholder.com/80",
    location: "New York, USA",
  },
  stats: {
    completedGigs: 15,
    averageRating: 4.8,
  },
  listedGigs: ["gig1", "gig2"],
  activeApplications: ["application1"],
  chatIds: ["chat1", "chat2"],
};




const mockConversations = [
  {
    chatId: "chat1",
    gigId: "gig1",
    participants: ["user1", "user2"], // Example IDs
    isApplicationChat: true,
    gigStatus: "open",
    messages: [
      { messageId: "1", senderId: "user2", content: "Hello! Is this gig still available?", timestamp: new Date(), isRead: true },
    ],
  },
  {
    chatId: "chat2",
    gigId: "gig2",
    participants: ["user1", "user3"],
    isApplicationChat: false,
    gigStatus: "completed",
    messages: [
      { messageId: "2", senderId: "user3", content: "Thanks for assigning the gig!", timestamp: new Date(), isRead: true },
    ],
  },
];

const ChatView: React.FC = () => {
  const currentUserId = mockUser.userId; // Using the mock user's ID
  const [selectedChat, setSelectedChat] = useState(mockConversations[0]); // Default to the first chat

  const handleSelectConversation = (chatId: string) => {
    const chat = mockConversations.find((c) => c.chatId === chatId);
    if (chat) setSelectedChat(chat);
  };

  const handleSendMessage = (message: string) => {
    const updatedChat = { ...selectedChat };
    updatedChat.messages.push({
      messageId: Date.now().toString(),
      senderId: currentUserId,
      content: message,
      timestamp: new Date(),
      isRead: false,
    });
    setSelectedChat(updatedChat);
  };

  return (
    <div className="flex h-screen bg-gray-50 dark:bg-gray-900">
      {/* Sidebar with conversations */}
      {/* <ConversationList
        conversations={mockConversations.map((conv) => ({
          id: conv.chatId,
          name: `Chat with ${conv.participants.find((id) => id !== currentUserId)}`,
          profilePicture: "https://via.placeholder.com/40",
          lastMessage: conv.messages[conv.messages.length - 1]?.content || "",
        }))}
        onSelectConversation={handleSelectConversation}
        selectedConversationId={selectedChat.chatId}
      /> */}

      {/* Chat panel */}
      <div className="flex flex-col flex-1 bg-gray-100 dark:bg-gray-800">
        <ChatHeader
          user={{
            name: `Chat with ${selectedChat.participants.find((id) => id !== currentUserId)}`,
            profilePicture: "https://via.placeholder.com/40",
          }}
          status={selectedChat.gigStatus}
        />
        <ChatWindow
          messages={selectedChat.messages.map((msg) => ({
            text: msg.content,
            timestamp: msg.timestamp.toLocaleTimeString(),
            isSentByCurrentUser: msg.senderId === currentUserId,
          }))}
        />
        <ChatCard
          userId={currentUserId}
          isLister={selectedChat.participants[0] === currentUserId}
          gig={{
            gigId: selectedChat.gigId,
            title: "Mock Gig Title",
            description: "Mock description",
            category: "Mock Category",
            price: 100,
            dueDate: new Date(),
            status: selectedChat.gigStatus,
            listerId: selectedChat.participants[0],
            selectedApplicantId: selectedChat.participants[1],
            applications: [],
            createdAt: new Date(),
          }}
          chat={selectedChat}
          onAssignGig={(applicantId) => console.log("Assign gig to:", applicantId)}
          onRejectApplication={(applicationId) => console.log("Reject application:", applicationId)}
          onMarkComplete={() => console.log("Mark gig as complete")}
          onRate={(rating, comment) => console.log("Rate user with:", rating, comment)}
          onCancelGig={() => console.log("Cancel gig")}
          onApplyToGig={() => console.log("Apply to gig")}
          onCancelApplication={() => console.log("Cancel application")}
        />
        <MessageInput onSend={handleSendMessage} />
      </div>
    </div>
  );
};

export default ChatView;
