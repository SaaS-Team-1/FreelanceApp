import {
  addDoc,
  updateDoc,
  doc,
  serverTimestamp,
  Firestore,
} from "firebase/firestore";
import { Gig, Application, Rating } from "./schema";
import { gigsRef, applicationsRef, ratingsRef } from "./collections";

const createGig = async (
  db: Firestore,
  gigData: Omit<Gig, "createdAt" | "applicantIds">,
) => {
  return await addDoc(gigsRef(db), {
    ...gigData,
    createdAt: serverTimestamp(),
    applicantIds: [],
  });
};

const applyToGig = async (
  db: Firestore,
  applicationData: Omit<Application, "appliedAt">,
) => {
  return await addDoc(applicationsRef(db), {
    ...applicationData,
    appliedAt: serverTimestamp(),
  });
};

const leaveRating = async (
  db: Firestore,
  ratingData: Omit<Rating, "createdAt">,
) => {
  return await addDoc(ratingsRef(db), {
    ...ratingData,
    createdAt: serverTimestamp(),
  });
};

const acceptApplication = async (
  db: Firestore,
  applicationId: string,
  selectedApplicantId: string,
) => {
  const applicationRef = doc(applicationsRef(db), applicationId);
  await updateDoc(applicationRef, {
    status: "accepted",
  });

  const gigRef = doc(gigsRef(db), applicationId);
  await updateDoc(gigRef, {
    selectedApplicantId,
  });
};

export default { createGig, applyToGig, leaveRating, acceptApplication };
