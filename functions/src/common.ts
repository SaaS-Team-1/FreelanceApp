import { onCall } from "firebase-functions/https";
import { auth, usersRef } from "./firebase";

// Get session status
exports.createUser = onCall(async (request) => {
  // request.data pass the user separate from the profile
  const user = await auth.createUser(request.data.user);
  usersRef.doc(user.uid).create({});
  return user;
});
