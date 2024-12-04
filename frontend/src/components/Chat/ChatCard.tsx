

import React, { useEffect, useState } from "react";
import { Timestamp } from "firebase/firestore";
import { Gig, Application, User } from "@/utils/database/schema";
import { usersRef, chatsRef } from "@/utils/database/collections";
import CustomButton from "@/components/Buttons/CustomButton";
import { UndoButton } from "@/components/Buttons/UndoButton";
import { doc, getDoc, updateDoc, getDocs, query, where, addDoc } from "firebase/firestore";
import { gigsRef, applicationsRef, notificationsRef } from "@/utils/database/collections";
import { user } from "rxfire/auth";



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

    // update selected applicant of gig
    const updateGigApplicant = async (
      db: any,
      gigId: any,
      selectedApplicantId: string
    ) => {
      const gigRef = doc(gigsRef(db), gigId);
      await updateDoc(gigRef, {selectedApplicantId});
    };
// update chat timestamp
    const updateChatLastUpdate = async (chatId: string) => {
      try {
        const chatRef = doc(chatsRef(db), chatId);
        await updateDoc(chatRef, {
          lastUpdate: Timestamp.now(),
        });
      } catch (error) {
        console.error("Error updating chat lastUpdate:", error);
      }
    };
    
// create notification
    const createNotification = async (user: string, message: string) => {
      try {
        const notificationData: Partial<Notification> = {
          notificationId: "",
          userId: user,
          notificationMessage: message,
          createdAt: Timestamp.now(),
        };
        const notificationDoc = await addDoc(notificationsRef(db), notificationData);
        updateDoc(notificationDoc, {notificationId: notificationDoc.id})
      } catch (error) {
        console.error("Error creating notification:", error);
      }
    };
    

    const handleAssign = async (db: any, gigId: string, assignedApplicationId: string) => {
      try {
        // Update gig status to "in-progress"
        await updateGigStatus(db, gigId, "in-progress");
        // update chat timestamp
        await updateChatLastUpdate(application?.chatId || "");
        // Fetch all applications for the gig
        const applicationsQuery = query(applicationsRef(db), where("gigId", "==", gigId));
        const applicationsSnapshot = await getDocs(applicationsQuery);
    
        // Update the assigned application to "assigned"
        for (const doc of applicationsSnapshot.docs) {
          const application = doc.data() as Application;
          if (application.applicationId === assignedApplicationId) {
            // make application assigned
            await updateApplicationStatus(db, application.applicationId, "assigned"); 
            // update selected applicant of gig
            await updateGigApplicant(db, gigId, application.applicantId); 
            // create notification sent to applicant
            await createNotification(application?.applicantId, `Gig "${gig.title}" has been assigned to you.`); 
          } else {
            // make all other applications discarded
            await updateApplicationStatus(db, application.applicationId, "discarded"); 
            // send notification to all other applicants
            await createNotification(application?.applicantId, `Your application for gig "${gig.title}" has been discarded.`); 
            // update chat timestamp
            await updateChatLastUpdate(application?.chatId || "");
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
        // send notification to gig lister 
        await createNotification(gig.listerId, `Your gig "${gig.title}" has been marked completed.`);
        // Update application status to "awaiting-lister-completion"
        await updateApplicationStatus(db, applicationId, "awaiting-lister-completion");
        // update chat timestamp
        await updateChatLastUpdate(application?.chatId || "");
      } catch (error) {
        console.error("Error marking gig as complete:", error);
      }
    };
    
    const handleConfirmCompletion = async (db: any, gigId: string, applicationId: string) => {
      try {
        // Update gig status to "completed"
        await updateGigStatus(db, gigId, "completed");
        // update chat timestamp 
        await updateChatLastUpdate(application?.chatId || "");
        // send notification to applicant
        if (!gig.selectedApplicantId) {
          console.error("Error: No selected applicant for this gig.");
          return; // Exit the function if no selected applicant
        }
        await createNotification(gig.selectedApplicantId, `Gig "${gig.title}" has been completed.`);
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
        // update chat timestamp
        await updateChatLastUpdate(application?.chatId || "");
        // send notification to lister
        await createNotification(gig.listerId, `"${application?.applicantId}"'s application has been canceled.`);
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
              onClick={() => handleAssign(db, gig.gigId, application.applicationId)}
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

        if (application?.status === "awaiting-lister-completion"){
        return (
          <>
            <p>
              <strong>{applicantName}</strong> has reported completion of the
              gig. Confirm to release payment.
            </p>
            <CustomButton
              label="Confirm Completion"
              onClick={() =>
                handleConfirmCompletion(db, gig.gigId, application?.applicationId || "")
              }
              color="green"
              size="small"
            />
          </>
        );
      } 
      if (application?.status === "discarded"){
        return <p>Application no longer available.</p>;
      }
      
      else {return <p> Error: Unknown combination {application?.status} {gig.status}</p>}

      case "completed":
        if (application?.status === "completed"){
          return <p>Gig completed successfully.</p>;
        } 
        if (application?.status === "discarded"){
          return <p>Application no longer available.</p>;
        }
        else {return <p> Error: Unknown combination {application?.status} {gig.status}</p>;}


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
        return <p>Error. Unknown status: {gig.status}</p>;
    }
  };

  const renderApplicantView = () => {
    switch (application?.status) {

      case "pending":
        if (gig.status === "open"){
          return (
          <>
            <p className= "font-bold">Application sent. Waiting for response. Cancel application?</p>
            <div className= "p-3"> 
              <UndoButton
              onClick={() => handleCancelApplication(db, application.applicationId)}
              />
            </div>
            
          </>
        );
      }else {return <p> Error: Unknown combination {application?.status} {gig.status}</p>;}

      case "assigned":
        if (gig.status === "in-progress"){
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
      }else {return <p> Error: Unknown combination {application?.status} {gig.status}</p>;}

   

      case "completed":
        if (gig.status === "completed"){
          return <p>Gig completed! Payment is being processed.</p>;
      }else {return <p> Error: Unknown combination {application?.status} {gig.status}</p>;}
        

      case "awaiting-lister-completion":
        if (gig.status === "awaiting-confirmation"){
        
        return <p>Gig marked as completed. Wait for lister to confirm.</p>;
      }else {return <p> Error: Unknown combination {application?.status} {gig.status}</p>;}


      case "discarded":
        if (gig.status === "in-progress"){
          return <p>Gig no longer available.</p>;
      }
      if (gig.status === "open"){
        return <p>Application canceled.</p>;
      }
      if (gig.status === "deleted"){
        return <p>Gig deleted.</p>;
      }
      else {return <p> Gig no longer available.</p>;}
  

      default:
        return <p>Error. Unknown Status: {application?.status}</p>;
    }
  };

  return (
    <div className="flex flex-col items-center rounded-md bg-orange-300 p-4 shadow-md">
      {isLister ? renderListerView() : renderApplicantView()}
    </div>
  );
};

export default ChatCard;
