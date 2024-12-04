import { setGlobalOptions } from "firebase-functions/options";
import * as stripe from "./stripe";
import * as common from "./common";

setGlobalOptions({ region: "europe-west1" });

exports.stripe = stripe;
exports.common = common;
