


import React, { useEffect, useState } from "react";
import { Gig, Application, User } from "@/utils/database/schema";
import { usersRef } from "@/utils/database/collections";
import CustomButton from "@/components/Buttons/CustomButton";
import { UndoButton } from "@/components/Buttons/UndoButton";
import { doc, getDoc, updateDoc, getDocs, query, where, writeBatch } from "firebase/firestore";
import { gigsRef, applicationsRef } from "@/utils/database/collections";






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


  


    // Update application status
    const updateApplicationStatus = async (
      db: any, 
      applicationId: string, 
      status: string
    ) => {
      const applicationRef = doc(applicationsRef(db), applicationId);
      await updateDoc(applicationRef, { status });
    };

    // Update gig status
    const updateGigStatus = async (
      db: any, 
      gigId: string, 
      status: string
    ) => {
      const gigRef = doc(gigsRef(db), gigId);
      await updateDoc(gigRef, { status });
    };


    const handleAssign = async (db: any, gigId: string, assignedApplicationId: string) => {
      try {
        // Update gig status to "in-progress"
        await updateGigStatus(db, gigId, "in-progress");
    
        // Fetch all applications for the gig
        const applicationsQuery = query(applicationsRef(db), where("gigId", "==", gigId));
        const applicationsSnapshot = await getDocs(applicationsQuery);
    
        // Update the assigned application to "assigned"
        for (const doc of applicationsSnapshot.docs) {
          const application = doc.data() as Application;
          if (application.applicationId === assignedApplicationId) {
            await updateApplicationStatus(db, application.applicationId, "assigned");
          } else {
            await updateApplicationStatus(db, application.applicationId, "discarded");
          }
        }
      } catch (error) {
        console.error("Error assigning gig:", error);
      }
    };
    

    

    const handleCompleteGig = async (db: any, gigId: string, applicationId: string) => {
      try {
        // Update gig status to "awaiting-confirmation"
        await updateGigStatus(db, gigId, "awaiting-confirmation");
    
        // Update application status to "awaiting-lister-completion"
        await updateApplicationStatus(db, applicationId, "awaiting-lister-completion");
      } catch (error) {
        console.error("Error marking gig as complete:", error);
      }
    };
    

    const handleConfirmCompletion = async (db: any, gigId: string, applicationId: string) => {
      try {
        // Update gig status to "completed"
        await updateGigStatus(db, gigId, "completed");
    
        // Update application status to "completed"
        await updateApplicationStatus(db, applicationId, "completed");
      } catch (error) {
        console.error("Error confirming completion:", error);
      }
    };
    
    
    const handleCancelApplication = async (db: any, applicationId: string) => {
      try {
        // Update application status to "discarded"
        await updateApplicationStatus(db, applicationId, "discarded");
      } catch (error) {
        console.error("Error cancelling application:", error);
      }
    };
    
    
    
    

  

  const renderListerView = () => {
    switch (gig.status) {
      case "open":
      if (application?.status === "pending") {
        return (
          <>
            <p>
              Application from <strong>{applicantName}</strong> is pending.
            </p>
            <CustomButton
              label={`Assign Gig to ${applicantName}`}
              onClick={() => handleAssign(db, gig.gigId, application.applicantId)}
              color="primary"
              size="small"
            />
          </>
        );
      }

      if (application?.status === "discarded") {
        return <p>Application no longer available.</p>;
      }

      return <p>No applications yet.</p>;

      case "awaiting-confirmation":
        return (
          <>
            <p>
              <strong>{applicantName}</strong> has reported completion of the
              gig. Confirm to release payment.
            </p>
            <CustomButton
              label="Confirm Completion"
              onClick={() => handleConfirmCompletion(db, gig.gigId)}
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
              Gig assigned successfully to <strong>{applicantName}</strong>.
            </p>
          </>
        ) : (
          <p>You have assigned the gig to another applicant.</p>
        );

      case "deleted":
        return <p>Gig deleted.</p>;

      default:
        return <p>Unknown status: {gig.status}</p>;
    }
  };

  const renderApplicantView = () => {
    switch (application?.status) {

      case "pending":
        return (
          <>
            <p>Application sent. Waiting for response. Cancel application?</p>
            <UndoButton
              onClick={() => handleCancelApplication(db, application.applicationId)}
            />
          </>
        );


      case "assigned":
        return (
          <>
            <p>Gig assigned to you. Execute gig and report completion.</p>
            <CustomButton
              label="Complete Gig"
              onClick={() => handleCompleteGig(db, gig.gigId, application.applicationId)}
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
