import { onCall } from "firebase-functions/https";
import { auth, usersRef } from "./firebase";

export const createUser = onCall(async (request) => {
  try {
    const { email, password, displayName, profile } = request.data;

    if (!email || !password || !displayName) {
      return {
        status: "error",
        message: "Email, password, and display name are required",
      };
    }

    if (!email.toLowerCase().endsWith("kuleuven.be")) {
      return { status: "error", message: "Ku Leuven email is required" };
    }

    // Create Firebase Authentication user
    const userRecord = await auth.createUser({
      email: email,
      password: password,
      displayName: displayName,
      photoURL: `https://randomuser.me/api/portraits/${
        Math.random() < 0.5 ? "men" : "women"
      }/${Math.floor(Math.random() * (99 - 1) + 1)}.jpg`,
    });

    // Prepare Firestore user document
    const userDocument = {
      userId: userRecord.uid,
      email: email,
      displayName: displayName,
      coins: 0,
      completedGigs: 0,
      averageRating: 0,
      profile: {
        bio: profile.bio || "",
        credits: 0,
        picture: userRecord.photoURL,
        location: profile.location || "",
        degree: profile.degree || "",
        skills: profile.skills || "",
        languages: profile.languages || "",
        faculty: profile.faculty || "",
      },
    };

    usersRef.doc(userRecord.uid).create(userDocument);

    return {
      uid: userRecord.uid,
      email: userRecord.email,
      displayName: userRecord.displayName,
    };
  } catch (error) {
    console.error("Error creating user:", error);

    if (error instanceof Error) {
      return {
        status: "error",
        message: `Failed to create user: ${error.message}`,
      };
    }

    return {
      status: "error",
      message: "Unexpected error occurred while creating user",
    };
  }
});
