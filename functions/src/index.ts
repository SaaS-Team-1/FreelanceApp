import { onCall } from "firebase-functions/v2/https";
import { setGlobalOptions } from "firebase-functions/v2";
import { onDocumentCreated } from "firebase-functions/v2/firestore";

setGlobalOptions({ region: "europe-west1" });

const helloWorld = onCall(() => {
  return "Hello from Firebase! v0.2";
});
const universalID = onDocumentCreated("{collection}/{document}", (event) => {
  const fieldName = `${event.params.collection.toLowerCase().slice(0, -1)}Id`;

  return event.data?.ref.update({ [fieldName]: event.params.document });
});
// exports.universalFirestoreTrigger = functions.firestore
//     .document('{collecId}/{docId}')
//     .onWrite((snap, context) => {

//         console.log("Collection: " + context.params.collecId);
//         console.log("Document: " + context.params.docId);

//         return null;

//     });

export { helloWorld, universalID };
