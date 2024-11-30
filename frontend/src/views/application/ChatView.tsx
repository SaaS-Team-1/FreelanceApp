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
  onSnapshot,
  Timestamp,
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
import { useNavigate } from "react-router-dom";
import Loading from "@/components/Loading";
import { Gig, User, Application } from "@/utils/database/schema";

interface ExtendedChat {
  id: string;
  chatId: string;
  gigId: string;
  listerId: string;
  applicantId: string;
  applicationId: string;
  partnerName?: string;
  gigTitle?: string;
  // lastMessageTimestamp?: Timestamp | null;
  lastUpdate: Timestamp | null;
}

function ChatPage() {
  const { data: user } = useUser();
  const db = useFirestore();
  const [chats, setChats] = useState<ExtendedChat[]>([]);
  const [chatsLoading, setChatsLoading] = useState(true);

  const [selectedChat, setSelectedChat] = useState<ExtendedChat | null>(null);
  const [messages, setMessages] = useState<any[]>([]);
  const [gig, setGig] = useState<any | null>(null);
  const [application, setApplication] = useState<any | null>(null);
  const [chatPartner, setChatPartner] = useState<any | null>(null);
  const [isGigDetailsOpen, setIsGigDetailsOpen] = useState(false);


  useEffect(() => {
    if (user) {
      setChatsLoading(true);
  
      const listerChatsQuery = query(
        chatsRef(db),
        where("listerId", "==", user.uid)
      );
      const applicantChatsQuery = query(
        chatsRef(db),
        where("applicantId", "==", user.uid)
      );
  
      // Combine real-time listeners for both lister and applicant chats
      const unsubscribeLister = onSnapshot(listerChatsQuery, (snapshot) => {
        const listerChats = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        })) as ExtendedChat[];
  
        updateChatsState(listerChats);
      });
  
      const unsubscribeApplicant = onSnapshot(applicantChatsQuery, (snapshot) => {
        const applicantChats = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        })) as ExtendedChat[];
  
        updateChatsState(applicantChats);
      });
  
      const updateChatsState = async (newChats: ExtendedChat[]) => {
        const enrichedChats = await Promise.all(
          newChats.map(async (chat) => {
            const partnerId =
              user?.uid === chat.listerId ? chat.applicantId : chat.listerId;
      
            const [partnerDoc, gigDoc] = await Promise.all([
              getDoc(doc(usersRef(db), partnerId)),
              getDoc(doc(gigsRef(db), chat.gigId)),
            ]);
      
            const partnerData = partnerDoc.data();
            const gigData = gigDoc.data();
      
            return {
              ...chat,
              partnerName: partnerData?.displayName || "Unknown User",
              gigTitle: truncateString(gigData?.title || "Untitled Gig", 30),
            };
          })
        );
      
        setChats((prevChats) => {
          const updatedChatsMap = new Map<string, ExtendedChat>(
            prevChats.map((chat) => [chat.chatId, chat])
          );
      
          enrichedChats.forEach((chat) => {
            updatedChatsMap.set(chat.chatId, chat);
          });
      
          const updatedChats = Array.from(updatedChatsMap.values());
      
          return updatedChats.sort((a, b) => {
            const aTime = a.lastUpdate?.seconds || 0;
            const bTime = b.lastUpdate?.seconds || 0;
            return bTime - aTime;
          });
        });
      
        setChatsLoading(false);
      };
      
  
      return () => {
        unsubscribeLister();
        unsubscribeApplicant();
      };
    }
  }, [user, db]);
  
  
  useEffect(() => {
    const fetchDetails = async () => {
      if (selectedChat) {
        try {
          const gigDoc = await getDoc(doc(gigsRef(db), selectedChat.gigId));
          setGig(gigDoc.data());

          const applicationDoc = await getDoc(
            doc(applicationsRef(db), selectedChat.applicationId),
          );
          setApplication(applicationDoc.data());

          const partnerId =
            user?.uid === selectedChat.listerId
              ? selectedChat.applicantId
              : selectedChat.listerId;
          const partnerDoc = await getDoc(doc(usersRef(db), partnerId));
          setChatPartner(partnerDoc.data());
        } catch (error) {
          console.error("Error fetching details:", error);
        }
      }
    };

    fetchDetails();
  }, [selectedChat, user, db]);

  useEffect(() => {
    if (selectedChat) {
      const q = query(
        chatMessagesRef(db),
        where("chatId", "==", selectedChat.chatId),
        orderBy("timestamp", "asc"),
      );

      const unsubscribe = onSnapshot(q, (snapshot) => {
        const messagesData = snapshot.docs.map((doc) => {
          const data = doc.data();
          return {
            id: doc.id,
            ...data,
            timestamp: data.timestamp || null, // Ensure fallback for null timestamps
          };
        });
        setMessages(messagesData);
      });

      return () => unsubscribe();
    }
  }, [selectedChat, db]);

  const truncateString = (str: string, maxLength: number) => {
    return str.length > maxLength ? str.slice(0, maxLength) + "..." : str;
  };

  const formatTimestamp = (timestamp: Timestamp | null | undefined) => {
    if (!timestamp) return "N/A";
    const date = new Date(timestamp.seconds * 1000);
    const now = new Date();

    if (now.toDateString() === date.toDateString()) {
      return date.toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      });
    } else if (now.getTime() - date.getTime() < 7 * 24 * 60 * 60 * 1000) {
      return date.toLocaleDateString([], { weekday: "long" });
    } else {
      return date.toLocaleDateString([], { month: "short", day: "numeric" });
    }
  };

  const handleMessageSent = () => {
    if (!selectedChat) return;
    const updatedChats = chats.map((chat) =>
      chat.chatId === selectedChat.chatId
        ? {
            ...chat,
            lastUpdate: Timestamp.now(), 
          }
        : chat,
    );

    updatedChats.sort((a, b) => {
      const aTime = a.lastUpdate?.seconds || 0;
      const bTime = b.lastUpdate?.seconds || 0;
      return bTime - aTime; // Descending order
    });

    setChats(updatedChats);
  };

  const navigate = useNavigate();

  const handleGoToMyGigs = () => {
    navigate("/app/posted-gigs");
  };



  useEffect(() => {
    if (gig?.gigId) {
      const gigRef = doc(gigsRef(db), gig.gigId);
      const unsubscribeGig = onSnapshot(gigRef, (doc) => {
        setGig(doc.data() as Gig);
      });
  
      return () => unsubscribeGig();
    }
  }, [gig?.gigId, db]);
  
  useEffect(() => {
    if (application?.applicationId) {
      const appRef = doc(applicationsRef(db), application.applicationId);
      const unsubscribeApp = onSnapshot(appRef, (doc) => {
        setApplication(doc.data() as Application);
      });
  
      return () => unsubscribeApp();
    }
  }, [application?.applicationId, db]);
  

  return (
    <div className="flex w-full justify-center rounded-xl p-4 ">
      {!chatsLoading ? (
        <>
          <div className="flex h-[calc(100vh-8rem)] w-full justify-center lg:max-w-[60vw]">
            <div className="w-3/5 scrollbar overflow-y-auto border-r bg-gray-800">
              <h2 className="p-4 text-lg font-bold text-white">Active Chats</h2>
              {chats.map((chat) => (
                <div
                  key={chat.chatId}
                  onClick={() => setSelectedChat(chat)}
                  className={`flex cursor-pointer justify-between p-4 ${
                    chat.chatId === selectedChat?.chatId
                      ? "bg-blue-700 text-white"
                      : "bg-gray-700 text-gray-100"
                  } hover:bg-blue-500`}
                >
                  <div>
                    <p className="truncate font-bold">{chat.partnerName}</p>
                    <p className="truncate text-sm text-gray-400">
                      {chat.gigTitle}
                    </p>
                  </div>
                  <p className="text-sm text-gray-300">
                    {formatTimestamp(chat.lastUpdate)}
                  </p>
                </div>
              ))}
            </div>

            <div className="w-full flex size-full flex-col overflow-y-auto bg-slate-600">
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

                  <div className="scrollbar flex size-full flex-col overflow-y-scroll bg-gray-800 p-4">
                    <ChatWindow
                      messages={messages.map((message) => ({
                        text: message.content,
                        timestamp: message.timestamp
                          ? new Date(
                              message.timestamp.seconds * 1000,
                            ).toLocaleString()
                          : "N/A",
                        isSentByCurrentUser: message.senderId === user?.uid,
                      }))}
                    />
                    {gig && (
                      <div className="sticky bottom-0 mt-4 flex justify-center">
                        <ChatCard
                          gig={gig}
                          application={application}
                          userId={user?.uid || ""}
                          db={db} // Pass Firestore instance
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
                    onMessageSent={handleMessageSent} // Notify parent after message is sent
                  />
                </>
              ) : (
                <div className="flex items-center justify-center text-gray-500">
                  No chat selected
                </div>
              )}
            </div>
          </div>

          {isGigDetailsOpen && gig && user && (
            <GigDetailsModal
              gig={gig}
              lister={chatPartner || null}
              onClose={() => setIsGigDetailsOpen(false)}
              currentUserId={user.uid}
              currentUser={user as User} 
              onGoToMyGigs={handleGoToMyGigs}
            />
          )}

        </>
      ) : (
        <Loading />
      )}
    </div>
  );
}

export default ChatPage;









