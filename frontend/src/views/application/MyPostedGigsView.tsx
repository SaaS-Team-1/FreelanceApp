import React, { useState, useEffect } from "react";
import PostedGigListHome from "@/components/Gigs/PostedGigListHome";
import GigDetails from "@/components/Gigs/GigDetails";
import InterestedGigglers from "@/components/Gigs/InterestedGigglers"; // Import the new component
import { Gig, User, Application } from "@/utils/database/schema";
import { useAuth, useFirestore } from "@/utils/reactfire";
import {getUserListedGigs} from "@/utils/database/queries"
import { setCurrentScreen } from "firebase/analytics";
import { applicationsRef, gigsRef, usersRef } from "@/utils/database/collections";
import { query, where, orderBy, getDocs, doc } from "firebase/firestore";


function MyPostedGigsView() {
  const db = useFirestore();
  const auth = useAuth();
  const currUser = auth.currentUser;
  const [gigsWithListers, setGigsWithListers] = useState<{ gig: Gig; lister: User }[]>([]);

  useEffect(() => {
    const fetchUserGigs = async () => {
      if (currUser) {
        const q = query(gigsRef(db), where("listerId", "==", currUser.uid));
        const querySnapshot = await getDocs(q);

        const gigsWithListersData = querySnapshot.docs.map(doc => ({
          gig: doc.data() as Gig,
          lister: currUser as unknown as User
        }));

        setGigsWithListers(gigsWithListersData);
      }
    };

    fetchUserGigs();
  }, []);

  const [currentUserDetails, setCurrentUserDetails] = useState<User | null>(null);

useEffect(() => {
  const fetchCurrentUserDetails = async () => {
    if (currUser) {
      const q = query(usersRef(db), where("userId", "==", currUser.uid)); // Replace usersRef with your collection reference for users
      const userSnap = (await getDocs(q));

      const currentUserDetails = userSnap.docs.map(doc => ({
        user: doc.data() as User
      }))
    }
  };

  fetchCurrentUserDetails();
}, []);

const [applicants, setApplicants] = useState<User[]>([]);

useEffect(() => {
  const fetchApplicantsForGig = async () => {
    if (selectedGig) {
      const q = query(applicationsRef(db), where("gigId", "==", selectedGig.gigId));
      const querySnapshot = await getDocs(q);

      // Get applicant IDs from applications
      const userIds = querySnapshot.docs.map(doc => (doc.data() as Application).applicantId);

      // Fetch user details for each userId using queries
      const userSnapshots = await Promise.all(
        userIds.map(userId => getDocs(query(usersRef(db), where("userId", "==", userId))))
      );

      // Flatten and map data from each QuerySnapshot
      const users = userSnapshots.flatMap(userSnapshot =>
        userSnapshot.docs.map(userDoc => userDoc.data() as User)
      );

      setApplicants(users);
    }
  };

  fetchApplicantsForGig();
}, []);


  const [selectedGig, setSelectedGig] = useState<Gig | null>(gigsWithListers[0]?.gig || null);

  const handleSelectGig = (gig: Gig) => {
    setSelectedGig(gig);
  };


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
          showSeeMoreButton={false} // Toggle this prop to show/hide the button
        />
      </div>

      {/* Right section with gig details */}
      <div className="h-full w-3/5">
        <div className="rounded-lg p-6 ">
          {selectedGig ? (
            <>
              { <GigDetails
                gig = {selectedGig}
                user = {currentUserDetails} // Find the lister by userId
                onEditSave={function (): void {
                  throw new Error("Function not implemented.");
                } } onDelete={function (): void {
                  throw new Error("Function not implemented.");
                } }              />}
              {/* Display interested gigglers */}
               { <InterestedGigglers
                gig={selectedGig}
                users={applicants} // Pass the full list of users
              /> }
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