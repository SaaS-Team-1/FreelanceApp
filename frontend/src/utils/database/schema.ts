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
}

export interface Gig {
  gigId: string;
  title: string;
  description: string;
  location: string;
  category: string;
  price: number;
  dueDate: Timestamp;
  status:
    | "open"
    | "in-progress"
    | "awaiting-confirmation"
    | "completed"
    | "deleted"
    | "problem-reported";
  listerId: string;
  selectedApplicantId?: string;
  updatedAt: Timestamp;
  createdAt: Timestamp;
}
// gig status is what the lister sees in the chat
// open = gig is posted and you haven't assigned it to anyone yet
// deleted = you deleted gig
// in-progress = gig has been assigned to [selectedApplicant]
// awaiting-confirmation = applicant has reported to have completed the gig, now you need to confirm to release the payement
// completed = gig is completed and confirmed but you haven't rated applicant
// problem-reported = you have reported a problem with the applicant's work

export interface Application {
  applicationId: string;
  gigId: string;
  applicantId: string;
  listerId: string;
  coverLetter: string;
  status:
    | "pending"
    | "discarded"
    | "assigned"
    | "awaiting-lister-completion"
    | "completed";
  appliedAt: Timestamp;
  chatId: string;
}
// Application status is what the applicant sees in the chat
// no application = apply to gig
// pending = you have applied to this gig but lister hasnt assigned it to you or anyone else
// discarded = lister has either deleted gig or assigned it to someone else
// assigned = lister assigned gig to you, added to your schedule and you are working on it / will show up on the scheduled day
// awaiting-lister-completion = you have finished the gig work and have reported the gig to be completed, now wait for lister's confirmation
// completed = gig marked completed from both sides and your money had been transferred to your wallet, but you haven't rated the lister yet

export interface Chat {
  chatId: string;
  gigId: string;
  userId: string; // (applicant and lister)
  applicationId?: string;
}

export interface ChatMessage {
  chatmessageId: string;
  senderId: string;
  content: string;
  timestamp: Timestamp;
  chatId: string;
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
  senderId?: string;
  receiverId: string;
  gigId?: string;
  amount: number;
  createdAt: Timestamp;
  kind: "deposit" | "withdraw" | "send" | "recieve";
}

export interface Notification {
  userId: string;
  type: "application" | "message" | "gig_status" | "rating" | "transaction";
  relatedEntityId: string;
  notificationMessage: string;
  isRead: boolean;
  createdAt: Timestamp;
  navigationPath: string;
  isDeleted: boolean;
}
