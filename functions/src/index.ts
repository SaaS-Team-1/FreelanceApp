import { onCall } from "firebase-functions/v2/https";
import { setGlobalOptions } from "firebase-functions/v2";

setGlobalOptions({ region: "europe-west1" });

const helloWorld = onCall((request) => {
  return "Hello from Firebase!";
});

export { helloWorld };
