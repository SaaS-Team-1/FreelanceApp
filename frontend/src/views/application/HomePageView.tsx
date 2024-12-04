import { HiSearch } from "react-icons/hi";
import { useState, useEffect } from "react";
import { collection, query, where, getDocs } from "firebase/firestore";
import { useUser, useFirestore } from "@/utils/reactfire";
import { Gig, User, Notification } from "@/utils/database/schema";
import NotificationList from "@/components/Notifications/NotificationsList";
import PostedGigListHome from "@/components/Gigs/PostedGigListHome";
import FilterButton from "@/components/Buttons/FilterButton"; // Assuming this component is imported
import MyPostedGigListCompressed from "@/components/Gigs/MyPostedGigListCompressed";
import Loading from "@/components/Loading";
import CreateGigButton from "@/components/Gigs/CreateGigButton";

export default function OverviewView() {
  const { data: user } = useUser();
  const db = useFirestore();

  const [searchQuery, setSearchQuery] = useState(""); // State for the search bar content
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [openGigs, setOpenGigs] = useState<{ gig: Gig; lister: User }[]>([]);
  const [openGigsLoading, setOpenGigsLoading] = useState(true);
  const [categories, setCategories] = useState<string[]>([]);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [myPostedGigs, setMyPostedGigs] = useState<Gig[]>([]);
  const [extendedUser, setExtendedUser] = useState<User | null>(null);

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

  const handleCreateSave = (newGig: any) => {
    console.log("New Gig Created:", newGig);
  };

  const fetchOpenGigsAndCategories = async () => {
    setOpenGigsLoading(true);
    try {
      const gigsRef = collection(db, "gigs");
      const gigsSnapshot = await getDocs(gigsRef);

      const usersRef = collection(db, "users");

      const fetchedGigs: Array<{ gig: Gig; lister: User }> = [];
      const categoriesSet = new Set<string>();

      for (const gigDoc of gigsSnapshot.docs) {
        const gigData = gigDoc.data();

        // Add category to the Set
        if (gigData.category) {
          categoriesSet.add(gigData.category);
        }

        // Check if the gig has the "open" status
        if (gigData.status !== "open") continue;

        if (gigData.listerId == user?.uid) continue;

        // If a search query exists, filter by title
        if (
          searchQuery &&
          !gigData.title.toLowerCase().includes(searchQuery.toLowerCase())
        ) {
          continue;
        }

        // If selected categories exist, filter by category
        if (
          selectedCategories.length > 0 &&
          !selectedCategories.includes(gigData.category)
        ) {
          continue;
        }

        // Fetch the lister details
        const userQuery = query(
          usersRef,
          where("userId", "==", gigData.listerId),
        );
        const userSnapshot = await getDocs(userQuery);
        const lister = userSnapshot.docs[0]?.data() as User;

        fetchedGigs.push({
          gig: { ...gigData, gigId: gigDoc.id } as Gig,
          lister,
        });
      }

      setOpenGigs(fetchedGigs);
      setCategories(Array.from(categoriesSet));
    } catch (error) {
      console.error("Error fetching gigs and categories: ", error);
    }
    setOpenGigsLoading(false);
  };

  const fetchMyPostedGigs = async () => {
    if (!user) return;

    try {
      const gigsRef = collection(db, "gigs");
      const q = query(gigsRef, where("listerId", "==", user.uid)); // Filter for user.uid
      const querySnapshot = await getDocs(q);

      const myGigs = querySnapshot.docs.map((doc) => ({
        ...doc.data(),
        gigId: doc.id, // Ensure gigId is included
      })) as Gig[]; // Cast the mapped objects as Gig[]

      setMyPostedGigs(myGigs);
    } catch (error) {
      console.error("Error fetching my posted gigs: ", error);
      return [];
    }
  };

  useEffect(() => {
    const fetchUserDetails = async () => {
      if (!user) return;

      try {
        const usersRef = collection(db, "users");
        const userQuery = query(usersRef, where("userId", "==", user.uid));
        const userSnapshot = await getDocs(userQuery);

        if (!userSnapshot.empty) {
          const userData = userSnapshot.docs[0].data() as User; // Cast Firestore data to User type
          setExtendedUser(userData);
        }
      } catch (error) {
        console.error("Error fetching extended user details: ", error);
      }
    };

    fetchUserDetails();
  }, [user]);

  useEffect(() => {
    fetchNotifications();
  }, [user]);

  useEffect(() => {
    fetchOpenGigsAndCategories();
  }, [searchQuery, selectedCategories]); // Re-fetch gigs whenever the search query changes

  useEffect(() => {
    fetchMyPostedGigs();
  }, [user]);

  const handleSearchInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  const handleCategorySelect = (categories: string[]) => {
    setSelectedCategories(categories); // Update selected categories
  };

  return (
    <div className="flex h-screen w-full flex-row p-10">
      {/* Fixed Left Column for Gigs */}
      <div className="mr-4 flex grow flex-col items-center space-y-4 pb-10">
        {/* Filters */}
        <div className="flex w-full flex-col items-center">
          <div className="flex items-center justify-center p-4 lg:w-7/12">
            <div className="w-full">
              <HiSearch className="absolute ml-4 mt-3 text-2xl text-gray-400" />
              <input
                type="text"
                placeholder="Search for specific Gigs"
                className="w-full rounded-md border border-gray-300 py-3 pl-12 pr-4 shadow-sm focus:outline-none"
                value={searchQuery}
                onChange={handleSearchInput}
                style={{
                  height: "48px",
                  backgroundColor: "white",
                  fontFamily: "'Inter', sans-serif",
                }}
              />
            </div>
            <div className="ml-4">
              <FilterButton
                categories={categories}
                onCategorySelect={handleCategorySelect}
              />
            </div>
          </div>

          <div className="flex min-h-9 flex-wrap gap-2">
            {selectedCategories.map((category) => (
              <div
                key={category}
                className="rounded-full bg-gray-800 px-4 py-2 text-sm font-semibold text-white"
              >
                {category}
              </div>
            ))}
          </div>
        </div>

        {!openGigsLoading ? (
          <div className="scrollbar h-fit overflow-y-scroll">
            <PostedGigListHome
              gigs={openGigs}
              enableSelection={true}
              showSeeMoreButton={true}
              userId={user?.uid}
              db={db}
            />
          </div>
        ) : (
          <Loading />
        )}
      </div>

      {/* Fixed Right Column for Notifications */}
      <div className="flex h-screen min-w-fit shrink flex-col space-y-4">
        <NotificationList notifications={notifications} />

        {extendedUser && (
          <MyPostedGigListCompressed gigs={myPostedGigs} user={extendedUser} />
        )}
        <CreateGigButton onCreateSave={handleCreateSave} />
      </div>
    </div>
  );
}
