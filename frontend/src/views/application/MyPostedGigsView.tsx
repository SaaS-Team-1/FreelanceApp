import React, { useState, useEffect } from "react";
import PostedGigListHome from "@/components/Gigs/PostedGigListHome";
import GigDetails from "@/components/Gigs/GigDetails";
import InterestedGigglers from "@/components/Gigs/InterestedGigglers";
import { Gig, User, Application } from "@/utils/database/schema";
import { useAuth, useFirestore } from "@/utils/reactfire";
import { applicationsRef, gigsRef, usersRef } from "@/utils/database/collections";
import { query, where, getDocs } from "firebase/firestore";

function MyPostedGigsView() {
  const db = useFirestore();
  const auth = useAuth();
  const currUser = auth.currentUser;

  const [gigsWithListers, setGigsWithListers] = useState<{ gig: Gig; lister: User }[]>([]);
  const [selectedGig, setSelectedGig] = useState<Gig | null>(null);
  const [applicants, setApplicants] = useState<User[]>([]);
  const [loadingGigs, setLoadingGigs] = useState(true);
  const [loadingApplicants, setLoadingApplicants] = useState(false);

  // Custom order of statuses
  const STATUS_ORDER = ["open", "in-progress", "awaiting-confirmation", "completed"];

  // Fetch user's gigs
  useEffect(() => {
    const fetchUserGigs = async () => {
      if (currUser) {
        try {
          setLoadingGigs(true); // Start loading gigs
          const q = query(gigsRef(db), where("listerId", "==", currUser.uid));
          const querySnapshot = await getDocs(q);

          const gigsWithListersData = querySnapshot.docs.map((doc) => ({
            gig: { ...doc.data(), gigId: doc.id } as Gig, // Ensure gigId is set
            lister: currUser as unknown as User,
          }));

          // Sort gigs by status using STATUS_ORDER
          const sortedGigs = gigsWithListersData.sort(
            (a, b) => STATUS_ORDER.indexOf(a.gig.status) - STATUS_ORDER.indexOf(b.gig.status)
          );

          setGigsWithListers(sortedGigs);

          // Automatically select the first gig
          if (sortedGigs.length > 0) {
            setSelectedGig(sortedGigs[0].gig);
          }
        } catch (error) {
          console.error("Error fetching gigs:", error);
        } finally {
          setLoadingGigs(false); // Stop loading gigs
        }
      }
    };

    fetchUserGigs();
  }, [currUser, db]);

  // Fetch applicants for the selected gig
  useEffect(() => {
    const fetchApplicantsForGig = async () => {
      if (selectedGig) {
        try {
          setLoadingApplicants(true); // Start loading applicants
          const q = query(applicationsRef(db), where("gigId", "==", selectedGig.gigId));
          const applicationSnapshot = await getDocs(q);

          // Extract Applicant IDs
          const userIds = applicationSnapshot.docs.map((doc) => (doc.data() as Application).applicantId);

          // Fetch User Data for Each Applicant
          const userSnapshots = await Promise.all(
            userIds.map((userId) => getDocs(query(usersRef(db), where("userId", "==", userId))))
          );

          // Flatten and Extract User Data
          const users = userSnapshots.flatMap((userSnapshot) =>
            userSnapshot.docs.map((userDoc) => userDoc.data() as User)
          );

          setApplicants(users);
        } catch (error) {
          console.error("Error fetching applicants:", error);
        } finally {
          setLoadingApplicants(false); // Stop loading applicants
        }
      } else {
        setApplicants([]); // Clear applicants when no gig is selected
      }
    };

    fetchApplicantsForGig();
  }, [selectedGig, db]);

  // Handle gig selection
  const handleSelectGig = (gig: Gig) => {
    setSelectedGig(gig);
  };

  console.log("Gigs:", gigsWithListers);
  console.log("Selected Gig:", selectedGig);
  console.log("Applicants:", applicants);

  if (loadingGigs) {
    return <p>Loading your gigs...</p>;
  }

  return (
    <div className="flex space-x-6 p-4">
      {/* Left section with the list of gigs */}
      <div className="h-full w-3/5">
        <h2 className="mb-4 text-2xl font-semibold text-gray-900 dark:text-white">
          My Posted Gigs
        </h2>
        <PostedGigListHome
          gigs={gigsWithListers}
          onSelectGig={handleSelectGig}
          selectedGig={selectedGig}
          enableSelection={true}
          showSeeMoreButton={false}
        />
      </div>

      {/* Right section with gig details */}
      <div className="h-full w-4/5  ">
        <div className="rounded-lg p-6 rounded-lg bg-gray-700 p-6 shadow-lg">
          {selectedGig ? (
            <>
              <GigDetails
                gig={selectedGig}
                user={currUser as unknown as User}
                onEditSave={() => console.log("Edit Save")}
                onDelete={() => console.log("Delete Gig")}
              />
              {loadingApplicants ? (
                <p className="text-gray-500">Loading interested gigglers...</p>
              ) : (
                <InterestedGigglers
                  gig={selectedGig}
                  users={applicants}
                />
              )}
            </>
          ) : (
            <p className="text-gray-500">Select a gig to see the details</p>
          )}
        </div>
      </div>
    </div>
  );
}

export default MyPostedGigsView;
