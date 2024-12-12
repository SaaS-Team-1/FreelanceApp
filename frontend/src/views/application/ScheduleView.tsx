import { useEffect, useState } from "react";
import PostedGigListSmall from "@/components/Gigs/MyPostedGigListSmall";
import { Gig, User } from "@/utils/database/schema";
import {
  query,
  Timestamp,
  where,
  getDocs,
  doc,
  updateDoc,
  getDoc,
  addDoc,
  serverTimestamp,
} from "firebase/firestore";
import { useAuth, useFirestore } from "@/utils/reactfire";
import {
  applicationsRef,
  gigsRef,
  usersRef,
  chatsRef,
  notificationsRef,
} from "@/utils/database/collections";
import { useCallback } from "react";
import GigDetailModal from "@/components/Gigs/GigDetailModal";
import { Tabs } from "flowbite-react";
import { FaCalendar, FaCheck, FaClock, FaComments, FaToggleOff } from "react-icons/fa";
import { toast } from "react-toastify";

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

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
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
              if (
                gigData.status === "awaiting-confirmation" ||
                gigData.status === "in-progress"
              ) {
                return null;
              }
              console.log(gigData);
              const listerDoc = await getDoc(
                doc(usersRef(db), gigData.listerId),
              );
              const listerData = listerDoc.exists()
                ? (listerDoc.data() as User)
                : null;
              return {
                gig: processGigData(gigData, gigId as string),
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
                .filter(
                  (item): item is { gig: Gig; lister: User } => item !== null,
                )
                .map((item) => [item.gig.gigId, item]),
            ).values(),
          ),
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

  const handleUndoClick = async (gigId: string) => {
    if (!currUser) {
      console.error("No current user found");
      return;
    }

    try {
      const applicationQuery = query(
        applicationsRef(db),
        where("applicantId", "==", currUser.uid),
        where("gigId", "==", gigId),
        where("status", "==", "pending"),
      );

      const applicationSnapshot = await getDocs(applicationQuery);

      if (!applicationSnapshot.empty) {
        const applicationDoc = applicationSnapshot.docs[0];
        const applicationId = applicationDoc.id;

        await updateDoc(doc(applicationsRef(db), applicationId), {
          status: "discarded",
        });

        const chatQuery = query(
          chatsRef(db),
          where("gigId", "==", gigId),
          where("applicantId", "==", currUser.uid),
        );
        const chatSnapshot = await getDocs(chatQuery);
        const chatUpdates = chatSnapshot.docs.map((chatDoc) =>
          updateDoc(chatDoc.ref, {
            lastUpdate: serverTimestamp(),
          }),
        );
        await Promise.all(chatUpdates);

        const gigDoc = await getDoc(doc(gigsRef(db), gigId));
        if (gigDoc.exists()) {
          const gigData = gigDoc.data() as Gig;
          await addDoc(notificationsRef(db), {
            userId: gigData.listerId,
            notificationMessage: `${currUser.displayName}'s application has been canceled.`,
            createdAt: serverTimestamp(),
          });
        }

        setPendingGigs((prevPending) =>
          prevPending.filter(({ gig }) => gig.gigId !== gigId),
        );
        await fetchGigs();
      }
    } catch (error) {
      console.error("Error undoing application:", error);
      toast.error("Failed to undo application. Please try again.");
    }
  };

  const handleCompleteGig = async (gigId: string) => {
    if (!currUser) {
      console.error("No current user found");
      return;
    }

    try {
      const gigRef = doc(gigsRef(db), gigId);
      await updateDoc(gigRef, { status: "awaiting-confirmation" });

      const applicationsQuery = query(
        applicationsRef(db),
        where("gigId", "==", gigId),
        where("status", "==", "assigned"),
      );
      const applicationsSnapshot = await getDocs(applicationsQuery);
      if (!applicationsSnapshot.empty) {
        const applicationDoc = applicationsSnapshot.docs[0];
        await updateDoc(applicationDoc.ref, {
          status: "awaiting-lister-completion",
          updatedAt: serverTimestamp(),
        });
      }

      const gigDoc = await getDoc(gigRef);
      if (gigDoc.exists()) {
        const gigData = gigDoc.data() as Gig;
        await addDoc(notificationsRef(db), {
          userId: gigData.listerId,
          notificationMessage: `Your gig "${gigData.title}" has been marked completed.`,
          createdAt: serverTimestamp(),
        });
      }

      const chatQuery = query(
        chatsRef(db),
        where("gigId", "==", gigId),
        where("applicantId", "==", currUser.uid),
      );
      const chatSnapshot = await getDocs(chatQuery);
      const chatUpdates = chatSnapshot.docs.map((chatDoc) =>
        updateDoc(chatDoc.ref, {
          lastUpdate: serverTimestamp(),
        }),
      );
      await Promise.all(chatUpdates);

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
      console.error("Error completing gig:", error);
      toast.error("Failed to mark gig as completed. Please try again.");
    }
  };

  return (
    <div className="relative h-screen w-full p-4">
      {/* Horizontal Scrollable Container */}
      <Tabs aria-label="Schedule Tabs" variant="fullWidth">
        <Tabs.Item active title="Pending Gigs" icon={FaToggleOff}>
          <div className="scrollbar size-full overflow-y-scroll rounded-lg p-4">
            <h1 className="dark:text-white mb-3 text-xl font-bold">
              Pending Gigs
            </h1>
            <PostedGigListSmall
              gigs={pendingGigs}
              showChatIcon={true}
              onSeeMoreClick={handleSeeMoreClick}
            />
          </div>
        </Tabs.Item>
        <Tabs.Item active title="Scheduled Gigs" icon={FaCalendar}>
          <div className="scrollbar size-full overflow-y-scroll rounded-lg p-4">
            <h1 className="dark:text-white mb-3 text-xl font-bold">
              Scheduled Gigs
            </h1>
            <PostedGigListSmall
              gigs={inProgressGigs}
              showCompletedButton={true}
              showChatIcon={true}
              onCompleteClick={handleCompleteGig}
              onSeeMoreClick={handleSeeMoreClick}
            />
          </div>
        </Tabs.Item>

        <Tabs.Item active title="Awaiting Approval" icon={FaClock}>
          <div className="scrollbar size-full overflow-y-scroll rounded-lg p-4">
            <h1 className="dark:text-white mb-3 text-xl font-bold">
              Awaiting Approval
            </h1>
            <PostedGigListSmall
              gigs={awaitingApprovalGigs}
              showChatIcon={true}
              onSeeMoreClick={handleSeeMoreClick}
            />
          </div>
        </Tabs.Item>

        <Tabs.Item active title="Completed Gigs" icon={FaCheck}>
          <div className="scrollbar size-full overflow-y-scroll rounded-lg p-4">
            <h1 className="dark:text-white mb-3 text-xl font-bold">
              Completed Gigs
            </h1>
            <PostedGigListSmall
              gigs={completedGigs}
              onSeeMoreClick={handleSeeMoreClick}
            />
          </div>
        </Tabs.Item>
      </Tabs>

      {/* Gig Details Popup */}
      {selectedGig && selectedLister && (
        <GigDetailModal
          gig={selectedGig}
          lister={selectedLister}
          isOpen={isGigDetailsOpen}
          userId={currUser?.uid} // Pass the logged-in user's ID
          db={db} // Pass the Firestore database instance
          onClose={() => setIsGigDetailsOpen(false)}
        />
      )}
    </div>
  );
}

export default ScheduleView;
