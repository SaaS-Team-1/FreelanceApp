import { doc, setDoc, Timestamp } from "firebase/firestore";
import { faker } from "@faker-js/faker";
import { addDoc, Firestore } from "firebase/firestore";
import {
  gigsRef,
  usersRef,
  applicationsRef,
  messagesRef,
  ratingsRef,
  transactionsRef,
} from "./collections";
import { User, Gig, Application, Message, Rating, Transaction } from "./schema";
import { Auth, createUserWithEmailAndPassword } from "firebase/auth";

// Configuration
const NUM_USERS = 20;
const GIGS_PER_USER = 3;
const APPLICATIONS_PER_GIG = 2;
const MESSAGES_PER_APPLICATION = 3;
const COMPLETION_RATE = 0.7; // 70% of gigs will be completed
const RATING_RATE = 0.8; // 80% of completed gigs will have ratings

const GIG_CATEGORIES = [
  "Web Development",
  "Graphic Design",
  "Content Writing",
  "Digital Marketing",
  "Video Editing",
  "Virtual Assistant",
  "Data Entry",
  "Translation",
];

const getRecentDate = () => {
  const date = new Date();
  date.setDate(date.getDate() - faker.number.int({ min: 0, max: 30 }));
  return Timestamp.fromDate(date);
};

const getFutureDate = () => {
  const date = new Date();
  date.setDate(date.getDate() + faker.number.int({ min: 5, max: 30 }));
  return Timestamp.fromDate(date);
};

export async function seedDatabase(db: Firestore, auth: Auth) {
  console.log("Starting database seeding...");
  const userRefs: { id: string; user: User }[] = [];
  const gigRefs: { id: string; gig: Gig }[] = [];
  const applicationRefs: { id: string; application: Application }[] = [];

  // Create users
  console.log("Creating users...");
  for (let i = 0; i < NUM_USERS; i++) {
    const email = faker.internet.email();

    const authUser = (
      await createUserWithEmailAndPassword(auth, email, "password123")
    ).user;

    const userData: User = {
      email: email,
      displayName: faker.person.fullName(),
      profile: {
        bio: faker.lorem.paragraph(),
        credits: faker.number.int({ min: 100, max: 1000 }),
      },
      completedGigs: [],
      activeGigs: [],
      listedGigs: [],
      averageRating: faker.number.float({
        min: 3.5,
        max: 5,
        fractionDigits: 1,
      }),
    };

    await setDoc(doc(db, "users", authUser.uid), userData);
    userRefs.push({ id: authUser.uid, user: userData });
  }

  // Create gigs
  console.log("Creating gigs...");
  for (const userRef of userRefs) {
    for (let i = 0; i < GIGS_PER_USER; i++) {
      const isCompleted = Math.random() < COMPLETION_RATE;
      const isInProgress = !isCompleted && Math.random() < 0.5;

      // For completed or in-progress gigs, we'll set the selected applicant later
      const gigData: Gig = {
        title: faker.lorem.sentence(),
        description: faker.lorem.paragraphs(2),
        category: faker.helpers.arrayElement(GIG_CATEGORIES),
        price: faker.number.int({ min: 50, max: 500 }),
        dueDate: getFutureDate(),
        status: isCompleted
          ? "completed"
          : isInProgress
            ? "in-progress"
            : "open",
        listerId: userRef.id,
        applicantIds: [],
        createdAt: getRecentDate(),
        // Only set selectedApplicantId for completed/in-progress gigs, but we'll update it later
        selectedApplicantId: null as unknown as string | undefined,
      };

      const gigDoc = await addDoc(gigsRef(db), gigData);
      gigRefs.push({ id: gigDoc.id, gig: gigData });
      userRef.user.listedGigs.push(gigDoc.id);
    }
  }

  // Create applications and update gigs with selected applicants
  console.log("Creating applications...");
  for (const gigRef of gigRefs) {
    const availableApplicants = userRefs.filter(
      (u) => u.id !== gigRef.gig.listerId,
    );
    const applicationsForGig: string[] = [];

    for (let i = 0; i < APPLICATIONS_PER_GIG; i++) {
      const applicant = faker.helpers.arrayElement(availableApplicants);

      // Determine application status based on gig status
      let applicationStatus: Application["status"] = "pending";
      if (
        gigRef.gig.status === "completed" ||
        gigRef.gig.status === "in-progress"
      ) {
        // First application for non-open gigs will be accepted
        applicationStatus = i === 0 ? "accepted" : "rejected";
        // Set the selected applicant for the gig
        if (i === 0) {
          gigRef.gig.selectedApplicantId = applicant.id;
          // Update the gig document with the selected applicant
          await addDoc(gigsRef(db), {
            ...gigRef.gig,
            selectedApplicantId: applicant.id,
          });
        }
      }

      const applicationData: Application = {
        gigId: gigRef.id,
        applicantId: applicant.id,
        listerId: gigRef.gig.listerId,
        status: applicationStatus,
        coverLetter: faker.lorem.paragraphs(2),
        appliedAt: getRecentDate(),
      };

      const applicationDoc = await addDoc(applicationsRef(db), applicationData);
      applicationRefs.push({
        id: applicationDoc.id,
        application: applicationData,
      });
      applicationsForGig.push(applicant.id);
    }

    // Update gig with applicant IDs
    gigRef.gig.applicantIds = applicationsForGig;
  }

  // Create messages
  console.log("Creating messages...");
  for (const applicationRef of applicationRefs) {
    for (let i = 0; i < MESSAGES_PER_APPLICATION; i++) {
      const isFromLister = Math.random() > 0.5;

      const messageData: Message = {
        applicationId: applicationRef.id,
        senderId: isFromLister
          ? applicationRef.application.listerId
          : applicationRef.application.applicantId,
        receiverId: isFromLister
          ? applicationRef.application.applicantId
          : applicationRef.application.listerId,
        lastSent: getRecentDate(),
      };

      await addDoc(messagesRef(db), messageData);
    }
  }

  // Create ratings for completed gigs
  console.log("Creating ratings...");
  for (const gigRef of gigRefs.filter(
    (g) => g.gig.status === "completed" && g.gig.selectedApplicantId,
  )) {
    if (Math.random() < RATING_RATE) {
      const ratingData: Rating = {
        byUserId: gigRef.gig.listerId,
        byUserDisplayName: faker.internet.username(),
        toUserId: gigRef.gig.selectedApplicantId as string,
        rating: faker.number.int({ min: 3, max: 5 }),
        review: faker.lorem.paragraph(),
        createdAt: getRecentDate(),
      };

      await addDoc(ratingsRef(db), ratingData);
    }
  }

  // Create transactions for completed gigs
  console.log("Creating transactions...");
  for (const gigRef of gigRefs.filter(
    (g) => g.gig.status === "completed" && g.gig.selectedApplicantId,
  )) {
    const transactionData: Transaction = {
      senderId: gigRef.gig.listerId,
      receiverId: gigRef.gig.selectedApplicantId as string,
      gigId: gigRef.id,
      amount: gigRef.gig.price,
      createdAt: getRecentDate(),
    };

    await addDoc(transactionsRef(db), transactionData);
  }

  console.log("Database seeding completed!");

  return {
    users: userRefs.length,
    gigs: gigRefs.length,
    applications: applicationRefs.length,
  };
}
