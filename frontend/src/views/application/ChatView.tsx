

import { useState, useEffect } from "react";
import { useFirestore, useUser } from "@/utils/reactfire";
import { getDocs, query, where, orderBy } from "firebase/firestore";
import {
  chatsRef,
  chatMessagesRef,
  gigsRef,
  applicationsRef,
} from "@/utils/database/collections";
import ChatHeader from "@/components/Chat/ChatHeader";
import ChatWindow from "@/components/Chat/ChatWindow";
import MessageInput from "@/components/Chat/MessageInput";
import ChatCard from "@/components/Chat/ChatCard";
import GigDetailsModal from "@/components/Chat/GigDetailsModal";

function ChatPage() {
  const { data: user } = useUser();
  const db = useFirestore();
  const [chats, setChats] = useState<any[]>([]);
  const [selectedChat, setSelectedChat] = useState<any | null>(null);
  const [messages, setMessages] = useState<any[]>([]);
  const [gig, setGig] = useState<any | null>(null);
  const [application, setApplication] = useState<any | null>(null);
  const [isGigDetailsOpen, setIsGigDetailsOpen] = useState(false);

  // Disable body scroll when this component is mounted
  useEffect(() => {
    document.body.style.overflow = "hidden"; // Disable scrolling on the body
    return () => {
      document.body.style.overflow = ""; // Restore scrolling when component unmounts
    };
  }, []);

  useEffect(() => {
    if (user) {
      const q = query(chatsRef(db), where("userId", "==", user.uid));
      getDocs(q).then((snapshot) => {
        const chatData = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setChats(chatData);

        if (chatData.length > 0) {
          setSelectedChat(chatData[0]);
        }
      });
    }
  }, [user, db]);

  useEffect(() => {
    if (selectedChat) {
      const fetchGigAndApplication = async () => {
        const gigDoc = await getDocs(
          query(gigsRef(db), where("gigId", "==", selectedChat.gigId))
        );
        const gigData = gigDoc.docs[0]?.data() || null;
        setGig(gigData);

        if (gigData) {
          const appDoc = await getDocs(
            query(
              applicationsRef(db),
              where("gigId", "==", gigData.gigId),
              where("applicantId", "==", user?.uid)
            )
          );
          const appData = appDoc.docs[0]?.data() || null;
          setApplication(appData);
        }
      };

      fetchGigAndApplication();
    }
  }, [selectedChat, user, db]);

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
    <div className="h-screen bg-slate-600 rounded-lg p-4">
      {/* Main Chat Container */}
      <div className="flex max-w-7xl h-full max-h-[95%] bg-gray-900 rounded-lg overflow-hidden">
        {/* Chat List */}
        <div className="w-1/4 bg-gray-900 overflow-y-auto border-r scrollbar">
          <h2 className="text-lg font-bold p-4 bg-gray-900 text-white">Active Chats</h2>
          {chats.map((chat) => (
            <div
              key={chat.id}
              onClick={() => setSelectedChat(chat)}
              className={`p-4 cursor-pointer ${
                chat.id === selectedChat?.id ? "bg-blue-700 text-white" : "bg-gray-700 text-gray-100"
              } hover:bg-blue-500`}
            >
              <p className="font-bold truncate">{chat.gigId}</p>
              <p className="text-sm truncate">{chat.userId}</p>
            </div>
          ))}
        </div>

        {/* Chat Content */}
        <div className="w-4/5 flex-1 flex flex-col overflow-y-auto bg-slate-600">
          {selectedChat ? (
            <>
              <ChatHeader
                user={{
                  name: selectedChat.userName,
                  profilePicture: selectedChat.userProfilePicture,
                }}
                status={
                  gig
                    ? user?.uid === gig.listerId
                      ? gig.status
                      : application?.status || "no application"
                    : "unknown"
                }
                onSeeGigDetails={() => setIsGigDetailsOpen(true)}
              />

              <div className="w-4/5 flex-1 overflow-y-auto bg-gray-900 p-4 scrollbar ">
                <ChatWindow
                  messages={messages.map((message) => ({
                    text: message.content,
                    timestamp: new Date(
                      message.timestamp.seconds * 1000
                    ).toLocaleString(),
                    isSentByCurrentUser: message.senderId === user?.uid,
                  }))}
                />
                {gig && (
                  <div className="mt-4 flex justify-center">
                    <ChatCard
                      gig={gig}
                      application={application}
                      userId={user?.uid || ""}
                    />
                  </div>
                )}
              </div>

              <MessageInput
                onSend={(message) => {
                  console.log("Message sent:", message);
                }}
              />
            </>
          ) : (
            <div className="w-4/5 flex-1 flex items-center justify-center text-gray-500">
              No chat selected
            </div>
          )}
        </div>
      </div>

      {/* Gig Details Modal */}
      {isGigDetailsOpen && gig && (
        <GigDetailsModal
          gig={gig}
          lister={selectedChat.lister} // Pass lister details
          onClose={() => setIsGigDetailsOpen(false)}
        />
      )}
    </div>
  );
}

export default ChatPage;
