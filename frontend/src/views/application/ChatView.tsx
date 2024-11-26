import { useState, useEffect } from "react";
import { useFirestore, useUser } from "@/utils/reactfire";
import {
  getDocs,
  query,
  where,
  orderBy,
  doc,
  getDoc,
  limit,
  Timestamp,
  onSnapshot,
  addDoc,
  serverTimestamp,
} from "firebase/firestore";
import {
  chatsRef,
  chatMessagesRef,
  gigsRef,
  applicationsRef,
  usersRef,
} from "@/utils/database/collections";
import ChatHeader from "@/components/Chat/ChatHeader";
import ChatWindow from "@/components/Chat/ChatWindow";
import MessageInput from "@/components/Chat/MessageInput";
import ChatCard from "@/components/Chat/ChatCard";
import GigDetailsModal from "@/components/Chat/GigDetailsModal";

interface ExtendedChat {
  id: string;
  chatId: string;
  gigId: string;
  listerId: string;
  applicantId: string;
  applicationId: string;
  partnerName?: string;
  gigTitle?: string;
  lastMessageTimestamp?: Timestamp | null;
}

function ChatPage() {
  const { data: user } = useUser();
  const db = useFirestore();
  const [chats, setChats] = useState<ExtendedChat[]>([]);
  const [selectedChat, setSelectedChat] = useState<ExtendedChat | null>(null);
  const [messages, setMessages] = useState<any[]>([]);
  const [gig, setGig] = useState<any | null>(null);
  const [application, setApplication] = useState<any | null>(null);
  const [chatPartner, setChatPartner] = useState<any | null>(null);
  const [isGigDetailsOpen, setIsGigDetailsOpen] = useState(false);

  useEffect(() => {
    if (user) {
      const fetchChats = async () => {
        try {
          const listerChatsQuery = query(chatsRef(db), where("listerId", "==", user.uid));
          const applicantChatsQuery = query(chatsRef(db), where("applicantId", "==", user.uid));

          const listerChatsSnapshot = await getDocs(listerChatsQuery);
          const listerChats = listerChatsSnapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
          }));

          const applicantChatsSnapshot = await getDocs(applicantChatsQuery);
          const applicantChats = applicantChatsSnapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
          }));

          const allChats = [...listerChats, ...applicantChats] as ExtendedChat[];
          for (const chat of allChats) {
            const partnerId =
              user.uid === chat.listerId ? chat.applicantId : chat.listerId;
            const partnerDoc = await getDoc(doc(usersRef(db), partnerId));
            const partnerData = partnerDoc.data();

            const gigDoc = await getDoc(doc(gigsRef(db), chat.gigId));
            const gigData = gigDoc.data();

            const messageQuery = query(
              chatMessagesRef(db),
              where("chatId", "==", chat.chatId),
              orderBy("timestamp", "desc"),
              limit(1)
            );
            const lastMessageSnapshot = await getDocs(messageQuery);
            const lastMessage = lastMessageSnapshot.docs[0]?.data() || null;

            chat.partnerName = partnerData?.displayName || "Unknown User";
            chat.gigTitle = truncateString(gigData?.title || "Untitled Gig", 30);
            chat.lastMessageTimestamp = lastMessage?.timestamp || null;
          }

          // Sort chats by the last message timestamp
          const sortedChats = allChats.sort((a, b) => {
            const aTime = a.lastMessageTimestamp?.seconds || 0;
            const bTime = b.lastMessageTimestamp?.seconds || 0;
            return bTime - aTime; // Descending order
          });

          setChats(sortedChats);

          if (sortedChats.length > 0) {
            setSelectedChat(sortedChats[0]);
          }
        } catch (error) {
          console.error("Error fetching chats:", error);
        }
      };

      fetchChats();
    }
  }, [user, db]);

  useEffect(() => {
    const fetchDetails = async () => {
      if (selectedChat) {
        const gigDoc = await getDoc(doc(gigsRef(db), selectedChat.gigId));
        setGig(gigDoc.data());

        const applicationDoc = await getDoc(
          doc(applicationsRef(db), selectedChat.applicationId)
        );
        setApplication(applicationDoc.data());

        const partnerId =
          user?.uid === selectedChat.listerId
            ? selectedChat.applicantId
            : selectedChat.listerId;
        const partnerDoc = await getDoc(doc(usersRef(db), partnerId));
        setChatPartner(partnerDoc.data());
      }
    };

    fetchDetails();
  }, [selectedChat, user, db]);

  useEffect(() => {
    if (selectedChat) {
      const q = query(
        chatMessagesRef(db),
        where("chatId", "==", selectedChat.chatId),
        orderBy("timestamp", "asc")
      );

      const unsubscribe = onSnapshot(q, (snapshot) => {
        const messagesData = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setMessages(messagesData);
      });

      return () => unsubscribe();
    }
  }, [selectedChat, db]);

  const truncateString = (str: string, maxLength: number) => {
    return str.length > maxLength ? str.slice(0, maxLength) + "..." : str;
  };

  const formatTimestamp = (timestamp: Timestamp | null) => {
    if (!timestamp) return "";
    const now = new Date();
    const date = new Date(timestamp.seconds * 1000);

    if (now.toDateString() === date.toDateString()) {
      return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
    } else if (now.getTime() - date.getTime() < 7 * 24 * 60 * 60 * 1000) {
      return date.toLocaleDateString([], { weekday: "long" });
    } else {
      return date.toLocaleDateString([], { month: "short", day: "numeric" });
    }
  };

  return (
    <div className="h-screen bg-slate-600 rounded-lg p-4">
      <div className="flex max-w-7xl h-full max-h-[95%] bg-gray-800 rounded-lg overflow-hidden">
        <div className="w-3/8 bg-gray-800 overflow-y-auto border-r scrollbar">
          <h2 className="text-lg font-bold p-4 text-white">Active Chats</h2>
          {chats.map((chat) => (
            <div
              key={chat.chatId}
              onClick={() => setSelectedChat(chat)}
              className={`p-4 cursor-pointer flex justify-between ${
                chat.chatId === selectedChat?.chatId
                  ? "bg-blue-700 text-white"
                  : "bg-gray-700 text-gray-100"
              } hover:bg-blue-500`}
            >
              <div>
                <p className="font-bold truncate">{chat.partnerName}</p>
                <p className="text-sm text-gray-400 truncate">{chat.gigTitle}</p>
              </div>
              <p className="text-sm text-gray-300">
                {formatTimestamp(chat.lastMessageTimestamp)}
              </p>
            </div>
          ))}
        </div>

        <div className="w-4/5 flex-1 flex flex-col overflow-y-auto bg-slate-600">
          {selectedChat ? (
            <>
 
              <ChatHeader
                  user={{
                    name: chatPartner?.displayName || "Unknown User",
                    profilePicture: chatPartner?.profile?.picture || "",
                    bio: chatPartner?.profile?.bio,
                    location: chatPartner?.profile?.location,
                    completedGigs: chatPartner?.stats?.completedGigs,
                    averageRating: chatPartner?.stats?.averageRating,
                  }}
                  status={
                    user?.uid === selectedChat?.listerId
                      ? gig?.status || "Unknown"
                      : application?.status || "Unknown"
                  }
                  isLister={user?.uid === selectedChat?.listerId}
                  onSeeGigDetails={() => setIsGigDetailsOpen(true)}
                />


              <div className="w-4/5 flex-1 overflow-y-auto bg-gray-800 p-4 scrollbar">
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
                chatId={selectedChat.chatId}
                currentUserId={user?.uid || ""}
                recipientId={
                  selectedChat.listerId === user?.uid
                    ? selectedChat.applicantId
                    : selectedChat.listerId
                }
                db={db}
              />
            </>
          ) : (
            <div className="flex items-center justify-center text-gray-500">
              No chat selected
            </div>
          )}
        </div>
      </div>

      {isGigDetailsOpen && gig && (
        <GigDetailsModal
          gig={gig}
          lister={chatPartner}
          onClose={() => setIsGigDetailsOpen(false)}
        />
      )}
    </div>
  );
}

export default ChatPage;

