import { useState, useEffect } from "react";
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
import { query, where, getDocs, doc, getDoc } from "firebase/firestore";
import Loading from "@/components/Loading";
import FilterButton from "@/components/Buttons/FilterButton";
import { useSearchParams } from "react-router-dom";

const STATUS_ORDER: Gig["status"][] = [
  "open",
  "in-progress",
  "awaiting-confirmation",
  "completed",
];

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
  const [fullUser, setFullUser] = useState<User | null>(null);
  const [searchParams, setSearchParams] = useSearchParams();

  const fetchUserGigs = async () => {
    if (currUser) {
      try {
        setLoadingGigs(true);
        const userDocRef = doc(usersRef(db), currUser.uid);
        const userSnapshot = await getDoc(userDocRef);

        const userData = await userSnapshot.data();
        if (!userData) return;

        setFullUser(userData as User);

        const q = query(gigsRef(db), where("listerId", "==", currUser.uid));
        const querySnapshot = await getDocs(q);

        const gigsWithListersData = querySnapshot.docs
          .map((doc) => ({
            gig: { ...doc.data(), gigId: doc.id } as Gig,
            lister: currUser as unknown as User,
          }))
          .filter((item) => item.gig.status !== "deleted"); // Exclude deleted gigs

        const sortedGigs = gigsWithListersData.sort(
          (a, b) =>
            STATUS_ORDER.indexOf(a.gig.status) -
            STATUS_ORDER.indexOf(b.gig.status),
        );

        setGigsWithListers(sortedGigs);
        setFilteredGigs(sortedGigs);
        const gigIdParam = searchParams.get("gigId");
        if (sortedGigs.length > 0) {
          if (gigIdParam) {
            const foundGig = sortedGigs.find(
              (gig) => gig.gig.gigId === gigIdParam,
            );
            setSelectedGig(foundGig?.gig || null);
            setSearchParams({});
          } else {
            setSelectedGig(sortedGigs[0].gig);
          }
        }
      } catch (error) {
        console.error("Error fetching gigs:", error);
      } finally {
        setLoadingGigs(false);
      }
    }
  };

  useEffect(() => {
    fetchUserGigs();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currUser, db]);

  const fetchApplicantsForGig = async () => {
    if (selectedGig) {
      try {
        setLoadingApplicants(true);

        const q = query(
          applicationsRef(db),
          where("gigId", "==", selectedGig.gigId),
        );
        const applicationSnapshot = await getDocs(q);

        const userIds = applicationSnapshot.docs.map(
          (doc) => (doc.data() as Application).applicantId,
        );
        const uniqueUserIds = [...new Set(userIds)];

        const userSnapshots = await Promise.all(
          uniqueUserIds.map((userId) =>
            getDocs(query(usersRef(db), where("userId", "==", userId))),
          ),
        );

        const users = userSnapshots.flatMap((userSnapshot) =>
          userSnapshot.docs.map((userDoc) => userDoc.data() as User),
        );

        const uniqueUsers = Array.from(
          new Map(users.map((user) => [user.userId, user])).values(),
        );

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

  useEffect(() => {
    fetchApplicantsForGig();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [db, selectedGig]);

  const handleFilterChange = (status: string[]) => {
    const filtered = status.length
      ? gigsWithListers.filter((gigWithLister) =>
          status.includes(gigWithLister.gig.status),
        )
      : gigsWithListers;

    setFilteredGigs(filtered);

    if (filtered.length > 0) {
      setSelectedGig(filtered[0].gig);
    } else {
      setSelectedGig(null);
    }
  };

  if (loadingGigs) {
    return <Loading />;
  }

  return (
    <div className="flex h-screen space-x-6 p-4">
      <div className="h-full w-1/2 rounded-lg p-4">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-2xl font-bold text-primary">My Posted Gigs</h2>
          <FilterButton
            categories={STATUS_ORDER}
            onCategorySelect={handleFilterChange}
          />
        </div>
        <div className="scrollbar max-h-[95vh] overflow-y-scroll">
          <PostedGigList
            gigs={filteredGigs}
            onSelectGig={setSelectedGig}
            selectedGig={selectedGig}
          />
        </div>
      </div>

      <div className="scrollbar max-h-[95vh] w-1/2 overflow-y-scroll rounded-lg">
        {selectedGig ? (
          <>
            <GigDetails
              gig={selectedGig}
              user={fullUser}
              onChange={fetchUserGigs}
            />
            <div className="mt-4 mb-3 border-t border-primary/60 mx-2"></div>
            {loadingApplicants ? (
              <div className="flex items-center justify-center py-6">
                <div className="size-8 animate-spin rounded-full"></div>
              </div>
            ) : (
              <InterestedGigglers
                gig={selectedGig}
                users={applicants}
                onGigUpdate={fetchUserGigs}
              />
            )}
          </>
        ) : (
          <p className="text-center text-slate-500">No available gigs</p>
        )}
      </div>
    </div>
  );
}

export default MyPostedGigsView;
