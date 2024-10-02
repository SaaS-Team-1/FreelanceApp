import { onCall } from "firebase-functions/v2/https";
import { setGlobalOptions } from "firebase-functions/v2";

setGlobalOptions({ region: "europe-west1" });

const helloWorld = onCall(() => {
  return "Hello from Firebase! v0.2";
});

export { helloWorld };
