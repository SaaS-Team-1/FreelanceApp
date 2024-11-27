// import { db } from '../firebase/firebaseConfig';
import { collection, CollectionReference, Firestore } from "firebase/firestore";
import {
  User,
  Gig,
  Application,
  ChatMessage,
  Rating,
  Transaction,
  Notification,
  Chat,
} from "./schema";

export const usersRef = (db: Firestore) =>
  collection(db, "users") as CollectionReference<Partial<User>>;
export const gigsRef = (db: Firestore) =>
  collection(db, "gigs") as CollectionReference<Partial<Gig>>;
export const applicationsRef = (db: Firestore) =>
  collection(db, "applications") as CollectionReference<Partial<Application>>;
export const chatsRef = (db: Firestore) =>
  collection(db, "chats") as CollectionReference<Partial<Chat>>;
export const chatMessagesRef = (db: Firestore) =>
  collection(db, `chatMessages`) as CollectionReference<Partial<ChatMessage>>;
export const ratingsRef = (db: Firestore) =>
  collection(db, "ratings") as CollectionReference<Partial<Rating>>;
export const transactionsRef = (db: Firestore) =>
  collection(db, "transactions") as CollectionReference<Partial<Transaction>>;
export const notificationsRef = (db: Firestore) =>
  collection(db, "notifications") as CollectionReference<Partial<Notification>>;
