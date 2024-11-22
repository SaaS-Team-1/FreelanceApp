import React, { useState, useEffect } from "react";
import PostedGigListHome from "@/components/Gigs/PostedGigListHome";
import GigDetails from "@/components/Gigs/GigDetails";
import InterestedGigglers from "@/components/Gigs/InterestedGigglers"; // Import the new component
import { Gig, User } from "@/utils/database/schema";
import { useAuth, useFirestore } from "@/utils/reactfire";
import {getUserListedGigs} from "@/utils/database/queries"
import { setCurrentScreen } from "firebase/analytics";
import { gigsRef } from "@/utils/database/collections";
import { query, where, orderBy, getDocs } from "firebase/firestore";


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
              {/* <GigDetails
                gig={selectedGig}
                user= {currUser} // Find the lister by userId
                onEditSave={function (): void {
                  throw new Error("Function not implemented.");
                } } onDelete={function (): void {
                  throw new Error("Function not implemented.");
                } }              /> */}
              {/* Display interested gigglers */}
              {/* <InterestedGigglers
                gig={selectedGig}
                users={users} // Pass the full list of users
              /> */}
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