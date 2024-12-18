// make sure lister can only delete gig if status is open
// Applicant nor lister cannot cancel after gig assignment.
// no duplicate applications: you cannot create two applications with the same applicant and gig id
// you should not be able to see your gigs in home page
// you should not be able to apply to your own gig
// once applied you cannot see it in home page --> applicant cannot apply twice to a gig
// no duplicate chats: you cannot create two chats with same gig id, same lister id, same applicant id
// when lister deletes set application status to discarded

import { Timestamp } from "firebase/firestore";

export interface User {
  userId: string;
  email: string;
  displayName: string;
  coins?: number;
  profile: {
    bio: string;
    credits: number;
    picture?: string;
    location: string;
    degree?: string;
    skills?: string;
    languages?: string;
    faculty?: string;
  };
  completedGigs: number;
  averageRating: number;
  loginStreak: number;
  lastActivity: Timestamp;
  firstLogin: boolean;
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
    | "deleted";
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
  listerId: string;
  applicantId: string;
  applicationId: string;
  lastUpdate: Timestamp;
}

export interface ChatMessage {
  chatmessageId: string;
  senderId: string;
  sentToId: string; // id of user message is sent to
  content: string;
  timestamp: Timestamp;
  chatId: string;
  isRead: boolean; // is it read by the user it is sent to
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
  ownerId: string;
  ownerName: string;
  thirdPartyId?: string;
  thirdPartyName?: string;
  gigId?: string;
  gigName?: string;
  amount: number;
  createdAt: Timestamp;
  onHold: boolean;
  kind: "deposit" | "withdraw" | "send" | "receive";
}

export interface Notification {
  notificationId: string;
  userId: string;
  notificationMessage: string;
  createdAt: Timestamp;
}
