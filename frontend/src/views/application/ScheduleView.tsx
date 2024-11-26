import React, { useEffect, useState } from "react";
import PostedGigListHome from "@/components/Gigs/PostedGigListHome";
import GigDetails from "@/components/Gigs/GigDetails";
import { Gig, User } from "@/utils/database/schema";
import { query, Timestamp, where, getDocs, doc, getDoc } from "firebase/firestore";
import CustomButton from "@/components/Buttons/CustomButton";
import { useAuth, useFirestore } from "@/utils/reactfire";
import { applicationsRef, gigsRef, usersRef } from "@/utils/database/collections";

function ScheduleView() {
  const db = useFirestore();
  const auth = useAuth();
  const currUser = auth.currentUser;

  const [selectedGig, setSelectedGig] = useState<Gig | null>(null);
  const [selectedLister, setSelectedLister] = useState<User | null>(null);
  const [isGigDetailsOpen, setIsGigDetailsOpen] = useState(false);
  const [inProgressGigs, setInProgressGigs] = useState<{ gig: Gig; lister: User }[]>([]);
  const [pendingGigs, setPendingGigs] = useState<{ gig: Gig; lister: User }[]>([]);

  const processGigData = (gigData: any, docId: string): Gig => {
    return {
      ...gigData,
      gigId: docId,
      dueDate: gigData.dueDate instanceof Timestamp 
        ? gigData.dueDate.toDate() 
        : new Date(gigData.dueDate),
      createdAt: gigData.createdAt instanceof Timestamp 
        ? gigData.createdAt.toDate() 
        : new Date(gigData.createdAt)
    } as Gig;
  };

  useEffect(() => {
    const fetchInProgressGigs = async () => {
      if (currUser) {
        try {
          const q = query(
            gigsRef(db),
            where("selectedApplicantId", "==", currUser.uid),
            where("status", "==", "in-progress")
          );
          const querySnapshot = await getDocs(q);

          const gigsData = querySnapshot.docs.map((doc) => ({
            gig: processGigData(doc.data(), doc.id),
            lister: currUser as unknown as User,
          }));
          setInProgressGigs(gigsData);
        } catch (error) {
          console.error("Error fetching in-progress gigs:", error);
        }
      }
    };

    fetchInProgressGigs();
  }, [currUser, db]);

  useEffect(() => {
    const fetchAppliedGigs = async () => {
      if (currUser) {
        try {
          // First, get all applications for the current user
          const applicationsQuery = query(
            applicationsRef(db),
            where("applicantId", "==", currUser.uid),
            where("status", "==", "pending") // Add this if you have a status field
          );
          const applicationSnapshot = await getDocs(applicationsQuery);

          // Get all the gigIds from the applications
          const gigIds = applicationSnapshot.docs.map(doc => {
            const data = doc.data();
            return data.gigId;
          });

          if (gigIds.length === 0) {
            setPendingGigs([]);
            return;
          }

          // Get all gigs documents directly using their IDs
          const gigPromises = gigIds.map(async (gigId) => {
            try {
              const gigDocRef = doc(gigsRef(db), gigId);
              const gigDoc = await getDoc(gigDocRef);
              
              if (gigDoc.exists()) {
                const gigData = gigDoc.data();
                // Get the lister's data
                const listerDoc = await getDoc(doc(usersRef(db), gigData.listerId));
                const listerData = listerDoc.exists() ? listerDoc.data() as User : null;
                
                return {
                  gig: processGigData(gigData, gigId),
                  lister: listerData || currUser as unknown as User,
                };
              }
              return null;
            } catch (error) {
              console.error(`Error fetching gig ${gigId}:`, error);
              return null;
            }
          });

          const gigsData = (await Promise.all(gigPromises)).filter((item): item is { gig: Gig; lister: User } => item !== null);
          setPendingGigs(gigsData);
          
        } catch (error) {
          console.error("Error fetching applied gigs:", error);
        }
      }
    };

    fetchAppliedGigs();
  }, [currUser, db]);

  // Rest of the component remains the same...
  
  useEffect(() => {
    const fetchListedUser = async () => {
      if (selectedGig?.listerId) {
        try {
          const userDoc = await getDoc(doc(usersRef(db), selectedGig.listerId));
          
          if (userDoc.exists()) {
            const lister = userDoc.data() as User;
            setSelectedLister(lister);
          } else {
            console.log("Lister not found.");
            setSelectedLister(null);
          }
        } catch (error) {
          console.error("Error fetching listed user:", error);
          setSelectedLister(null);
        }
      }
    };
  
    fetchListedUser();
  }, [selectedGig, db]);

  const handleSeeMoreClick = (gig: Gig) => {
    setSelectedGig(gig);
    setIsGigDetailsOpen(true);
  };

  const handleCloseGigDetails = () => {
    setSelectedGig(null);
    setIsGigDetailsOpen(false);
  };

  return (
    <div className="flex gap-8 p-10 text-white">
      <div className="flex-1 rounded-lg bg-gray-800 p-6 shadow-lg">
        <h1 className="mb-3 text-xl font-bold">Scheduled Gigs</h1>
        <PostedGigListHome
          gigs={inProgressGigs}
          showDateWithLine={true}
          showCompletedButton={true}
          showSeeMoreButton={true}
          showChatIcon={true}
          onSeeMoreClick={handleSeeMoreClick}
        />
      </div>

      <div className="flex-1 rounded-lg bg-gray-800 p-6 shadow-lg">
        <h1 className="mb-3 text-xl font-bold">Pending Gigs</h1>
        <PostedGigListHome
          gigs={pendingGigs}
          showDateWithLine={true}
          showUndoButton={true}
          onSeeMoreClick={handleSeeMoreClick}
        />
      </div>

      {selectedGig && isGigDetailsOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm">
          <div className="w-[800px] rounded-lg bg-gray-900 p-6 shadow-lg">
            <GigDetails
              gig={selectedGig}
              user={selectedLister}
              onEditSave={(updatedGig) => {
                console.log("Gig updated:", updatedGig);
                setIsGigDetailsOpen(false);
              }}
              onDelete={() => {
                console.log("Gig deleted:", selectedGig.gigId);
                setIsGigDetailsOpen(false);
              }}
              showEdit={false}
              showDelete={false}
            />
            <div className="mt-4 flex justify-end">
              <CustomButton
                label="Close"
                onClick={handleCloseGigDetails}
                color="red"
                textColor="black"
                size="medium"
                rounded={true}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default ScheduleView;