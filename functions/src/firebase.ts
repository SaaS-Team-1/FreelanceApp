import * as admin from "firebase-admin";

admin.initializeApp();

export const db = admin.firestore();
export const auth = admin.auth();

export const usersRef = db.collection("users");
export const gigsRef = db.collection("gigs");
export const applicationsRef = db.collection("applications");
export const chatsRef = db.collection("chats");
export const chatMessagesRef = db.collection(`chatMessages`);
export const ratingsRef = db.collection("ratings");
export const transactionsRef = db.collection("transactions");
export const notificationsRef = db.collection("notifications");