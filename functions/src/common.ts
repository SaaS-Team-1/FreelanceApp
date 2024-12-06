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

    // Create Firebase Authentication user
    const userRecord = await auth.createUser({
      email: email,
      password: password,
      displayName: displayName,
    });

    // Prepare Firestore user document
    const userDocument = {
      userId: userRecord.uid,
      email: email,
      displayName: displayName,
      coins: 0,
      profile: {
        bio: profile.bio || "",
        credits: 0,
        picture:
          profile.picture || "https://avatars.githubusercontent.com/u/18249920",
        location: profile.location || "",
        degree: profile.degree || "",
        skills: profile.skills || "",
        languages: profile.languages || "",
        faculty: profile.faculty || "",
      },
      stats: {
        completedGigs: 0,
        averageRating: 0,
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
