import { doc, setDoc, Timestamp } from "firebase/firestore";
import { faker } from "@faker-js/faker";
import { addDoc, Firestore } from "firebase/firestore";
import {
  gigsRef,
  usersRef,
  applicationsRef,
  chatsRef,
  chatMessagesRef,
  ratingsRef,
  transactionsRef,
} from "./collections";
import {
  User,
  Gig,
  Application,
  Chat,
  ChatMessage,
  Rating,
  Transaction,
} from "./schema";
import { Auth, createUserWithEmailAndPassword } from "firebase/auth";

// Configuration
const NUM_USERS = 20;
const GIGS_PER_USER = 6;
const APPLICATIONS_PER_GIG = 4;
const MESSAGES_PER_CHAT = 3;
const COMPLETION_RATE = 0.2;
const RATING_RATE = 0.8;

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

const LOCATIONS = [
  "New York, NY",
  "Los Angeles, CA",
  "Chicago, IL",
  "Houston, TX",
  "Phoenix, AZ",
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
  const chatRefs: { id: string; chat: Chat }[] = [];

  // Create users
  console.log("Creating users...");
  for (let i = 0; i < NUM_USERS; i++) {
    const email = faker.internet.email();
    const authUser = await createUserWithEmailAndPassword(
      auth,
      email,
      "password123",
    );

    const userData: User = {
      userId: authUser.user.uid,
      email: email,
      displayName: faker.person.fullName(),
      profile: {
        bio: faker.lorem.paragraph(),
        credits: faker.number.int({ min: 100, max: 1000 }),
        picture: faker.image.avatar(),
        location: faker.helpers.arrayElement(LOCATIONS),
      },
      stats: {
        completedGigs: faker.number.int({ min: 0, max: 20 }),
        averageRating: faker.number.float({
          min: 3.5,
          max: 5,
          fractionDigits: 1,
        }),
      },
    };

    await setDoc(doc(db, "users", userData.userId), userData);
    userRefs.push({ id: userData.userId, user: userData });
  }

  // Create gigs
  console.log("Creating gigs...");
  for (const userRef of userRefs) {
    for (let i = 0; i < GIGS_PER_USER; i++) {
      const isCompleted = Math.random() < COMPLETION_RATE;
      const isInProgress = !isCompleted && Math.random() < 0.5;
      const isAwaitingConfirmation = !isCompleted && !isInProgress && Math.random() < 0.4;

      const gigStatus = isCompleted
        ? "completed"
        : isInProgress
        ? "in-progress"
        : isAwaitingConfirmation
        ? "awaiting-confirmation"
        : "open";

      const gigData: Gig = {
        gigId: faker.string.uuid(),
        title: faker.lorem.sentence(),
        description: faker.lorem.paragraphs(2),
        location: faker.helpers.arrayElement(LOCATIONS),
        category: faker.helpers.arrayElement(GIG_CATEGORIES),
        price: faker.number.int({ min: 50, max: 500 }),
        dueDate: getFutureDate(),
        status: gigStatus,
        listerId: userRef.id,
        selectedApplicantId: "",
        createdAt: getRecentDate(),
        updatedAt: getRecentDate(),
      };

      const gigDoc = await addDoc(gigsRef(db), gigData);
      gigData.gigId = gigDoc.id;
      gigRefs.push({ id: gigDoc.id, gig: gigData });
    }
  }

  // Create applications and chats
  console.log("Creating applications and chats...");
  for (const gigRef of gigRefs) {
    const availableApplicants = userRefs.filter(
      (u) => u.id !== gigRef.gig.listerId,
    );

    for (let i = 0; i < APPLICATIONS_PER_GIG; i++) {
      const applicant = faker.helpers.arrayElement(availableApplicants);
      let applicationStatus: Application["status"] = "pending";

      if (
        gigRef.gig.status === "completed" ||
        gigRef.gig.status === "in-progress" ||
        gigRef.gig.status === "awaiting-confirmation"
      ) {
        applicationStatus = i === 0 ? "assigned" : "discarded";
        if (i === 0) {
          gigRef.gig.selectedApplicantId = applicant.id;
          await setDoc(doc(db, "gigs", gigRef.id), gigRef.gig);
        }
      }

      // Create chat first to get chatId
      const chatData: Chat = {
        chatId: faker.string.uuid(),
        gigId: gigRef.id,
        userId: applicant.id,
      };

      const chatDoc = await addDoc(chatsRef(db), chatData);
      chatData.chatId = chatDoc.id;
      chatRefs.push({ id: chatDoc.id, chat: chatData });

      const applicationData: Application = {
        applicationId: faker.string.uuid(),
        gigId: gigRef.id,
        applicantId: applicant.id,
        listerId: gigRef.gig.listerId,
        status: applicationStatus,
        coverLetter: faker.lorem.paragraphs(2),
        appliedAt: getRecentDate(),
        chatId: chatDoc.id,
      };

      const applicationDoc = await addDoc(applicationsRef(db), applicationData);
      applicationData.applicationId = applicationDoc.id;
      applicationRefs.push({
        id: applicationDoc.id,
        application: applicationData,
      });

      // Create chat messages
      for (let j = 0; j < MESSAGES_PER_CHAT; j++) {
        const isFromLister = Math.random() > 0.5;
        const messageData: ChatMessage = {
          senderId: isFromLister ? gigRef.gig.listerId : applicant.id,
          content: faker.lorem.paragraph(),
          timestamp: getRecentDate(),
          chatId: chatDoc.id,
        };

        await addDoc(chatMessagesRef(db), messageData);
      }
    }
  }

  // Create ratings for completed gigs
  console.log("Creating ratings...");
  for (const gigRef of gigRefs.filter(
    (g) => g.gig.status === "completed" && g.gig.selectedApplicantId,
  )) {
    if (Math.random() < RATING_RATE && gigRef.gig.selectedApplicantId) {
      const ratingData: Rating = {
        ratingId: faker.string.uuid(),
        gigId: gigRef.id,
        byUserId: gigRef.gig.listerId,
        byUserDisplayName:
          userRefs.find((u) => u.id === gigRef.gig.listerId)?.user
            .displayName || "",
        toUserId: gigRef.gig.selectedApplicantId,
        rating: faker.number.int({ min: 3, max: 5 }),
        review: faker.lorem.paragraph(),
        createdAt: getRecentDate(),
      };

      const ratingDoc = await addDoc(ratingsRef(db), ratingData);
      ratingData.ratingId = ratingDoc.id;
    }
  }

  // Create transactions for completed gigs
  console.log("Creating transactions...");
  for (const gigRef of gigRefs.filter(
    (g) => g.gig.status === "completed" && g.gig.selectedApplicantId,
  )) {
    if (gigRef.gig.selectedApplicantId) {
      const transactionData: Transaction = {
        transactionId: faker.string.uuid(),
        senderId: gigRef.gig.listerId,
        receiverId: gigRef.gig.selectedApplicantId,
        gigId: gigRef.id,
        amount: gigRef.gig.price,
        createdAt: getRecentDate(),
      };

      const transactionDoc = await addDoc(transactionsRef(db), transactionData);
      transactionData.transactionId = transactionDoc.id;
    }
  }

  console.log("Database seeding completed!");

  return {
    users: userRefs.length,
    gigs: gigRefs.length,
    applications: applicationRefs.length,
    chats: chatRefs.length,
  };
}
