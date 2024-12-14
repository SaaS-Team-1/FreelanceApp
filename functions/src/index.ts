import { setGlobalOptions } from "firebase-functions/options";
setGlobalOptions({ region: "europe-west1", enforceAppCheck: true });

import * as stripe from "./stripe";
import * as common from "./common";

exports.stripe = stripe;
exports.common = common;
