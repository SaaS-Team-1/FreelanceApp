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

///////////////////////////  ADDED MUTATION QUERIES /////////////////////

const updateGigStatus = async (
  db: Firestore,
  gigId: string,
  newStatus: Gig["status"],
) => {
  const gigRef = doc(gigsRef(db), gigId);
  await updateDoc(gigRef, { status: newStatus });
};

const assignApplicantToGig = async (
  db: Firestore,
  gigId: string,
  applicantId: string,
) => {
  const gigRef = doc(gigsRef(db), gigId);
  await updateDoc(gigRef, {
    selectedApplicantId: applicantId,
    status: "in-progress",
  });
};

const cancelGig = async (db: Firestore, gigId: string) => {
  const gigRef = doc(gigsRef(db), gigId);
  await updateDoc(gigRef, { status: "canceled" });
};

const cancelApplication = async (
  db: Firestore,
  applicationId: string,
  newStatus: Application["status"],
) => {
  const applicationRef = doc(applicationsRef(db), applicationId);
  await updateDoc(applicationRef, { status: newStatus });
};

const confirmGigCompletion = async (db: Firestore, gigId: string) => {
  const gigRef = doc(gigsRef(db), gigId);
  await updateDoc(gigRef, { status: "completed" });
};

const updateGigRatingStatus = async (
  db: Firestore,
  gigId: string,
  ratingId: string,
) => {
  const gigRef = doc(gigsRef(db), gigId);
  await updateDoc(gigRef, { ratingId, status: "rated" });
};

const reportGigProblem = async (db: Firestore, gigId: string) => {
  const gigRef = doc(gigsRef(db), gigId);
  await updateDoc(gigRef, { status: "problem-reported" });
};

const reopenGig = async (db: Firestore, gigId: string) => {
  const gigRef = doc(gigsRef(db), gigId);
  await updateDoc(gigRef, { status: "open", selectedApplicantId: null });
};

export default {
  createGig,
  applyToGig,
  leaveRating,
  acceptApplication,
  updateGigStatus,
  assignApplicantToGig,
  cancelGig,
  cancelApplication,
  confirmGigCompletion,
  updateGigRatingStatus,
  reportGigProblem,
  reopenGig,
};
