// import React, { useEffect, useState } from "react";
// import { Gig, Application, User } from "@/utils/database/schema";
// import { doc, getDoc } from "firebase/firestore";
// import { usersRef } from "@/utils/database/collections";
// import CustomButton from "@/components/Buttons/CustomButton";
// import { UndoButton } from "@/components/Buttons/UndoButton";

// interface ChatCardProps {
//   gig: Gig;
//   application: Application | null;
//   userId: string;
//   db: any; // Firestore instance
// }

// const ChatCard: React.FC<ChatCardProps> = ({
//   gig,
//   application,
//   userId,
//   db,
// }) => {
//   const isLister = gig.listerId === userId;
//   const [applicantName, setApplicantName] = useState<string>("");

//   useEffect(() => {
//     const fetchApplicantName = async () => {
//       if (application?.applicantId) {
//         try {
//           const applicantDoc = await getDoc(
//             doc(usersRef(db), application.applicantId),
//           );
//           const applicantData = applicantDoc.data() as User | undefined;
//           setApplicantName(applicantData?.displayName || "Unknown Applicant");
//         } catch (error) {
//           console.error("Error fetching applicant name:", error);
//         }
//       }
//     };

//     fetchApplicantName();
//   }, [application, db]);
  

//   const renderListerView = () => {
//     switch (gig.status) {
//       case "open":
//         return application?.status === "pending" ? (
//           <>
//             <p>
//               Application from <strong>{applicantName}</strong> is pending.
//             </p>
//             <CustomButton
//               label={`Assign Gig to ${applicantName}`}
//               onClick={() =>
//                 console.log(`Assigning gig to ${application?.applicantId}`)
//               }
//               color="primary"
//               size="small"
//             />
//           </>
//         ) : (
//           <p>No applications yet.</p>
//         );

//       case "awaiting-confirmation":
//         return (
//           <>
//             <p>
//               <strong>{applicantName}</strong> has reported completion of the
//               gig. Confirm to release payment.
//             </p>
//             <CustomButton
//               label="Confirm Completion"
//               onClick={() => console.log("Confirming gig completion")}
//               color="green"
//               size="small"
//             />
//           </>
//         );

//       case "completed":
//         return <p>Gig completed successfully.</p>;

//       case "in-progress":
//         return application?.status === "assigned" ? (
//           <>
//             <p>
//               You have assigned the gig to <strong>{applicantName}</strong>.
//             </p>
//           </>
//         ) : (
//           <p>You have assigned the gig to another applicant.</p>
//         );

//       case "deleted":
//         return <p>Gig deleted.</p>;

//       default:
//         return <p>Status: {gig.status}</p>;
//     }
//   };

//   const renderApplicantView = () => {
//     switch (application?.status) {
//       // case "pending":
//       //   return (
//       //     <>
//       //       <p>Application sent. Waiting for response. Cancel application?</p>
//       //       <UndoButton
//       //         onClick={() => alert(`Undo clicked for gig: ${gig.title}`)}
//       //       />
//       //     </>
//       //   );
//       case "pending":
//         return (
//           <>
//             <p>Application sent. Waiting for response. Cancel application?</p>
//             <UndoButton
//               onClick={() => handleUndoClick(gig.gigId)}
//             />
//           </>
//         );


//       case "assigned":
//         return (
//           <>
//             <p>Gig assigned to you. Report gig completion once executed.</p>
//             <CustomButton
//               label="Complete Gig"
//               onClick={() => console.log("Marking gig as complete")}
//               color="green"
//               size="small"
//             />
//           </>
//         );

//       case "completed":
//         return <p>Gig completed! Payment is being processed.</p>;

//       case "awaiting-lister-completion":
//         return <p>Gig marked as completed. Wait for lister to confirm.</p>;

//       case "discarded":
//         return <p>Gig no longer available.</p>;

//       default:
//         return <p>Status: {application?.status}</p>;
//     }
//   };

//   return (
//     <div className="flex flex-col items-center rounded-md bg-orange-300 p-4 shadow-md">
//       {isLister ? renderListerView() : renderApplicantView()}
//     </div>
//   );
// };

// export default ChatCard;



import React, { useEffect, useState } from "react";
import { Gig, Application, User } from "@/utils/database/schema";
import {
  doc,
  getDoc,
  updateDoc,
  deleteDoc,
  getDocs,
  query,
  where,
} from "firebase/firestore";
import { usersRef, gigsRef, applicationsRef } from "@/utils/database/collections";
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

  // Handler to mark a gig as complete
  const handleCompleteGig = async (gigId: string) => {
    try {
      const gigDocRef = doc(gigsRef(db), gigId);
      await updateDoc(gigDocRef, { status: "awaiting-confirmation" });

      console.log("Gig marked as complete and awaiting confirmation.");
      // Optionally refetch data or refresh UI if necessary
    } catch (error) {
      console.error("Error updating gig status:", error);
    }
  };

  // Handler to undo/cancel a gig application
  const handleUndoClick = async (gigId: string) => {
    if (!userId) {
      console.error("No user found");
      return;
    }

    try {
      const applicationQuery = query(
        applicationsRef(db),
        where("applicantId", "==", userId),
        where("gigId", "==", gigId),
        where("status", "==", "pending"),
      );

      const applicationSnapshot = await getDocs(applicationQuery);

      if (!applicationSnapshot.empty) {
        const applicationDoc = applicationSnapshot.docs[0];
        await deleteDoc(doc(applicationsRef(db), applicationDoc.id));

        console.log("Application cancelled successfully.");
        // Optionally refetch data or refresh UI if necessary
      }
    } catch (error) {
      console.error("Error removing application:", error);
    }
  };

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
              onClick={() => handleUndoClick(gig.gigId)}
            />
          </>
        );

      case "assigned":
        return (
          <>
            <p>Gig assigned to you. Report gig completion once executed.</p>
            <CustomButton
              label="Complete Gig"
              onClick={() => handleCompleteGig(gig.gigId)}
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
