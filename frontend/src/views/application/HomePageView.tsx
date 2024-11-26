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
  const [openGigs, setGigs] = useState<{ gig: Gig; lister: User }[]>([]);
  const [selectedGig, setSelectedGig] = useState<Gig>();
  const db = useFirestore();

  useEffect(() => {
    const fetchNotifications = async () => {
      if (!user) return;

      try {
        const notificationsRef = collection(db, "notifications");
        const q = query(notificationsRef, where("userId", "==", user.uid));
        const querySnapshot = await getDocs(q);

        const notificationsList: Notification[] = querySnapshot.docs.map(
          (doc) => {
            const data = doc.data();
            return {
              notificationId: data.notificationId,
              userId: data.userId,
              notificationMessage: data.notificationMessage,
              createdAt: data.createdAt.toDate(), // Assuming Firestore timestamp
            } as Notification;
          },
        );

        setNotifications(notificationsList);
      } catch (error) {
        console.error("Error fetching notifications: ", error);
      }
    };

    fetchNotifications();
  }, [user]);

  useEffect(() => {
    const fetchAvailableGigs = async () => {
      try {
        const gigsRef = collection(db, "gigs");
        const q = query(gigsRef, where("selectedApplicantId", "==", ""));
        const querySnapshot = await getDocs(q);

        const usersRef = collection(db, "users");

        const openGigs: Array<{ gig: Gig; lister: User }> = [];

        for (const doc of querySnapshot.docs) {
          const gigData = doc.data();

          const userQuery = query(
            usersRef,
            where("userId", "==", gigData.listerId),
          );
          const userSnapshot = await getDocs(userQuery);

          const lister = userSnapshot.docs[0].data() as User;

          openGigs.push({
            gig: { ...gigData, gigId: doc.id } as Gig,
            lister: lister,
          });
        }

        setGigs(openGigs);
      } catch (error) {
        console.error("Error fetching gigs: ", error);
      }
    };

    fetchAvailableGigs();
  }, []);

  const handleSelectGig = (gig: Gig) => {
    setSelectedGig(gig);
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
            <div className="mt-4">
              <PostedGigListHome
                gigs={openGigs}
                onSelectGig={handleSelectGig}
                selectedGig={selectedGig}
                enableSelection={true}
                showSeeMoreButton={true}
                userId={user?.uid}
                db={db}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Fixed Right Column for Notifications and Posted Gigs */}
      <div
        className="fixed right-0 flex h-screen w-1/4 flex-col space-y-6 p-6"
        style={{ bottom: "2px" }}
      >
        <NotificationList notifications={notifications} />

        <button className="flex w-full items-center justify-center rounded-full bg-orange-500 py-3 text-sm font-semibold text-white">
          + Upload new gig
        </button>
      </div>

      <div className="pb-10"></div>
    </div>
  );
}
