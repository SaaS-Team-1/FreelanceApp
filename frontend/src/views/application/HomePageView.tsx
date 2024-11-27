import { HiSearch } from "react-icons/hi";
import { useState, useEffect } from "react";
import { collection, query, where, getDocs } from "firebase/firestore";
import { useUser, useFirestore } from "@/utils/reactfire";
import { Gig, User, Notification } from "@/utils/database/schema";
import { SearchBar } from "@/components/Common/SearchBar";
import NotificationList from "@/components/Notifications/NotificationsList";
import PostedGigListHome from "@/components/Gigs/PostedGigListHome";
import FilterButton from "@/components/Buttons/FilterButton"; // Assuming this component is imported

export default function OverviewView() {
  const { data: user } = useUser();
  const db = useFirestore();

  const [searchQuery, setSearchQuery] = useState(""); // State for the search bar content
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [openGigs, setOpenGigs] = useState<{ gig: Gig; lister: User }[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);

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

  const fetchOpenGigsAndCategories = async () => {
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
  };

  useEffect(() => {
    fetchNotifications();
  }, [user]);

  useEffect(() => {
    fetchOpenGigsAndCategories();
  }, [searchQuery, selectedCategories]); // Re-fetch gigs whenever the search query changes

  const handleSearchInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  const handleCategorySelect = (categories: string[]) => {
    setSelectedCategories(categories); // Update selected categories
  };

  return (
    <div className="flex flex-1 flex-col space-y-6 p-6">
      {/* Top Section with Search and Notifications */}
      <div className="flex items-start justify-between space-x-6">
        {/* Left Column with Sidebar, Search, and Posted Gigs */}
        <div className="flex w-2/3 flex-col space-y-6">
          {/* Search and Tags Container */}
          <div className="flex flex-col items-center">
            {/* Search Bar and Filter Button */}
            <div className="flex w-full items-center justify-center p-4">
              <div className="relative flex w-full max-w-xl items-center">
                <HiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
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
                <div className="ml-4">
                  <FilterButton
                    categories={categories}
                    onCategorySelect={handleCategorySelect}
                  />
                </div>
              </div>
            </div>

            {/* Selected Tags */}
            <div className="mt-4 flex flex-wrap gap-2">
              {selectedCategories.map((category) => (
                <div
                  key={category}
                  className="rounded-full bg-gray-800 px-4 py-2 text-sm font-semibold text-white"
                >
                  {category}
                </div>
              ))}
            </div>

            {/* Gig List */}
            <div className="mt-4">
              <PostedGigListHome
                gigs={openGigs}
                enableSelection={true}
                showSeeMoreButton={true}
                userId={user?.uid}
                db={db}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Fixed Right Column for Notifications */}
      <div
        className="fixed right-0 flex h-screen w-1/4 flex-col space-y-6 p-6"
        style={{ bottom: "2px" }}
      >
        <NotificationList notifications={notifications} />

        <button className="flex max-w-sm items-center justify-center rounded-full bg-orange-500 py-3 text-sm font-semibold text-white">
          + Upload new gig
        </button>
      </div>

      <div className="pb-10"></div>
    </div>
  );
}
