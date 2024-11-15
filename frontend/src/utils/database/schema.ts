import { Timestamp } from 'firebase/firestore';
  
  export interface User {
    userId: string;
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
    status: 'open' | 'in-progress' | 'completed';
    listerId: string;
    selectedApplicantId?: string;
    createdAt: Timestamp;
    applicantIds: string[];
  }
  
  export interface Application {
    gigId: string;
    applicantId: string;
    listerId: string;
    status: 'pending' | 'accepted' | 'rejected';
    appliedAt: Timestamp;
    coverLetter: string;
  }
  
  export interface Message {
    applicationId: string;
    senderId: string;
    receiverId: string;
    content: string;
    sentAt: Timestamp;
  }
  
  export interface Rating {
    gigId: string;
    fromUserId: string;
    toUserId: string;
    rating: number;
    review: string;
    createdAt: Timestamp;
  }

  export interface Transaction {
    id: string;
    senderId: string;
    receiverId: string;
    gigId: string;
    amount: number;
    createdAt: Timestamp;
  }