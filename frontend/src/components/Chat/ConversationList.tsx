import React from "react";

interface Conversation {
  id: string;
  name: string;
  profilePicture: string;
  lastMessage: string;
  gigStatus: "open" | "in-progress" | "completed" | "awaiting-lister-completion";
}

interface ConversationListProps {
  conversations: Conversation[];
  onSelectConversation: (id: string) => void; // Callback to select a conversation
  selectedConversationId: string | null; // ID of the currently selected conversation
}

const ConversationList: React.FC<ConversationListProps> = ({
  conversations,
  onSelectConversation,
  selectedConversationId,
}) => {
  return (
    <div className="w-1/3 bg-slate-700 text-white h-screen overflow-y-auto border-r border-gray-700">
      {conversations.map((conversation) => (
        <div
          key={conversation.id}
          onClick={() => onSelectConversation(conversation.id)}
          className={`p-4 flex items-center gap-3 cursor-pointer transition-all ${
            selectedConversationId === conversation.id
              ? "bg-blue-500"
              : "hover:bg-slate-800"
          }`}
        >
          {/* Profile Picture */}
          <img
            src={conversation.profilePicture || "https://via.placeholder.com/40"}
            alt={conversation.name}
            className="w-12 h-12 rounded-full"
          />

          {/* Conversation Details */}
          <div className="flex-1">
            <h4 className="text-sm font-semibold">{conversation.name}</h4>
            <p className="text-xs text-gray-300 truncate">{conversation.lastMessage}</p>
            <span className={`text-xs mt-1 inline-block font-medium ${
              conversation.gigStatus === "open"
                ? "text-green-400"
                : conversation.gigStatus === "in-progress"
                ? "text-yellow-400"
                : conversation.gigStatus === "awaiting-lister-completion"
                ? "text-orange-400"
                : "text-gray-400"
            }`}>
              {conversation.gigStatus.replace(/-/g, " ").toUpperCase()}
            </span>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ConversationList;
