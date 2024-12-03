import * as common from "./common";
import * as stripe from "./stripe";
import { initializeApp } from "firebase-admin/app";

initializeApp();

exports.stripe = stripe;
exports.common = common;
