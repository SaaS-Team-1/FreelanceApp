// import { getFirestoreInstance } from '../firebase/firebaseConfig';
import {
  addDoc,
  updateDoc,
  doc,
  serverTimestamp,
  Firestore,
} from "firebase/firestore";
import { User, Gig, Application, Message, Rating } from "./schema";
import {
  usersRef,
  gigsRef,
  applicationsRef,
  messagesRef,
  ratingsRef,
} from "./collections";

const createGig = (
  db: Firestore,
  gigData: Omit<Gig, "createdAt" | "applicantIds">,
) => {
  return addDoc(gigsRef(db), {
    ...gigData,
    createdAt: serverTimestamp(),
    applicantIds: [],
  });
};

const applyToGig = (
  db: Firestore, 
  applicationData: Omit<Application, 'appliedAt'>
) => {
  return addDoc(applicationsRef(db), {
    ...applicationData,
    appliedAt: serverTimestamp()
  });
};

const leaveRating = (
  db: Firestore,
  ratingData: Omit<Rating, 'createdAt'>
) => {
  return addDoc(ratingsRef(db), {
    ...ratingData,
    createdAt: serverTimestamp()
  });
};

// sendMessage: async (messageData: Omit<Message, 'sentAt'>) => {
//   const newMessageRef = await addDoc(messagesRef, {
//     ...messageData,
//     sentAt: serverTimestamp()
//   });
//   return newMessageRef.id;
// },



const acceptApplication = (
  db: Firestore, 
  applicationId: string, 
  selectedApplicantId: string
) => {
  const applicationRef = doc(applicationsRef(db), applicationId);
  updateDoc(applicationRef, {
    status: 'accepted'
  });

  const gigRef = doc(gigsRef(db), applicationId);
  updateDoc(gigRef, {
    selectedApplicantId
  });

};

// updateUserInfo: async (userId: string, userData: Partial<Omit<User, 'userId'>>) => {
//   const userRef = doc(usersRef, userId);
//   await updateDoc(userRef, userData);
// }

export default { createGig, applyToGig, leaveRating, acceptApplication };
