import { Timestamp } from "firebase/firestore";

export interface User {
  email: string;
  displayName: string;
  profile: {
    bio: string;
    credits: number;
  };
  completedGigs: string[];
  activeGigs: string[];
  listedGigs: string[];
  averageRating: number;
}

export interface Gig {
  title: string;
  description: string;
  category: string;
  price: number;
  dueDate: Timestamp;
  status: "open" | "in-progress" | "completed";
  listerId: string;
  selectedApplicantId?: string;
  createdAt: Timestamp;
  applicantIds: string[];
}

export interface Application {
  gigId: string;
  applicantId: string;
  listerId: string;
  status: "pending" | "accepted" | "rejected";
  appliedAt: Timestamp;
  coverLetter: string;
}

export interface Message {
  applicationId: string;
  senderId: string;
  receiverId: string;
  lastSent: Timestamp;
}

export interface Rating {
  toUserId: string;
  byUserId: string;
  byUserDisplayName: string;
  rating: number;
  review: string;
  createdAt: Timestamp;
}

export interface Transaction {
  senderId: string;
  receiverId: string;
  gigId: string;
  amount: number;
  createdAt: Timestamp;
}