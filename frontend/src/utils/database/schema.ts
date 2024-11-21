// import { Timestamp } from "firebase/firestore";

// export interface User {
//   email: string;
//   displayName: string;
//   profile: {
//     bio: string;
//     credits: number;
//     picture?: string;
//     location: string;
//   };
//   completedGigs: string[];
//   activeGigs: string[];
//   listedGigs: string[];
//   averageRating: number;
// }

// export interface Gig {
//   title: string;
//   description: string;
//   category: string;
//   price: number;
//   dueDate: Timestamp;
//   status: "open" | "in-progress" | "completed";
//   listerId: string;
//   selectedApplicantId?: string;
//   createdAt: Timestamp;
//   applicantIds: string[];
// }

// export interface Application {
//   gigId: string;
//   applicantId: string;
//   listerId: string;
//   status: "pending" | "accepted" | "rejected";
//   appliedAt: Timestamp;
//   coverLetter: string;
// }

// export interface Message {
//   applicationId: string;
//   senderId: string;
//   receiverId: string;
//   lastSent: Timestamp;
// }

// export interface Rating {
//   toUserId: string;
//   byUserId: string;
//   byUserDisplayName: string;
//   rating: number;
//   review: string;
//   createdAt: Timestamp;
// }

// export interface Transaction {
//   senderId: string;
//   receiverId: string;
//   gigId: string;
//   amount: number;
//   createdAt: Timestamp;
// }




/////////////////////////////////////////  OPTIMIZED SCHEMA (NEEDS REVIEWING) //////////////////////////////


// make sure lister cant delete gig until they cancel gig first, which requires applicant's confirmation
// Applicant cannot cancel after gig assignment.



import { Timestamp } from "firebase/firestore";

export interface User {
  userId: string; 
  email: string;
  displayName: string;
  profile: {
    bio: string;
    credits: number; 
    picture?: string;
    location: string;
  };
  stats: {
    completedGigs: number; 
    averageRating: number; 
  };
  listedGigs: string[]; // gig IDs
  activeApplications: string[]; // application IDs (for gigs they applied to that are still open)
  chatIds: string[]; // chat IDs where the user is a participant
}


export interface Gig {
  gigId: string;
  title: string;
  description: string;
  category: string;
  price: number;
  dueDate: Timestamp;
  status: "open" | "in-progress" | "awaiting-confirmation" | "completed" | "rated" | "canceled" | "deleted" | "problem-reported"; 
  listerId: string;
  selectedApplicantId?: string;
  applications: string[]; // list of application IDs
  createdAt: Timestamp;
  ratingId?: string[]; // rating ID if the gig is completed and rated
}
// gig status is what the lister sees in the chat
// open = gig is posted and you haven't assigned it to anyone yet
// deleted = you deleted gig 
// in-progress = gig has been assigned to [selectedApplicant]
// canceled = you previously assigned this gig to this user but you mutually canceled it, wait for applicant to confirm
// awaiting-confirmation = applicant has reported to have completed the gig, now you need to confirm to release the payement 
// completed = gig is completed and confirmed but you haven't rated applicant
// problem-reported = you have reported a problem with the applicant's work
// rated = gig completed and rated --> see rating / list new gig


export interface Application {
  applicationId: string;
  gigId: string;
  applicantId: string;
  listerId: string;
  coverLetter: string;
  status: "pending" | "discarded" | "canceled" | "assigned" | "awaiting-lister-completion" | "completed" | "rated" ;
  appliedAt: Timestamp;
  chatId: string;
}
// Application status is what the applicant sees in the chat 
// no application = apply to gig
// pending = you have applied to this gig but lister hasnt assigned it to you or anyone else
// discarded = lister has either deleted gig or assigned it to someone else
// canceled = you or lister have canceled your application
// assigned = lister assigned gig to you, added to your schedule and you are working on it / will show up on the scheduled day
// awaiting-lister-completion = you have finished the gig work and have reported the gig to be completed, now wait for lister's confirmation
// completed = gig marked completed from both sides and your money had been transferred to your wallet, but you haven't rated the lister yet
// rated = you have completed gig and rated the lister



export interface Chat {
  chatId: string;
  gigId: string;
  participants: string[]; // (applicant and lister)
  applicationID: string;
  messages: ChatMessage[];
}


export interface ChatMessage {
  messageId: string; 
  senderId: string; 
  content: string; 
  timestamp: Timestamp; 
  isRead: boolean;
}


export interface Rating {
  ratingId: string; // Unique rating ID
  gigId: string; // ID of the gig being rated
  toUserId: string;
  byUserId: string; 
  byUserDisplayName: string; 
  rating: number; 
  review: string; 
  createdAt: Timestamp;
}




export interface Transaction {
  transactionId: string; // transaction ID
  senderId: string; 
  receiverId: string; 
  gigId: string; 
  amount: number; 
  createdAt: Timestamp;
}

