import React, { useEffect, useState, useRef } from "react";
import PostedGigListSmall from "@/components/Gigs/MyPostedGigListSmall";
import GigDetails from "@/components/Gigs/GigDetails";
import { Gig, User } from "@/utils/database/schema";
import {
  query,
  Timestamp,
  where,
  getDocs,
  doc,
  updateDoc,
  getDoc,
  deleteDoc,
  serverTimestamp,
} from "firebase/firestore";
import CustomButton from "@/components/Buttons/CustomButton";
import { useAuth, useFirestore } from "@/utils/reactfire";
import {
  applicationsRef,
  gigsRef,
  usersRef,
  chatsRef,
} from "@/utils/database/collections";
import { useCallback } from "react";
import { tr } from "@faker-js/faker";

function ScheduleView() {
  const db = useFirestore();
  const auth = useAuth();
  const currUser = auth.currentUser;

  const [selectedGig, setSelectedGig] = useState<Gig | null>(null);
  const [selectedLister, setSelectedLister] = useState<User | null>(null);
  const [isGigDetailsOpen, setIsGigDetailsOpen] = useState(false);

  const [inProgressGigs, setInProgressGigs] = useState<
    { gig: Gig; lister: User }[]
  >([]);
  const [pendingGigs, setPendingGigs] = useState<{ gig: Gig; lister: User }[]>(
    [],
  );
  const [awaitingApprovalGigs, setAwaitingApprovalGigs] = useState<
    { gig: Gig; lister: User }[]
  >([]);
  const [completedGigs, setCompletedGigs] = useState<
    { gig: Gig; lister: User }[]
  >([]);

  const processGigData = (gigData: any, docId: string): Gig => ({
    ...gigData,
    gigId: docId,
    dueDate:
      gigData.dueDate instanceof Timestamp
        ? gigData.dueDate.toDate()
        : new Date(gigData.dueDate),
    createdAt:
      gigData.createdAt instanceof Timestamp
        ? gigData.createdAt.toDate()
        : new Date(gigData.createdAt),
  });

  const fetchGigs = useCallback(async () => {
    if (currUser) {
      try {
        const inProgressQuery = query(
          gigsRef(db),
          where("selectedApplicantId", "==", currUser.uid),
          where("status", "==", "in-progress"),
        );
        const inProgressSnapshot = await getDocs(inProgressQuery);
        setInProgressGigs(
          inProgressSnapshot.docs.map((doc) => ({
            gig: processGigData(doc.data(), doc.id),
            lister: currUser as unknown as User,
          })),
        );

        const pendingQuery = query(
          applicationsRef(db),
          where("applicantId", "==", currUser.uid),
          where("status", "==", "pending"),
        );
        const pendingSnapshot = await getDocs(pendingQuery);
        const pendingGigIds = pendingSnapshot.docs.map(
          (doc) => doc.data().gigId,
        );
        const pendingGigsData = await Promise.all(
          pendingGigIds.map(async (gigId) => {
            const gigDoc = await getDoc(doc(gigsRef(db), gigId));
            if (gigDoc.exists()) {
              const gigData = gigDoc.data();
              if (gigData.status === "awaiting-confirmation" || gigData.status === "in-progress") {
                return null;
              }
              console.log(gigData)
              const listerDoc = await getDoc(
                doc(usersRef(db), gigData.listerId),
              );
              const listerData = listerDoc.exists()
                ? (listerDoc.data() as User)
                : null;
              return {
                gig: processGigData(gigData, gigId),
                lister: listerData || (currUser as unknown as User),
              };
            }
            return null;
          }),
        );
        
        setPendingGigs(
          Array.from(
            new Map(
              pendingGigsData
                .filter((item): item is { gig: Gig; lister: User } => item !== null)
                .map(item => [item.gig.gigId, item])
            ).values()
          )
         );

        const awaitingApprovalQuery = query(
          gigsRef(db),
          where("selectedApplicantId", "==", currUser.uid),
          where("status", "==", "awaiting-confirmation"),
        );
        const awaitingApprovalSnapshot = await getDocs(awaitingApprovalQuery);
        setAwaitingApprovalGigs(
          awaitingApprovalSnapshot.docs.map((doc) => ({
            gig: processGigData(doc.data(), doc.id),
            lister: currUser as unknown as User,
          })),
        );

        const completedQuery = query(
          gigsRef(db),
          where("selectedApplicantId", "==", currUser.uid),
          where("status", "==", "completed"),
        );
        
        const completedSnapshot = await getDocs(completedQuery);
        setCompletedGigs(
          completedSnapshot.docs.map((doc) => ({
            gig: processGigData(doc.data(), doc.id),
            lister: currUser as unknown as User,
          })),
        );
      } catch (error) {
        console.error("Error fetching gigs:", error);
      }
    }
  }, [currUser, db]);

  useEffect(() => {
    fetchGigs();
  }, [currUser, db, fetchGigs]);

  const handleSeeMoreClick = async (gig: Gig) => {
    setSelectedGig(gig);
    setIsGigDetailsOpen(true);

    if (gig.listerId) {
      const listerDoc = await getDoc(doc(usersRef(db), gig.listerId));
      if (listerDoc.exists()) {
        setSelectedLister(listerDoc.data() as User);
      } else {
        setSelectedLister(null);
      }
    }
  };
  
  const handleCompleteGig = async (gigId: string) => {
    try {
      const gigDocRef = doc(gigsRef(db), gigId);
      await updateDoc(gigDocRef, { status: "awaiting-confirmation" });

      const chatQuery = query(
        chatsRef(db),
        where("gigId", "==", gigId),
        where("applicantId", "==", currUser?.uid)
       );
       
       const chatDocs = await getDocs(chatQuery);
       const chatUpdates = chatDocs.docs.map(doc => 
        updateDoc(doc.ref, {
          lastUpdatedTime: serverTimestamp()
        })
       );
       await Promise.all(chatUpdates);

      // Refresh in-progress and awaiting-approval gigs
      const updatedInProgress = inProgressGigs.filter(
        ({ gig }) => gig.gigId !== gigId,
      );
      const updatedGig = inProgressGigs.find(({ gig }) => gig.gigId === gigId);
      if (updatedGig) {
        setAwaitingApprovalGigs([...awaitingApprovalGigs, updatedGig]);
      }
      setInProgressGigs(updatedInProgress);

      await fetchGigs();
    } catch (error) {
      console.error("Error updating gig status:", error);
    }
  };

  const handleCloseGigDetails = () => {
    setSelectedGig(null);
    setIsGigDetailsOpen(false);
  };

  const handleUndoClick = async (gigId: string) => {
    if (!currUser) {
      console.error("No current user found");
      return;
    }
  
    try {

      const chatQuery = query(
        chatsRef(db),
        where("gigId", "==", gigId),
        where("applicantId", "==", currUser.uid)
       );
       
       const chatDocs = await getDocs(chatQuery);
       const chatUpdates = chatDocs.docs.map(doc => 
        updateDoc(doc.ref, {
          lastUpdatedTime: serverTimestamp()
        })
       );
       await Promise.all(chatUpdates);
       
      const applicationQuery = query(
        applicationsRef(db),
        where("applicantId", "==", currUser.uid),
        where("gigId", "==", gigId),
        where("status", "==", "pending")
      );
  
      const applicationSnapshot = await getDocs(applicationQuery);
  
      if (!applicationSnapshot.empty) {
        const applicationDoc = applicationSnapshot.docs[0];
        await updateDoc(doc(applicationsRef(db), applicationDoc.id), {
          status: "discarded",
        });
  
        // Refresh the pending gigs list locally
        setPendingGigs((prevPending) =>
          prevPending.filter(({ gig }) => gig.gigId !== gigId)
        );
  
        await fetchGigs();
      }
    } catch (error) {
      console.error("Error updating gig status:", error);
    }
  };

  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [isHoveringRight, setIsHoveringRight] = useState(false);
  const [isHoveringLeft, setIsHoveringLeft] = useState(false);

  useEffect(() => {
    let scrollInterval: NodeJS.Timeout;
    
    if (isHoveringRight) {
      scrollInterval = setInterval(() => {
        if (scrollContainerRef.current) {
          scrollContainerRef.current.scrollLeft += 10;
        }
      }, 16);
    } else if (isHoveringLeft) {
      scrollInterval = setInterval(() => {
        if (scrollContainerRef.current) {
          scrollContainerRef.current.scrollLeft -= 10;
        }
      }, 16);
    }
    
    return () => clearInterval(scrollInterval);
  }, [isHoveringRight, isHoveringLeft]);

  return (
    <div className="relative h-screen w-full p-4" >
      {/* Horizontal Scrollable Container */}
      <div
        ref={scrollContainerRef}
        className="mr-10 flex h-[calc(100vh-8rem)] snap-x snap-mandatory gap-6 scroll-smooth hide-scrollbar">
        {/* Page 1: Scheduled Gigs and Pending Gigs */}
        <div className="flex size-full w-1/2 shrink-0 snap-center gap-6">
        <div className="scrollbar size-full overflow-y-scroll rounded-lg bg-gray-800 p-4 shadow-lg dark:text-white">
            <h1 className="mb-3 text-xl font-bold">Pending Gigs</h1>
            <PostedGigListSmall
              gigs={pendingGigs}
              showDateWithLine={true}
              showUndoButton={true}
              showSeeMoreButton={true}
              onUndoClick={handleUndoClick}
              onSeeMoreClick={handleSeeMoreClick}
            />
          </div>
          <div className="scrollbar size-full overflow-y-scroll rounded-lg bg-gray-800 p-4 shadow-lg dark:text-white">
            <h1 className="mb-3 text-xl font-bold">Scheduled Gigs</h1>
            <PostedGigListSmall
              gigs={inProgressGigs}
              showDateWithLine={true}
              showCompletedButton={true}
              showSeeMoreButton={true}
              showChatIcon={true}
              onCompleteClick={handleCompleteGig}
              onSeeMoreClick={handleSeeMoreClick}
            />
          </div>
          
        </div>
        

        {/* Page 2: Awaiting Approval and Completed Gigs */}
        <div className="flex  w-1/2 shrink-0 snap-center gap-6"> 
          <div className="scrollbar h-full w-1/2 overflow-y-scroll rounded-lg bg-gray-800 p-4 shadow-lg dark:text-white">
            <h1 className="mb-3 text-xl font-bold">Awaiting Approval</h1>
            <PostedGigListSmall
              gigs={awaitingApprovalGigs}
              showDateWithLine={true}
              showChatIcon={true}
              showSeeMoreButton={true}
              onSeeMoreClick={handleSeeMoreClick}
            />
          </div>
          <div className="scrollbar size-full w-1/2 overflow-y-scroll rounded-lg bg-gray-800 p-4 shadow-lg dark:text-white">
            <h1 className="mb-3 text-xl font-bold">Completed Gigs</h1>
            <PostedGigListSmall
              gigs={completedGigs}
              showDateWithLine={true}
              showChatIcon={false}
              showSeeMoreButton={true}
              onSelectGig={handleSeeMoreClick}
            />
          </div>
        </div>
      </div>

      {/* Gig Details Popup */}
      {selectedGig && isGigDetailsOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm">
          <div className="w-[800px] rounded-lg bg-gray-900 p-6 shadow-lg">
            <GigDetails
              gig={selectedGig}
              user={selectedLister}
              onEditSave={() => {}} // No edit functionality
              onDelete={() => {}} // No delete functionality
              showEdit={false} // Remove Edit button
              showDelete={false} // Remove Delete button
              showSeeMoreButton={true}
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
