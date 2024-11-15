import {
  query,
  where,
  orderBy,
  getDocs,
  addDoc,
  updateDoc,
  doc,
  Timestamp,
  getDoc,
  Firestore,
} from "firebase/firestore";
// import { db } from '../firebase/firebaseConfig';
import { User, Gig, Application, Message, Rating, Transaction } from "./schema";
import {
  gigsRef,
  applicationsRef,
  messagesRef,
  ratingsRef,
  transactionsRef,
} from "./collections";

const getOpenGigs = (db: Firestore, category?: string) => {
  const q = category
    ? query(
        gigsRef(db),
        where("status", "==", "open"),
        where("category", "==", category),
        orderBy("createdAt", "desc"),
      )
    : query(
        gigsRef(db),
        where("status", "==", "open"),
        orderBy("createdAt", "desc"),
      );
  return getDocs(q);
};

// Application queries
const getGigApplications = (db: Firestore, gigId: string) => {
  const q = query(applicationsRef(db), where("gigId", "==", gigId));
  return getDocs(q);
};

const getUserApplications = (db: Firestore, userId: string) => {
  const q = query(applicationsRef(db), where("applicantId", "==", userId));
  return getDocs(q);
};

// Message queries
const getApplicationMessages = (db: Firestore, applicationId: string) => {
  const q = query(
    messagesRef(db),
    where("applicationId", "==", applicationId),
    orderBy("sentAt"),
  );
  return getDocs(q);
};

// Rating queries
const getUserRatings = (db: Firestore, userId: string) => {
  const q = query(ratingsRef(db), where("toUserId", "==", userId));
  return getDocs(q);
};

// Add new document helpers
const createGig = (
  db: Firestore,
  gigData: Omit<Gig, "createdAt" | "applicantIds">,
) => {
  return addDoc(gigsRef(db), {
    ...gigData,
    createdAt: Timestamp.fromDate(new Date()),
    applicantIds: [],
  });
};

const createApplication = (
  db: Firestore,
  applicationData: Omit<Application, "appliedAt">,
) => {
  return addDoc(applicationsRef(db), {
    ...applicationData,
    appliedAt: Timestamp.fromDate(new Date()),
  });
};

const sendMessage = (db: Firestore, messageData: Omit<Message, "sentAt">) => {
  return addDoc(messagesRef(db), {
    ...messageData,
    sentAt: Timestamp.fromDate(new Date()),
  });
};

const getUserTransactions = (db: Firestore, userId: string) => {
  const q = query(
    transactionsRef(db),
    where("senderId", "==", userId),
    where("receiverId", "==", userId),
  );
  return getDocs(q);
};

const getGigTransactions = (db: Firestore, gigId: string) => {
  const q = query(transactionsRef(db), where("gigId", "==", gigId));
  return getDocs(q);
};

export default {
  getOpenGigs,
  getGigApplications,
  getUserApplications,
  getApplicationMessages,
  getUserRatings,
  getUserTransactions,
  getGigTransactions,
};
