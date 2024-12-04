import { Stripe } from "stripe";
import { onCall } from "firebase-functions/v2/https";
import { transactionsRef, usersRef } from "./firebase";
import { Timestamp } from "firebase-admin/firestore";

// Initialize Stripe with your secret key
const stripe = new Stripe(
  "sk_test_51QO02pJEuHTWAV4CiWXUcQQAoC3CTP2huEnukgG9YOphFtq2e18nupKGVPmtdZcgkormLBor6zMrrJYSwZu1t4X000lq5qRDac"
);

// Create checkout session
exports.createCheckoutSession = onCall(
  {
    region: "europe-west1",
  },
  async (request) => {
    try {
      const session = await stripe.checkout.sessions.create({
        ui_mode: "embedded",
        billing_address_collection: "auto",
        payment_method_types: ["card"],

        line_items: [
          {
            price: "price_1QRzoGJEuHTWAV4CzCEdfqcy",
            quantity: request.data.coins,
          },
        ],
        customer_email: request.data.email,
        mode: "payment",
        return_url: `${request.data.url}/?session_id={CHECKOUT_SESSION_ID}`,
      });

      return {
        clientSecret: session.client_secret,
      };
    } catch (error) {
      console.error("Error creating checkout session:", error);
      throw new Error("Failed to create checkout session");
    }
  }
);

// Get session status
exports.getSessionStatus = onCall(
  {
    region: "europe-west1",
  },
  async (request) => {
    try {
      const session = await stripe.checkout.sessions.retrieve(
        request.data.sessionId
      );

      if (
        session.payment_status === "paid" &&
        request.auth &&
        session.payment_intent
      ) {
        await transactionsRef.doc(session.payment_intent.toString()).set({
          transactionId: session.payment_intent.toString(),
          ownerId: request.auth.uid,
          amount: session.amount_total,
          createdAt: Timestamp.now(),
          onHold: false,
          kind: "deposit",
        });
        // const user = await usersRef.doc(request.auth.uid).get();
        // if(user)
      }
      return {
        paymentStatus: session.payment_status,
      };
    } catch (error) {
      console.error("Error retrieving session:", error);
      return {
        paymentStatus: "error",
      };
    }
  }
);

// export const createStripeCustomer = functionsV1.auth
//   .user()
//   .onCreate(async (user) => {
//     if (!user.email) return;

//     const customer = await stripe.customers.create({ email: user.email });
//     await stripe.setupIntents.create({
//       customer: customer.id,
//     });
//   });
