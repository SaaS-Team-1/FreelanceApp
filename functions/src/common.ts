import { usersRef } from "./firebase";
import * as functions from "firebase-functions/v1";

exports.userProfile = functions.auth.user().onCreate((user) => {
  usersRef.doc(user.uid).set(user, { merge: true });
});
