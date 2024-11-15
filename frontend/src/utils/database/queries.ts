import { query, where, orderBy, getDocs, Firestore } from "firebase/firestore";
import {
  gigsRef,
  applicationsRef,
  messagesRef,
  ratingsRef,
  transactionsRef,
} from "./collections";

const getOpenGigs = async (db: Firestore, category?: string) => {
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

  return (await getDocs(q)).docs;
};

const getGigApplications = async (db: Firestore, gigId: string) => {
  const q = query(applicationsRef(db), where("gigId", "==", gigId));
  return (await getDocs(q)).docs;
};

const getUserApplications = async (db: Firestore, userId: string) => {
  const q = query(applicationsRef(db), where("applicantId", "==", userId));
  return (await getDocs(q)).docs;
};

const getApplicationMessages = async (db: Firestore, applicationId: string) => {
  const q = query(
    messagesRef(db),
    where("applicationId", "==", applicationId),
    orderBy("sentAt"),
  );
  return (await getDocs(q)).docs;
};

// Rating queries
const getUserRatings = async (db: Firestore, userId: string) => {
  const q = query(ratingsRef(db), where("toUserId", "==", userId));
  return (await getDocs(q)).docs;
};

const getUserTransactions = async (db: Firestore, userId: string) => {
  const q = query(
    transactionsRef(db),
    where("senderId", "==", userId),
    where("receiverId", "==", userId),
  );
  return (await getDocs(q)).docs;
};

const getGigTransactions = async (db: Firestore, gigId: string) => {
  const q = query(transactionsRef(db), where("gigId", "==", gigId));
  return (await getDocs(q)).docs;
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