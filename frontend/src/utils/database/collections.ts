// import { db } from '../firebase/firebaseConfig';
import { collection, CollectionReference, Firestore } from 'firebase/firestore';
import { User, Gig, Application, ChatMessage, Rating, Transaction, Notification , Chat} from './schema';

export const usersRef = (db: Firestore) => collection(db, 'users') as CollectionReference<User>;
export const gigsRef = (db: Firestore) =>  collection(db, 'gigs') as CollectionReference<Gig>;
export const applicationsRef = (db: Firestore) => collection(db, 'applications') as CollectionReference<Application>;
export const chatsRef = (db: Firestore) => collection(db, 'chats') as CollectionReference<Chat>;
export const chatMessagesRef = (db: Firestore) => collection(db, `chatMessages`) as CollectionReference<ChatMessage>;
export const ratingsRef = (db: Firestore) => collection(db, 'ratings') as CollectionReference<Rating>;
export const transactionsRef = (db: Firestore) => collection(db, 'transactions') as CollectionReference<Transaction>;
export const notificationsRef = (db: Firestore) => collection(db, 'notifications') as CollectionReference<Notification>;
