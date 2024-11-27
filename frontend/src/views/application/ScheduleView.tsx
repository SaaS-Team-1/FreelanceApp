import React, { useEffect, useState } from "react";
import PostedGigListHome from "@/components/Gigs/PostedGigListHome";
import GigDetails from "@/components/Gigs/GigDetails";
import { Gig, User } from "@/utils/database/schema";
import { query, Timestamp, where, getDocs, doc, updateDoc,getDoc } from "firebase/firestore";
import CustomButton from "@/components/Buttons/CustomButton";
import { useAuth, useFirestore } from "@/utils/reactfire";
import { applicationsRef, gigsRef, usersRef } from "@/utils/database/collections";
import { useCallback } from "react";

function ScheduleView() {
  const db = useFirestore();
  const auth = useAuth();
  const currUser = auth.currentUser;

  const [selectedGig, setSelectedGig] = useState<Gig | null>(null);
  const [selectedLister, setSelectedLister] = useState<User | null>(null);
  const [isGigDetailsOpen, setIsGigDetailsOpen] = useState(false);

  const [inProgressGigs, setInProgressGigs] = useState<{ gig: Gig; lister: User }[]>([]);
  const [pendingGigs, setPendingGigs] = useState<{ gig: Gig; lister: User }[]>([]);
  const [awaitingApprovalGigs, setAwaitingApprovalGigs] = useState<{ gig: Gig; lister: User }[]>([]);
  const [completedGigs, setCompletedGigs] = useState<{ gig: Gig; lister: User }[]>([]);

  const processGigData = (gigData: any, docId: string): Gig => ({
    ...gigData,
    gigId: docId,
    dueDate: gigData.dueDate instanceof Timestamp
      ? gigData.dueDate.toDate()
      : new Date(gigData.dueDate),
    createdAt: gigData.createdAt instanceof Timestamp
      ? gigData.createdAt.toDate()
      : new Date(gigData.createdAt),
  });

    const fetchGigs = useCallback(async () => {
      if (currUser) {
        try {
          const inProgressQuery = query(
            gigsRef(db),
            where("selectedApplicantId", "==", currUser.uid),
            where("status", "==", "in-progress")
          );
          const inProgressSnapshot = await getDocs(inProgressQuery);
          setInProgressGigs(
            inProgressSnapshot.docs.map((doc) => ({
              gig: processGigData(doc.data(), doc.id),
              lister: currUser as unknown as User,
            }))
          );

          const pendingQuery = query(
            applicationsRef(db),
            where("applicantId", "==", currUser.uid),
            where("status", "==", "pending")
          );
          const pendingSnapshot = await getDocs(pendingQuery);
          const pendingGigIds = pendingSnapshot.docs.map((doc) => doc.data().gigId);

          const pendingGigsData = await Promise.all(
            pendingGigIds.map(async (gigId) => {
              const gigDoc = await getDoc(doc(gigsRef(db), gigId));
              if (gigDoc.exists()) {
                const gigData = gigDoc.data();
                const listerDoc = await getDoc(doc(usersRef(db), gigData.listerId));
                const listerData = listerDoc.exists() ? (listerDoc.data() as User) : null;
                return {
                  gig: processGigData(gigData, gigId),
                  lister: listerData || currUser as unknown as User,
                };
              }
              return null;
            })
          );
          setPendingGigs(pendingGigsData.filter(Boolean) as any);

          const awaitingApprovalQuery = query(
            gigsRef(db),
            where("selectedApplicantId", "==", currUser.uid),
            where("status", "==", "awaiting-confirmation")
          );
          const awaitingApprovalSnapshot = await getDocs(awaitingApprovalQuery);
          setAwaitingApprovalGigs(
            awaitingApprovalSnapshot.docs.map((doc) => ({
              gig: processGigData(doc.data(), doc.id),
              lister: currUser as unknown as User,
            }))
          );

          const completedQuery = query(
            gigsRef(db),
            where("selectedApplicantId", "==", currUser.uid),
            where("status", "==", "completed")
          );
          const completedSnapshot = await getDocs(completedQuery);
          setCompletedGigs(
            completedSnapshot.docs.map((doc) => ({
              gig: processGigData(doc.data(), doc.id),
              lister: currUser as unknown as User,
            }))
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

      // Refresh in-progress and awaiting-approval gigs
      const updatedInProgress = inProgressGigs.filter(({ gig }) => gig.gigId !== gigId);
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

  return (
    <div className="relative p-4">
      {/* Horizontal Scrollable Container */}
      <div
        className="flex overflow-x-auto scroll-smooth snap-x snap-mandatory gap-6"
        style={{ scrollSnapType: "x mandatory" }}
      >
        {/* Page 1: Scheduled Gigs and Pending Gigs */}
        <div className="flex gap-6 w-full flex-shrink-0 snap-center">
          <div className="w-[50%] rounded-lg bg-gray-800 dark:text-white p-4 shadow-lg">
            <h1 className="mb-3 text-xl font-bold">Scheduled Gigs</h1>
            <PostedGigListHome
              gigs={inProgressGigs}
              showDateWithLine={true}
              showCompletedButton={true}
              showSeeMoreButton={true}
              showChatIcon={true}
              onCompleteClick={handleCompleteGig}
              onSeeMoreClick={handleSeeMoreClick}
            />
          </div>
          <div className="w-[50%] rounded-lg bg-gray-800 dark:text-white p-4 shadow-lg">
            <h1 className="mb-3 text-xl font-bold">Pending Gigs</h1>
            <PostedGigListHome
              gigs={pendingGigs}
              showDateWithLine={true}
              showUndoButton={true}
              onSeeMoreClick={handleSeeMoreClick}
            />
          </div>
        </div>

        {/* Page 2: Awaiting Approval and Completed Gigs */}
        <div className="flex gap-6 w-full flex-shrink-0 snap-center">
          <div className="w-[50%] rounded-lg bg-gray-800 dark:text-white p-4 shadow-lg">
            <h1 className="mb-3 text-xl font-bold">Awaiting Approval</h1>
            <PostedGigListHome
              gigs={awaitingApprovalGigs}
              showDateWithLine={true}
              showChatIcon={true}
              onSeeMoreClick={handleSeeMoreClick}
            />
          </div>
          <div className="w-[50%] rounded-lg bg-gray-800  dark:text-white p-4 shadow-lg">
            <h1 className="mb-3 text-xl font-bold">Completed Gigs</h1>
            <PostedGigListHome
              gigs={completedGigs}
              showDateWithLine={true}
              showChatIcon={false}
              showSeeMoreButton={true}
              onSeeMoreClick={handleSeeMoreClick}
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
