/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useEffect } from "react";
import { useFirestore, useUser } from "@/utils/reactfire";
import {
  query,
  where,
  orderBy,
  doc,
  getDoc,
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
import GigDetailModal from "@/components/Gigs/GigDetailModal";

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

  const [hasInitializedChat, setHasInitializedChat] = useState(false);

  useEffect(() => {
    if (user) {
      setChatsLoading(true);

      const listerChatsQuery = query(
        chatsRef(db),
        where("listerId", "==", user.uid),
      );
      const applicantChatsQuery = query(
        chatsRef(db),
        where("applicantId", "==", user.uid),
      );

      // Combine real-time listeners for both lister and applicant chats
      const unsubscribeLister = onSnapshot(listerChatsQuery, (snapshot) => {
        const listerChats = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        })) as ExtendedChat[];

        updateChatsState(listerChats);
      });

      const unsubscribeApplicant = onSnapshot(
        applicantChatsQuery,
        (snapshot) => {
          const applicantChats = snapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
          })) as ExtendedChat[];

          updateChatsState(applicantChats);
        },
      );

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
          }),
        );

        setChats((prevChats) => {
          const updatedChatsMap = new Map<string, ExtendedChat>(
            prevChats.map((chat) => [chat.chatId, chat]),
          );

          enrichedChats.forEach((chat) => {
            updatedChatsMap.set(chat.chatId, chat);
          });

          const updatedChats = Array.from(updatedChatsMap.values()).sort(
            (a, b) => {
              const aTime = a.lastUpdate?.seconds || 0;
              const bTime = b.lastUpdate?.seconds || 0;
              return bTime - aTime;
            },
          );

          // Select the top chat only if it hasn't been initialized
          if (!hasInitializedChat && updatedChats.length > 0) {
            setSelectedChat(updatedChats[0]);
            setHasInitializedChat(true);
          }

          return updatedChats;
        });

        setChatsLoading(false);
      };

      return () => {
        unsubscribeLister();
        unsubscribeApplicant();
      };
    }
  }, [user, db, hasInitializedChat]);

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
      if (!selectedChat.chatId) {
        console.error("Invalid chat data: Missing chatId");
        return;
      }

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
            timestamp: data.timestamp || null,
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
  if (!user) return;
  return (
    <div id="chat-page" className="flex h-screen w-full justify-center rounded-xl p-4">
      {!chatsLoading ? (
        <>
          <div id="chat-list" className="flex w-full justify-center rounded-xl bg-surface-container">
            <div id="active-chats" className="scrollbar w-3/5 overflow-y-auto border-surface-dim border-r">
              <h2 className="p-4 text-lg font-bold">Active Chats</h2>
              {chats.map((chat) => (
                <div
                  key={chat.chatId}
                  onClick={() => setSelectedChat(chat)}
                  className={`flex cursor-pointer justify-between border-y border-surface-dim p-4 ${
                    chat.chatId === selectedChat?.chatId
                      ? "bg-primary text-on-primary"
                      : "bg-surface-container text-on-surface"
                  } hover:opacity-70`}
                >
                  <div>
                    <p className="truncate font-bold">{chat.partnerName}</p>
                    <p className="truncate text-sm">{chat.gigTitle}</p>
                  </div>
                  <p className="text-sm">{formatTimestamp(chat.lastUpdate)}</p>
                </div>
              ))}
            </div>

            <div id="chat-window" className="flex size-full w-full flex-col overflow-y-auto">
              {selectedChat ? (
                <>
                  <ChatHeader
                    user={user}
                    chatPartner={chatPartner}
                    status={
                      user?.uid === selectedChat?.listerId
                        ? gig?.status || "Unknown"
                        : application?.status || "Unknown"
                    }
                    gig={gig}
                    isLister={user?.uid === selectedChat?.listerId}
                    onSeeGigDetails={() => setIsGigDetailsOpen(true)}
                  />

                  <div id="messages" className="scrollbar flex size-full w-full flex-col overflow-y-scroll p-4">
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
                      <div id="chat-card" className="sticky bottom-0 mt-4 flex justify-center">
                        <ChatCard
                          gig={gig}
                          application={application}
                          userId={user?.uid || ""}
                          db={db} // Pass Firestore instance
                        />
                      </div>
                    )}
                  </div>
<div id="message-input">
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
</div>
                  
                </>
              ) : (
                <div id="no-chat-selected" className="flex items-center justify-center text-gray-500">
                  No chat selected
                </div>
              )}
            </div>
          </div>

          {gig && user && (
            <GigDetailModal
              gig={gig}
              lister={chatPartner || null}
              onClose={() => setIsGigDetailsOpen(false)}
              userId={user.uid}
              isOpen={isGigDetailsOpen}
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