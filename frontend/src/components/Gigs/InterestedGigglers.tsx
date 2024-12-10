import React, { useState, useEffect } from "react";
import ReactDOM from "react-dom";
import { User, Gig, Application } from "@/utils/database/schema";

import CustomButton from "@/components/Buttons/CustomButton";
import { useNavigate } from "react-router-dom";
import { useFirestore } from "@/utils/reactfire";
import { FaRegMessage, FaUserCheck, FaEnvelope } from "react-icons/fa6";

import UserProfilePicture from "@/components/Avatar/UserProfilePicture";
import { httpsCallable } from "firebase/functions";

import {
  doc,
  updateDoc,
  increment,
  serverTimestamp,
  query,
  where,
  getDocs,
  addDoc,
} from "firebase/firestore";
import {
  applicationsRef,
  gigsRef,
  usersRef,
  notificationsRef,
  chatsRef,
} from "@/utils/database/collections";
import { useFunctions } from "@/utils/reactfire";

interface InterestedGigglersProps {
  gig: Gig;
  users: User[];
  onGigUpdate: (updatedGig: Gig) => void;
}

const InterestedGigglers: React.FC<InterestedGigglersProps> = ({
  gig,
  users,
  onGigUpdate,
}) => {
  const db = useFirestore();
  const navigate = useNavigate();
  const [showModal, setShowModal] = useState(false);
  const [applicantStatuses, setApplicantStatuses] = useState<Application[]>([]);
  const functions = useFunctions();

  useEffect(() => {
    const fetchApplications = async () => {
      try {
        const applicationsQuery = query(
          applicationsRef(db),
          where("gigId", "==", gig.gigId),
          where("status", "in", [
            "pending",
            "assigned",
            "awaiting-lister-completion",
            "completed",
          ]),
        );

        const applicationsSnapshot = await getDocs(applicationsQuery);
        const applications = applicationsSnapshot.docs.map((doc) => ({
          ...doc.data(),
          applicationId: doc.id,
        })) as Application[];

        setApplicantStatuses(applications);
      } catch (error) {
        console.error("Error fetching applications:", error);
      }
    };

    fetchApplications();
  }, [db, gig.gigId]);

  const handleAssignGig = async (applicantId: string) => {
    try {
      const res = await httpsCallable(
        functions,
        "stripe-assignTransaction",
      )({
        thirdPartyId: applicantId,
        gigId: gig.gigId,
        gigName: gig.title,
        amount: gig.price,
        onHold: true,
        kind: "send",
      });

      if (res?.data?.status !== "success") {
        throw new Error(
          "Transaction failed. Insufficient funds or other error.",
        );
      }

      await updateDoc(doc(db, "gigs", gig.gigId), {
        selectedApplicantId: applicantId,
        status: "in-progress",
        updatedAt: serverTimestamp(),
      });

      // Update application statuses and send notifications
      const updatePromises = applicantStatuses.map(async (application) => {
        const newStatus =
          application.applicantId === applicantId ? "assigned" : "discarded";

        await updateDoc(doc(applicationsRef(db), application.applicationId), {
          status: newStatus,
          updatedAt: serverTimestamp(),
        });

        const notificationMessage =
          newStatus === "assigned"
            ? `Congratulations! You have been assigned to the gig "${gig.title}".`
            : `Your application for the gig "${gig.title}" has been discarded.`;

        await addDoc(notificationsRef(db), {
          userId: application.applicantId,
          notificationMessage,
          createdAt: serverTimestamp(),
        });
      });

      await Promise.all(updatePromises);

      const chatQuery = query(chatsRef(db), where("gigId", "==", gig.gigId));
      const chatSnapshot = await getDocs(chatQuery);
      const chatUpdates = chatSnapshot.docs.map((chatDoc) =>
        updateDoc(chatDoc.ref, {
          lastUpdate: serverTimestamp(),
        }),
      );
      await Promise.all(chatUpdates);

      onGigUpdate({
        ...gig,
        selectedApplicantId: applicantId,
        status: "in-progress",
      });
    } catch (error) {
      console.error("Error assigning gig:", error);
      alert("Failed to assign gig / insufficient funds. Please try again.");
    }
  };

  const handleConfirmCompletion = async (application: Application) => {
    try {
      const res = await httpsCallable(
        functions,
        "stripe-finalizeTransaction",
      )({
        thirdPartyId: application.applicantId,
        gigId: gig.gigId,
      });

      if (res?.data?.status !== "success") {
        throw new Error("Transaction failed. Please try again.");
      }

      await updateDoc(doc(db, "gigs", gig.gigId), {
        status: "completed",
        updatedAt: serverTimestamp(),
      });

      await updateDoc(doc(applicationsRef(db), application.applicationId), {
        status: "completed",
        updatedAt: serverTimestamp(),
      });

      await addDoc(notificationsRef(db), {
        userId: application.applicantId,
        notificationMessage: `Gig "${gig.title}" has been marked as completed.`,
        createdAt: serverTimestamp(),
      });

      await Promise.all([
        updateDoc(doc(usersRef(db), gig.listerId), {
          completedGigs: increment(1),
        }),
        updateDoc(doc(usersRef(db), application.applicantId), {
          completedGigs: increment(1),
        }),
      ]);

      const chatQuery = query(
        chatsRef(db),
        where("gigId", "==", gig.gigId),
        where("applicant", "==", application.applicantId),
      );
      const chatSnapshot = await getDocs(chatQuery);
      const chatUpdates = chatSnapshot.docs.map((chatDoc) =>
        updateDoc(chatDoc.ref, {
          lastUpdate: serverTimestamp(),
        }),
      );
      await Promise.all(chatUpdates);

      onGigUpdate({
        ...gig,
        status: "completed",
      });
    } catch (error) {
      console.error("Error confirming completion:", error);
      alert("Failed to confirm completion. Please try again.");
    }
  };

  const handleMessageClick = (applicantId: string) => {
    navigate(`/app/chat?user=${applicantId}`);
  };

  const renderApplicationStatus = (application: Application) => {
    const user = users.find((u) => u.userId === application.applicantId);
    if (!user) return null;

    switch (application.status) {
      case "pending":
        return (
          <div key={application.applicationId} className="p-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <UserProfilePicture
                  user={user}
                  size="medium"
                  hoverDetails={true}
                  rounded={true}
                  position="default"
                />
                <span className="ml-3 text-slate-800">
                  {user.displayName} has applied to this gig.
                </span>
              </div>
              <div className="flex">
              <CustomButton
                label="Assign"
                icon={FaUserCheck}
                onClick={() => handleAssignGig(user.userId)}
                color="green"
                textColor="black"
                size="small"
                rounded={false}
              />
              <CustomButton
                label="Message"
                icon={FaEnvelope}
                onClick={() => navigate(`/app/chat?user=${user.userId}`)}
                color="gray"
                size="small"
              />
              </div>
            </div>
          </div>
        );
      case "assigned":
        return (
          <div key={application.applicationId} className="p-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <UserProfilePicture
                  user={user}
                  size="medium"
                  hoverDetails={true}
                  rounded={true}
                  position="default"
                />
                <span className="ml-3 text-slate-800">
                  {user.displayName} has been assigned this gig.
                </span>
              </div>
            </div>
          </div>
        );
      case "awaiting-lister-completion":
        return (
          <div key={application.applicationId} className="p-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <UserProfilePicture
                  user={user}
                  size="medium"
                  hoverDetails={true}
                  rounded={true}
                  position="default"
                />
                <span className="ml-3 text-slate-800">
                  {user.displayName} marked the gig as completed.
                </span>
              </div>
              <CustomButton
                label="Confirm"
                onClick={() => handleConfirmCompletion(application)}
                color="blue"
                textColor="black"
                size="small"
                rounded={true}
              />
            </div>
          </div>
        );
      case "completed":
        return (
          <div key={application.applicationId} className="p-2">
            <div className="flex items-center">
              <UserProfilePicture
                user={user}
                size="medium"
                hoverDetails={true}
                rounded={true}
                position="default"
              />
              <span className="ml-3 text-white">
                Completed by {user.displayName}.
              </span>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="relative mt-6 rounded-lg bg-white p-4">
      <h4 className="mb-2 text-2xl font-semibold text-slate-800">
        Interested Gigglers
      </h4>
      <div className="max-h-[400px] overflow-y-auto">
        {applicantStatuses.map(renderApplicationStatus)}
      </div>
    </div>
  );
};

export default InterestedGigglers;
