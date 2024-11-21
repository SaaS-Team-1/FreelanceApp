// import React, { useEffect, useState } from "react";
// import { User, Gig, Application, Chat, Rating } from "../../utils/database/schema"; 
// import { Timestamp } from "firebase/firestore";

// const ChatCard: React.FC<{ chat: Chat; userId: string }> = ({ chat, userId }) => {
//   const [gig, setGig] = useState<Gig | null>(null);
//   const [application, setApplication] = useState<Application | null>(null);
//   const [rating, setRating] = useState<Rating | null>(null);
//   const isLister = gig?.listerId === userId;

//   useEffect(() => {
//     // Mock data fetching based on chat
//     const mockGig: Gig = {
//       gigId: chat.gigId,
//       title: "Mock Gig Title",
//       description: "This is a mock description of the gig.",
//       category: "Mock Category",
//       price: 100,
//       dueDate: Timestamp.now(),
//       status: "open", // Change as needed for different cases
//       listerId: "lister123",
//       applications: ["app1", "app2"],
//       createdAt: Timestamp.now(),
//     };

//     const mockApplication: Application = {
//       applicationId: "app1",
//       gigId: chat.gigId,
//       applicantId: "applicant123",
//       listerId: "lister123",
//       coverLetter: "This is a mock cover letter.",
//       status: "pending", // Change as needed for different cases
//       appliedAt: Timestamp.now(),
//       chatId: chat.chatId,
//     };

//     const mockRating: Rating = {
//       ratingId: "rating1",
//       gigId: chat.gigId,
//       toUserId: "applicant123",
//       byUserId: "lister123",
//       byUserDisplayName: "Lister User",
//       rating: 4,
//       review: "Great work!",
//       createdAt: Timestamp.now(),
//     };

//     // Simulate data fetching
//     setGig(mockGig);
//     setApplication(mockApplication);
//     setRating(mockRating);
//   }, [chat]);

//   if (!gig) {
//     return <div className="card">Loading...</div>;
//   }

//   const applicantId = application?.applicantId;
//   const listerId = gig.listerId;

//   if (isLister) {
//     // Lister views
//     if (gig.status === "open" && !application) {
//       // Case 1: Gig open, no application
//       return (
//         <div className="card">
//           <p>Gig Status: Open</p>
//           <p>No applications have been received yet. You can invite users to apply via message.</p>
//         </div>
//       );
//     } else if (gig.status === "open" && application?.status === "pending") {
//       // Case 2: Gig open, application pending
//       return (
//         <div className="card">
//           <p>Gig Status: Open</p>
//           <button onClick={() => console.log(`Assigning gig to ${applicantId}`)}>Assign gig to {applicantId}</button>
//           <button onClick={() => console.log(`Rejecting application ${application?.applicationId}`)}>Reject {applicantId}'s application</button>
//         </div>
//       );
//     } else if (gig.status === "open" && application?.status === "canceled") {
//       // Case 3: Gig open, application canceled
//       return (
//         <div className="card">
//           <p>Application Status: Canceled</p>
//           <p>{applicantId} has canceled their application.</p>
//         </div>
//       );
//     } else if (gig.status === "open" && application?.status === "rejected") {
//       // Case 4: Gig open, application rejected
//       return (
//         <div className="card">
//           <p>Application Status: Rejected</p>
//           <p>You have rejected {applicantId}'s application.</p>
//         </div>
//       );
//     } else if (gig.status === "in-progress" && application?.status === "assigned") {
//       // Case 5: Gig in-progress, application assigned
//       return (
//         <div className="card">
//           <p>Gig Status: In Progress</p>
//           <p>Gig assigned to {gig.selectedApplicantId}. Gig is ongoing.</p>
//         </div>
//       );
//     } else if (gig.status === "awaiting-lister-completion" && application?.status === "assigned") {
//       // Case 6: Gig awaiting lister completion, application assigned
//       return (
//         <div className="card">
//           <p>Gig Status: Awaiting Lister Completion</p>
//           <p>{gig.selectedApplicantId} has marked the gig as complete. Confirm to release payment.</p>
//           <button onClick={() => console.log("Marking gig as complete")}>Confirm Completion</button>
//         </div>
//       );
//     } else if (gig.status === "problem-reported" && application?.status === "assigned") {
//       // Case 7: Gig problem, application assigned
//       return (
//         <div className="card">
//           <p>Gig Status: Problem Reported</p>
//           <p>A problem has been reported regarding this gig. Please check your messages for details.</p>
//         </div>
//       );
//     } else if (gig.status === "completed" && !rating && application?.status === "assigned") {
//       // Case 8: Gig completed, application assigned
//       return (
//         <div className="card">
//           <p>Gig Status: Completed</p>
//           <p>Rate {gig.selectedApplicantId}'s work.</p>
//           <form
//             onSubmit={(e) => {
//               e.preventDefault();
//               const formData = new FormData(e.target as HTMLFormElement);
//               const rating = Number(formData.get("rating"));
//               const comment = formData.get("comment") as string;
//               console.log("Rating submitted", { rating, comment });
//             }}
//           >
//             <input name="rating" type="number" min="1" max="5" placeholder="Rate out of 5" required />
//             <textarea name="comment" placeholder="Leave a comment" required />
//             <button type="submit">Submit Rating</button>
//           </form>
//         </div>
//       );
//     } else if (gig.status === "rated" && rating && application?.status === "assigned") {
//       // Case 9: Gig rated, application assigned
//       return (
//         <div className="card">
//           <p>Gig Status: Rated</p>
//           <p>You rated {gig.selectedApplicantId}: {rating.rating} stars.</p>
//           <p>{rating.review}</p>
//         </div>
//       );
//     } else if (gig.status === "deleted" && !application) {
//       // Case 11: Gig deleted, no application
//       return (
//         <div className="card">
//           <p>Gig Status: Deleted</p>
//           <p>This gig has been deleted.</p>
//         </div>
//       );
//     }
//   } else {
//     // Applicant views
//     if (gig.status === "open" && !application) {
//       // Case 1: Gig open, no application
//       return (
//         <div className="card">
//           <p>Gig Status: Open</p>
//           <p>You have not applied to this gig.</p>
//           <button onClick={() => console.log("Applying to gig")}>Apply to Gig</button>
//         </div>
//       );
//     } else if (gig.status === "open" && application?.status === "pending") {
//       // Case 2: Gig open, application pending
//       return (
//         <div className="card">
//           <p>Gig Status: Open</p>
//           <p>Application Status: Pending</p>
//           <p>Wait for {listerId} to assign the gig to you.</p>
//           <button onClick={() => console.log("Canceling application")}>Cancel Application</button>
//         </div>
//       );
//     } else if (gig.status === "open" && application?.status === "canceled") {
//       // Case 3: Gig open, application canceled
//       return (
//         <div className="card">
//           <p>Application Status: Canceled</p>
//           <p>You have canceled your application.</p>
//         </div>
//       );
//     } else if (gig.status === "in-progress" && application?.status === "assigned") {
//       // Case 5: Gig in-progress, application assigned
//       return (
//         <div className="card">
//           <p>Gig Status: In Progress</p>
//           <p>Application Status: Assigned</p>
//           <p>{listerId} has assigned the gig to you. Complete it by the due date.</p>
//           <button onClick={() => console.log("Marking gig as complete")}>Complete Gig</button>
//           <button onClick={() => console.log("Canceling gig")}>Cancel Gig</button>
//         </div>
//       );
//     } else if (gig.status === "awaiting-lister-completion" && application?.status === "assigned") {
//       // Case 6: Gig awaiting lister completion, application assigned
//       return (
//         <div className="card">
//           <p>You have marked the gig as completed. Wait for {listerId} to confirm completion and release payment.</p>
//         </div>
//       );
//     } else if (gig.status === "problem-reported" && application?.status === "assigned") {
//       // Case 7: Gig problem, application assigned
//       return (
//         <div className="card">
//           <p>Gig Status: Problem Reported</p>
//           <p>A problem has been reported for this gig. Please contact {listerId} for more information.</p>
//         </div>
//       );
//     } else if (gig.status === "completed" && !rating && application?.status === "assigned") {
//       // Case 10: Gig completed, applicant rating lister
//       return (
//         <div className="card">
//           <p>Gig completed. You will receive payment in your wallet. Rate {listerId}.</p>
//           <form
//             onSubmit={(e) => {
//               e.preventDefault();
//               const formData = new FormData(e.target as HTMLFormElement);
//               const rating = Number(formData.get("rating"));
//               const comment = formData.get("comment") as string;
//               console.log("Rating submitted", { rating, comment });
//             }}
//           >
//             <input name="rating" type="number" min="1" max="5" placeholder="Rate out of 5" required />
//             <textarea name="comment" placeholder="Leave a comment" required />
//             <button type="submit">Submit Rating</button>
//           </form>
//         </div>
//       );
//     } else if (gig.status === "rated" && rating && application?.status === "assigned") {
//       // Case 12: Gig completed, application rated
//       return (
//         <div className="card">
//           <p>Gig completed. You rated {listerId}: {rating.rating} stars.</p>
//           <p>{rating.review}</p>
//         </div>
//       );
//     }
//   }

//   return <div className="card">Error: Invalid state</div>;
// };

// export default ChatCard;



import React, { useEffect, useState } from "react";
import { User, Gig, Application, Chat, Rating } from "../../utils/database/schema";
import CustomButton from "../Buttons/CustomButton";

const ChatCard: React.FC<{ chat: Chat; userId: string }> = ({ chat, userId }) => {
  const [gig, setGig] = useState<Gig | null>(null);
  const [application, setApplication] = useState<Application | null>(null);
  const [rating, setRating] = useState<Rating | null>(null);
  const isLister = gig?.listerId === userId;

  useEffect(() => {
    const fetchChatData = async () => {
      // Fetch gig, application, and rating data
      const gigData = await getGigById(chat.gigId); // Fetch gig data
      const appData = await getApplicationByGigAndApplicant(chat.gigId, userId); // Fetch application data
      const ratingData = gigData?.status === "rated" ? await getRatingByGig(chat.gigId) : null; // Fetch rating if applicable

      setGig(gigData);
      setApplication(appData);
      setRating(ratingData);
    };

    fetchChatData();
  }, [chat, userId]);

  if (!gig) {
    return (
      <div className="max-w-sm p-6 bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700">
        Loading...
      </div>
    );
  }

  const applicantId = application?.applicantId;
  const listerId = gig.listerId;

  // Handle different gig and application status cases
  const renderListerView = () => {
    switch (gig.status) {
      case "open":
        if (!application) {
          return (
            <>
              <p className="mb-2">Gig Status: Open</p>
              <p className="text-gray-500 dark:text-gray-400">
                No applications received yet. Invite users to apply.
              </p>
            </>
          );
        }
        if (application.status === "pending") {
          return (
            <>
              <p className="mb-2">Gig Status: Open</p>
              <CustomButton
                label={`Assign gig to ${applicantId}`}
                onClick={() => assignApplicantToGig(gig.gigId, applicantId!)}
                color="primary"
                size="medium"
              />
              <CustomButton
                label={`Reject ${applicantId}'s application`}
                onClick={() => cancelApplication(application.applicationId, "discarded")}
                color="red"
                size="medium"
              />
            </>
          );
        }
        break;

      case "in-progress":
        if (application?.status === "assigned") {
          return (
            <>
              <p className="mb-2">Gig Status: In Progress</p>
              <CustomButton
                label="Cancel Assignment"
                onClick={() => cancelGig(gig.gigId)}
                color="red"
                size="medium"
              />
            </>
          );
        }
        break;

      case "awaiting-confirmation":
        if (application?.status === "awaiting-lister-completion") {
          return (
            <>
              <p className="mb-2">Gig Status: Awaiting Confirmation</p>
              <CustomButton
                label="Confirm Completion"
                onClick={() => confirmGigCompletion(gig.gigId)}
                color="green"
                size="medium"
              />
              <CustomButton
                label="Report Problem"
                onClick={() => reportGigProblem(gig.gigId)}
                color="yellow"
                size="medium"
              />
            </>
          );
        }
        break;

      case "completed":
        if (!rating) {
          return (
            <CustomButton
              label="Rate Applicant"
              onClick={() => console.log(`Rate Applicant ${applicantId}`)}
              color="primary"
              size="medium"
            />
          );
        }
        break;

      case "rated":
        return (
          <CustomButton
            label={`See Rating for ${applicantId}`}
            onClick={() => console.log(`Viewing rating for ${applicantId}`)}
            color="gray"
            size="medium"
          />
        );

      case "deleted":
        return <p className="text-gray-500 dark:text-gray-400">Gig deleted.</p>;
    }
  };

  const renderApplicantView = () => {
    switch (gig.status) {
      case "open":
        if (!application) {
          return (
            <CustomButton
              label="Apply to Gig"
              onClick={() => console.log("Applying to gig")}
              color="primary"
              size="medium"
            />
          );
        }
        if (application.status === "pending") {
          return (
            <CustomButton
              label="Cancel Application"
              onClick={() => cancelApplication(application.applicationId, "canceled")}
              color="red"
              size="medium"
            />
          );
        }
        break;

      case "in-progress":
        if (application?.status === "assigned") {
          return (
            <CustomButton
              label="Mark Gig as Complete"
              onClick={() => console.log("Marking gig as complete")}
              color="green"
              size="medium"
            />
          );
        }
        break;

      case "awaiting-confirmation":
        if (application?.status === "awaiting-lister-completion") {
          return <p className="text-gray-500 dark:text-gray-400">Waiting for lister to confirm.</p>;
        }
        break;

      case "completed":
        if (!rating) {
          return (
            <CustomButton
              label="Rate Lister"
              onClick={() => console.log(`Rate Lister ${listerId}`)}
              color="primary"
              size="medium"
            />
          );
        }
        break;

      case "rated":
        return (
          <CustomButton
            label={`See Rating for ${listerId}`}
            onClick={() => console.log(`Viewing rating for ${listerId}`)}
            color="gray"
            size="medium"
          />
        );

      case "deleted":
        return <p className="text-gray-500 dark:text-gray-400">Gig no longer available.</p>;
    }
  };

  return (
    <div className="max-w-sm p-6 bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700">
      <h5 className="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
        {gig.title}
      </h5>
      <p className="mb-3 font-normal text-gray-700 dark:text-gray-400">{gig.description}</p>
      {isLister ? renderListerView() : renderApplicantView()}
    </div>
  );
};

export default ChatCard;
