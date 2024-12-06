import { useState, useEffect } from "react";
import { FaFilter } from "react-icons/fa";
import PostedGigList from "@/components/Gigs/MyPostedGigList";
import GigDetails from "@/components/Gigs/GigDetails";
import InterestedGigglers from "@/components/Gigs/InterestedGigglers";
import { Gig, User, Application } from "@/utils/database/schema";
import { useAuth, useFirestore } from "@/utils/reactfire";
import {
  applicationsRef,
  gigsRef,
  usersRef,
} from "@/utils/database/collections";
import { query, where, getDocs ,doc,getDoc} from "firebase/firestore";

function MyPostedGigsView() {
  const db = useFirestore();
  const auth = useAuth();
  const currUser = auth.currentUser;

  const [gigsWithListers, setGigsWithListers] = useState<
    { gig: Gig; lister: User }[]
  >([]);
  const [filteredGigs, setFilteredGigs] = useState<
    { gig: Gig; lister: User }[]
  >([]);
  const [selectedGig, setSelectedGig] = useState<Gig | null>(null);
  const [applicants, setApplicants] = useState<User[]>([]);
  const [loadingGigs, setLoadingGigs] = useState(true);
  const [loadingApplicants, setLoadingApplicants] = useState(false);
  const [filterStatus, setFilterStatus] = useState<string | "all">("all");
  const [isDropdownVisible, setIsDropdownVisible] = useState(false);
  const [fullUser, setFullUser] = useState<User | null>(null);

  const STATUS_ORDER: Gig["status"][] = [
    "open",
    "in-progress",
    "awaiting-confirmation",
    "completed",
  ];
   // Fetch full user data from the database
   const fetchUserData = async (userId: string, db: any): Promise<User | null> => {
    try {
      const userDocRef = doc(usersRef(db), userId);
      const userSnapshot = await getDoc(userDocRef);

      if (userSnapshot.exists()) {
        return userSnapshot.data() as User;
      } else {
        console.error("User data not found in database for userId:", userId);
        return null;
      }
    } catch (error) {
      console.error("Error fetching user data:", error);
      return null;
    }
  };

  useEffect(() => {
    const fetchUserGigs = async () => {
      if (currUser) {
        try {
          setLoadingGigs(true);
           // Fetch full user data to display profile of current user
           const userData = await fetchUserData(currUser.uid, db);
           setFullUser(userData);
           // 
          const q = query(gigsRef(db), where("listerId", "==", currUser.uid));
          const querySnapshot = await getDocs(q);

          const gigsWithListersData = querySnapshot.docs.map((doc) => ({
            gig: { ...doc.data(), gigId: doc.id } as Gig,
            lister: currUser as unknown as User,
          }));

          const sortedGigs = gigsWithListersData.sort(
            (a, b) =>
              STATUS_ORDER.indexOf(a.gig.status) -
              STATUS_ORDER.indexOf(b.gig.status),
          );

          setGigsWithListers(sortedGigs);
          setFilteredGigs(sortedGigs);
          console.log(sortedGigs)

          if (sortedGigs.length > 0) {
            setSelectedGig(sortedGigs[0].gig);
          }
        } catch (error) {
          console.error("Error fetching gigs:", error);
        } finally {
          setLoadingGigs(false);
        }
      }
    };

    fetchUserGigs();
  }, [currUser, db]);

  useEffect(() => {
    const fetchApplicantsForGig = async () => {
      if (selectedGig) {
        try {
          setLoadingApplicants(true);
  
          // Fetch applications for the gig
          const q = query(
            applicationsRef(db),
            where("gigId", "==", selectedGig.gigId)
          );
          const applicationSnapshot = await getDocs(q);
  
          // Extract and deduplicate applicant IDs
          const userIds = applicationSnapshot.docs.map(
            (doc) => (doc.data() as Application).applicantId
          );
          const uniqueUserIds = [...new Set(userIds)];
  
          // Fetch user details for unique IDs
          const userSnapshots = await Promise.all(
            uniqueUserIds.map((userId) =>
              getDocs(query(usersRef(db), where("userId", "==", userId)))
            )
          );
  
          // Map user documents to User objects and deduplicate
          const users = userSnapshots.flatMap((userSnapshot) =>
            userSnapshot.docs.map((userDoc) => userDoc.data() as User)
          );
          const uniqueUsers = Array.from(
            new Map(users.map((user) => [user.userId, user])).values()
          );
  
          // Update applicants state
          setApplicants(uniqueUsers);
        } catch (error) {
          console.error("Error fetching applicants:", error);
        } finally {
          setLoadingApplicants(false);
        }
      } else {
        setApplicants([]);
      }
    };
  
    fetchApplicantsForGig();
  }, [selectedGig, db]);
  

  const handleSelectGig = (gig: Gig) => {
    setSelectedGig(gig);
  };

  const handleFilterChange = (status: string | "all") => {
    setFilterStatus(status);
    setIsDropdownVisible(false);

    const filtered =
      status === "all"
        ? gigsWithListers
        : gigsWithListers.filter(
            (gigWithLister) => gigWithLister.gig.status === status,
          );

    setFilteredGigs(filtered);

    if (filtered.length > 0) {
      setSelectedGig(filtered[0].gig);
    } else {
      setSelectedGig(null);
    }
  };

  const handleGigUpdate = (updatedGig: Gig) => {
    const updatedGigs = gigsWithListers.map((item) =>
      item.gig.gigId === updatedGig.gigId ? { ...item, gig: updatedGig } : item,
    );

    const sortedUpdatedGigs = updatedGigs.sort(
      (a, b) =>
        STATUS_ORDER.indexOf(a.gig.status) - STATUS_ORDER.indexOf(b.gig.status),
    );

    setGigsWithListers(sortedUpdatedGigs);
    setFilteredGigs(
      filterStatus === "all"
        ? sortedUpdatedGigs
        : sortedUpdatedGigs.filter(
            (gigWithLister) => gigWithLister.gig.status === filterStatus,
          ),
    );

    setSelectedGig(updatedGig);
  };
  const handleGigDelete = (gigId: string) => {
    const remainingGigs = gigsWithListers.filter(
      (item) => item.gig.gigId !== gigId,
    );

    const sortedRemainingGigs = remainingGigs.sort(
      (a, b) =>
        STATUS_ORDER.indexOf(a.gig.status) - STATUS_ORDER.indexOf(b.gig.status),
    );

    setGigsWithListers(sortedRemainingGigs);
    setFilteredGigs(
      filterStatus === "all"
        ? sortedRemainingGigs
        : sortedRemainingGigs.filter(
            (gigWithLister) => gigWithLister.gig.status === filterStatus,
          ),
    );

    setSelectedGig(
      sortedRemainingGigs.length > 0 ? sortedRemainingGigs[0].gig : null,
    );
  };
  if (loadingGigs) {
    return <p>Loading your gigs...</p>;
  }

  return (
    <div className="flex h-[calc(100vh-4rem)] w-full space-x-6 p-4">
      <div className="scrollbar h-full w-1/2 overflow-y-scroll">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">
            My Posted Gigs
          </h2>
          <div className="relative">
            <button
              onClick={() => setIsDropdownVisible((prev) => !prev)}
              className="flex items-center justify-center rounded-full bg-gray-800 p-2 text-white transition-all hover:bg-gray-600"
            >
              <FaFilter />
            </button>

            {isDropdownVisible && (
              <div
                className="absolute right-0 z-50 mt-2 w-48 scale-100 rounded-md bg-gray-800 opacity-100 shadow-lg transition-transform"
                onMouseLeave={() => setIsDropdownVisible(false)}
              >
                <button
                  onClick={() => handleFilterChange("all")}
                  className="block w-full px-4 py-2 text-left text-white hover:bg-gray-700"
                >
                  All Gigs
                </button>
                {STATUS_ORDER.map((status) => (
                  <button
                    key={status}
                    onClick={() => handleFilterChange(status)}
                    className="block w-full px-4 py-2 text-left text-white hover:bg-gray-700"
                  >
                    {status.charAt(0).toUpperCase() + status.slice(1)} Gigs
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
        <PostedGigList
          gigs={filteredGigs}
          onSelectGig={handleSelectGig}
          selectedGig={selectedGig}
          enableSelection={true}
          showSeeMoreButton={false}
        />
      </div>

      <div className="scrollbar h-full w-1/2 overflow-y-scroll">
        <div className="h-full min-h-fit rounded-lg bg-gray-700 p-6 shadow-lg">
          {selectedGig ? (
            <>
              <GigDetails
                gig={selectedGig}
                user={fullUser} //current user with profile pic 
                onEditSave={handleGigUpdate}
                onDelete={handleGigDelete}
              />
              {loadingApplicants ? (
                <p className="text-gray-500">Loading interested gigglers...</p>
              ) : (
                <InterestedGigglers
                  gig={selectedGig}
                  users={applicants}
                  onGigUpdate={handleGigUpdate}
                />
              )}
            </>
          ) : (
            <p className="text-gray-500">No available gigs</p>
          )}
        </div>
      </div>
    </div>
  );
}

export default MyPostedGigsView;
