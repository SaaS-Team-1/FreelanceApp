


import React from "react";
import { Gig, Application } from "@/utils/database/schema";
import CustomButton from "@/components/Buttons/CustomButton";

interface ChatCardProps {
  gig: Gig;
  application: Application | null;
  userId: string;
}

const ChatCard: React.FC<ChatCardProps> = ({ gig, application, userId }) => {
  const isLister = gig.listerId === userId;

  const renderListerView = () => {
    switch (gig.status) {
      case "open":
        return application?.status === "pending" ? (
          <>
            <p>Application pending. Assign gig to ${application.applicantId}?</p>
            <CustomButton
              label="Assign Gig"
              onClick={() =>
                console.log(`Assigning gig to ${application.applicantId}`)
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
            <p>{application?.applicantId} reported completion of the gig. Confirm to release payment.</p>
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
            <p>You have assigned gig to ${gig.selectedApplicantId}?</p>
          
          </>
        ): (
          <p>You have assigned gig to another applicant.</p>
        );
      
      case "deleted":
        return <p> Gig deleted.</p>

      default:
        return <p>Status: {gig.status}</p>;
    }
  };

  const renderApplicantView = () => {
    switch (application?.status) {
      case "pending":
        return (
          <>
            <p>Application sent. Waiting for response.</p>
            <CustomButton
              label="Cancel Application"
              onClick={() => console.log("Cancelling application")}
              color="red"
              size="small"
            />
          </>
        );

      case "assigned":
        return (
          <>
            <p>Gig assigned to you. Complete gig and report completion.</p>
            <CustomButton
              label="Mark as Complete"
              onClick={() => console.log("Marking gig as complete")}
              color="green"
              size="small"
            />
          </>
        );

      case "completed":
        return <p>Gig completed! Payment is being processed.</p>;
      
      case "awaiting-lister-completion":
        return <p> Gig marked as completed. Wait for lister to confirm.</p>

      case "discarded":
        return <p> Gig no longer available.</p>
        
      default:
        return <p>Status: {application?.status}</p>;
    }
  };

  return (
    <div className="flex flex-col items-center bg-orange-300 p-4 rounded-md shadow-md">
      {isLister ? renderListerView() : renderApplicantView()}
    </div>
  );
};

export default ChatCard;
