import React, { useEffect, useState } from "react";
import { Gig, Application, User } from "@/utils/database/schema";
import { doc, getDoc } from "firebase/firestore";
import { usersRef } from "@/utils/database/collections";
import CustomButton from "@/components/Buttons/CustomButton";
import { UndoButton } from "@/components/Buttons/UndoButton";

interface ChatCardProps {
  gig: Gig;
  application: Application | null;
  userId: string;
  db: any; // Firestore instance
}

const ChatCard: React.FC<ChatCardProps> = ({
  gig,
  application,
  userId,
  db,
}) => {
  const isLister = gig.listerId === userId;
  const [applicantName, setApplicantName] = useState<string>("");

  useEffect(() => {
    const fetchApplicantName = async () => {
      if (application?.applicantId) {
        try {
          const applicantDoc = await getDoc(
            doc(usersRef(db), application.applicantId),
          );
          const applicantData = applicantDoc.data() as User | undefined;
          setApplicantName(applicantData?.displayName || "Unknown Applicant");
        } catch (error) {
          console.error("Error fetching applicant name:", error);
        }
      }
    };

    fetchApplicantName();
  }, [application, db]);

  const renderListerView = () => {
    switch (gig.status) {
      case "open":
        return application?.status === "pending" ? (
          <>
            <p>
              Application from <strong>{applicantName}</strong> is pending.
            </p>
            <CustomButton
              label={`Assign Gig to ${applicantName}`}
              onClick={() =>
                console.log(`Assigning gig to ${application?.applicantId}`)
              }
              color="primary"
              size="small"
            />
          </>
        ) : (
          <p>No applications yet.</p>
        );

      case "awaiting-confirmation":
        return (
          <>
            <p>
              <strong>{applicantName}</strong> has reported completion of the
              gig. Confirm to release payment.
            </p>
            <CustomButton
              label="Confirm Completion"
              onClick={() => console.log("Confirming gig completion")}
              color="green"
              size="small"
            />
          </>
        );

      case "completed":
        return <p>Gig completed successfully.</p>;

      case "in-progress":
        return application?.status === "assigned" ? (
          <>
            <p>
              You have assigned the gig to <strong>{applicantName}</strong>.
            </p>
          </>
        ) : (
          <p>You have assigned the gig to another applicant.</p>
        );

      case "deleted":
        return <p>Gig deleted.</p>;

      default:
        return <p>Status: {gig.status}</p>;
    }
  };

  const renderApplicantView = () => {
    switch (application?.status) {
      case "pending":
        return (
          <>
            <p>Application sent. Waiting for response. Cancel application?</p>
            <UndoButton
              onClick={() => alert(`Undo clicked for gig: ${gig.title}`)}
            />
          </>
        );

      case "assigned":
        return (
          <>
            <p>Gig assigned to you. Report gig completion once executed.</p>
            <CustomButton
              label="Complete Gig"
              onClick={() => console.log("Marking gig as complete")}
              color="green"
              size="small"
            />
          </>
        );

      case "completed":
        return <p>Gig completed! Payment is being processed.</p>;

      case "awaiting-lister-completion":
        return <p>Gig marked as completed. Wait for lister to confirm.</p>;

      case "discarded":
        return <p>Gig no longer available.</p>;

      default:
        return <p>Status: {application?.status}</p>;
    }
  };

  return (
    <div className="flex flex-col items-center rounded-md bg-orange-300 p-4 shadow-md">
      {isLister ? renderListerView() : renderApplicantView()}
    </div>
  );
};

export default ChatCard;
