import { setGlobalOptions } from "firebase-functions/v2";
import { onDocumentCreated } from "firebase-functions/v2/firestore";

setGlobalOptions({ region: "europe-west1" });

exports.universalID = onDocumentCreated(
  "{collection}/{document}",
  (event) => {
    const fieldName = `${event.params.collection.toLowerCase().slice(0, -1)}Id`;

    return event.data?.ref.update({ [fieldName]: event.params.document });
  }
);
