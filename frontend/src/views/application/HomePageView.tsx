import { SearchBar } from "@/components/Common/SearchBar";
import NotificationList from "@/components/Notifications/NotificationsList";
import MyPostedGigListCompressed from "@/components/Gigs/MyPostedGigListCompressed";
import PostedGigListHome from "@/components/Gigs/PostedGigListHome";
import { collection, query, where, getDocs } from "firebase/firestore";
import { Timestamp } from "firebase/firestore";
import { Gig, User, Notification } from "@/utils/database/schema";
import { useUser, useFirestore } from "@/utils/reactfire";
import { useEffect, useState } from "react";

export default function OverviewView() {
  const { data: user } = useUser();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const db = useFirestore();

  useEffect(() => {
    const fetchNotifications = async () => {
      if (!user) return; // Ensure the user is authenticated

      try {
        const notificationsRef = collection(db, "notifications");
        const q = query(notificationsRef, where("userId", "==", user.uid));
        const querySnapshot = await getDocs(q);

        // Explicitly map and cast documents to Notification type
        const notificationsList: Notification[] = querySnapshot.docs.map((doc) => {
          const data = doc.data();
          return {
            notificationId: data.notificationId,
            userId: data.userId,
            notificationMessage: data.notificationMessage,
            createdAt: data.createdAt.toDate(), // Assuming Firestore timestamp
          } as Notification;
        });

        setNotifications(notificationsList);
      } catch (error) {
        console.error("Error fetching notifications: ", error);
      }
    };

    fetchNotifications();
  }, [user]);

  const userInfo: User = {
    email: "amina.agile@example.com",
    displayName: "Amina Agile",
    profile: {
      bio: "Computer Science Student in Leuven City.",
      credits: 100,
      picture: "",
      location: "Leuven",
    },
    completedGigs: ["gig1", "gig2"],
    activeGigs: ["gig3"],
    listedGigs: ["gig4", "gig5"],
    averageRating: 4.5,
  };

  return (
    <div className="flex flex-1 flex-col space-y-6 p-6">
      {/* Top Section with Search and Notifications */}
      <div className="flex items-start justify-between space-x-6">
        {/* Left Column with Sidebar, Search, and Posted Gigs */}
        <div className="flex w-2/3 flex-col space-y-6">
          {/* Search and Tags Container */}
          <div className="flex flex-col items-center">
            <SearchBar />
            <div className="mt-4 flex space-x-4">
              <button className="rounded-full bg-gray-800 px-4 py-2 text-sm font-semibold text-white">
                Computer Science
              </button>
              <button className="rounded-full bg-gray-800 px-4 py-2 text-sm font-semibold text-white">
                Data Engineering
              </button>
              <button className="rounded-full bg-gray-800 px-4 py-2 text-sm font-semibold text-white">
                Machine Learning
              </button>
            </div>
          </div>
          {/* Main content section containing scrollable gigs */}
          {/* <PostedGigListHome gigs={gigs} showSeeMoreButton={true} /> */}
        </div>
      </div>

      {/* Fixed Right Column for Notifications and Posted Gigs */}
      <div
        className="fixed right-0 flex h-screen w-1/4 flex-col space-y-6 p-6"
        style={{ bottom: "2px" }}
      >
        <NotificationList notifications={notifications} />

        {/* My Posted Gigs List */}
        {/* <MyPostedGigListCompressed gigs={gigs} user={userInfo} /> */}

        <button className="flex w-full items-center justify-center rounded-full bg-orange-500 py-3 text-sm font-semibold text-white">
          + Upload new gig
        </button>
      </div>

      <div className="pb-10"></div>
    </div>
  );
}
