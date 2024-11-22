// import { db } from '../firebase/firebaseConfig';
import { collection, CollectionReference, Firestore } from 'firebase/firestore';
import { User, Gig, Application, Message, Rating, Transaction, Notification } from './schema';
import { ColHTMLAttributes } from 'react';

export const usersRef = (db: Firestore) => collection(db, 'users') as CollectionReference<User>;
export const gigsRef = (db: Firestore) =>  collection(db, 'gigs') as CollectionReference<Gig>;
export const applicationsRef = (db: Firestore) => collection(db, 'applications') as CollectionReference<Application>;
export const messagesRef = (db: Firestore) => collection(db, 'messages') as CollectionReference<Message>;
export const ratingsRef = (db: Firestore) => collection(db, 'ratings') as CollectionReference<Rating>;
export const transactionsRef = (db: Firestore) => collection(db, 'transactions') as CollectionReference<Transaction>;
export const notificationsRef = (db: Firestore) => collection(db, 'notifications') as CollectionReference<Notification>;
