import { HiSearch } from "react-icons/hi";
import { useState, useEffect } from "react";
import {
  collection,
  query,
  where,
  getDocs,
  orderBy,
  updateDoc,
  Timestamp,
} from "firebase/firestore";
import { useUser, useFirestore } from "@/utils/reactfire";
import { Gig, User, Notification } from "@/utils/database/schema";
import NotificationList from "@/components/Notifications/NotificationsList";
import PostedGigListHome from "@/components/Gigs/PostedGigListHome";
import FilterButton from "@/components/Buttons/FilterButton"; // Assuming this component is imported
import MyPostedGigListCompressed from "@/components/Gigs/MyPostedGigListCompressed";
import Loading from "@/components/Loading";
import CreateGigButton from "@/components/Gigs/CreateGigButton";
import StreakModal from "@/components/Common/StreakModal";
import { Badge } from "flowbite-react";
import { FaCirclePlus } from "react-icons/fa6";

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
  const [openLoginStreak, setOpenLogStr] = useState(false);
  const [loginStreak, setLogStr] = useState(1);

  const fetchNotifications = async () => {
    if (!user) return;

    try {
      const notificationsRef = collection(db, "notifications");
      const q = query(
        notificationsRef,
        where("userId", "==", user.uid),
        orderBy("createdAt", "desc"),
      );
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
      const q = query(gigsRef, where("listerId", "==", user.uid));
      const querySnapshot = await getDocs(q);

      const myGigs = querySnapshot.docs
        .map((doc) => ({
          ...(doc.data() as Gig),
          gigId: doc.id,
        }))
        .filter((gig) => gig.status !== "deleted") as Gig[];

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
        const now = Timestamp.now(); // Firestore Timestamp for the current time
        const usersRef = collection(db, "users");
        const userQuery = query(usersRef, where("userId", "==", user.uid));
        const userSnapshot = await getDocs(userQuery);

        if (!userSnapshot.empty) {
          const userDoc = userSnapshot.docs[0]; // Get the first document
          const userDocRef = userDoc.ref;
          const userData = userDoc.data() as User; // Cast Firestore data to User type
          setExtendedUser(userData);

          // Convert Firestore Timestamp to JavaScript Date for comparison
          const lastActivityDate = userData.lastActivity.toDate(); // Assuming lastActivity is a Firestore Timestamp
          const day1 = new Date(
            lastActivityDate.getFullYear(),
            lastActivityDate.getMonth(),
            lastActivityDate.getDate(),
          );
          const nowDate = now.toDate(); // Convert Firestore Timestamp to JavaScript Date
          const day2 = new Date(
            nowDate.getFullYear(),
            nowDate.getMonth(),
            nowDate.getDate(),
          );

          const timeDifference = day2.getTime() - day1.getTime();
          const differenceInDays = timeDifference / (1000 * 60 * 60 * 24);

          if (differenceInDays === 1) {
            const loginStreak = userData.loginStreak;
            await updateDoc(userDocRef, {
              lastActivity: now,
              loginStreak: loginStreak + 1,
            });
            setOpenLogStr(true);
            setLogStr(loginStreak + 1);
          } else if (differenceInDays > 1) {
            await updateDoc(userDocRef, { lastActivity: now, loginStreak: 1 });
            setOpenLogStr(true);
            setLogStr(1);
          }
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
    <div className="mt-10 flex h-screen w-full flex-row justify-center">
      {/* Fixed Left Column for Gigs */}
      <div className="mx-4 flex min-w-[40vw] flex-col items-center md:mx-10 xl:min-w-10 xl:max-w-[40vw]">
        {/* Filters */}
        <div className="flex w-full flex-col items-center">
          <div className="flex w-full items-center justify-center">
            <form className="mx-auto w-full">
              <div className="relative">
                <div className="pointer-events-none absolute inset-y-0 start-0 flex items-center ps-3">
                  <HiSearch
                    className="size-6 text-primary"
                    aria-hidden="true"
                  ></HiSearch>
                </div>
                <input
                  type="text"
                  placeholder="Search for specific Gigs"
                  className="block w-full rounded-lg border-0 bg-surface-container p-4 ps-10 text-sm text-primary ring-0 placeholder:text-primary/90 focus:border-0 focus:ring-0"
                  value={searchQuery}
                  onChange={handleSearchInput}
                />
              </div>
            </form>

            <div className="ml-3 mt-1">
              <FilterButton
                categories={categories}
                onCategorySelect={handleCategorySelect}
              />
            </div>
          </div>

          <div className="flex w-full flex-wrap items-center justify-center space-x-2">
            {selectedCategories.length ? (
              selectedCategories.map((category) => (
                <Badge
                  key={category}
                  size="xs"
                  color="surface-container"
                  className="mt-2"
                >
                  {category}
                </Badge>
              ))
            ) : (
              <Badge
                key={"All"}
                size="xs"
                color="surface-container"
                className="mt-2"
              >
                All Selected
              </Badge>
            )}
          </div>
        </div>

        {!openGigsLoading ? (
          <div className="scrollbar h-fit overflow-y-scroll pb-10 sm:pt-2 ">
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

        <StreakModal
          openModal={openLoginStreak}
          setOpenModal={setOpenLogStr}
          loginStreak={loginStreak}
        ></StreakModal>
      </div>

      {/* Fixed Right Column for Notifications */}
      <div className="mr-10 hidden h-screen min-w-fit flex-col space-y-4 lg:visible lg:flex">
        <NotificationList notifications={notifications} />

        {extendedUser && (
          <MyPostedGigListCompressed gigs={myPostedGigs} user={extendedUser} />
        )}
        <CreateGigButton color="primary">
          <span className="text-nowrap text-xl font-bold text-on-primary flex">
          <FaCirclePlus className="text-on-primary mt-1 mr-2" />

            Create A New Gig{" "}
          </span>
        </CreateGigButton>
      </div>
    </div>
  );
}
