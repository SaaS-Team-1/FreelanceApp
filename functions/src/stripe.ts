import { Stripe } from "stripe";
import { onCall } from "firebase-functions/v2/https";
import { transactionsRef, usersRef } from "./firebase";
import {
  DocumentData,
  DocumentReference,
  Timestamp,
} from "firebase-admin/firestore";

// Initialize Stripe with your secret key
const stripe = new Stripe(
  // eslint-disable-next-line max-len
  "sk_test_51QO02pJEuHTWAV4CiWXUcQQAoC3CTP2huEnukgG9YOphFtq2e18nupKGVPmtdZcgkormLBor6zMrrJYSwZu1t4X000lq5qRDac"
);

async function updateCoins(
  userId: string,
  amount: number,
  userDoc: DocumentReference,
  user: DocumentData
) {
  const transactions = await transactionsRef
    .where("ownerId", "==", userId)
    .get();

  const totalCoins = transactions.docs
    .filter((doc) => doc.data().amount < 0 || !doc.data().onHold)
    .map<number>((doc) => doc.data().amount)
    .reduce((sum, num) => sum + num);

  if (totalCoins != user.coins) {
    user.coins = totalCoins;
  }
  const finalCoins = (user.coins || 0) + amount;

  if (finalCoins < 0) {
    user.coins = totalCoins;

    userDoc.set(user, { merge: true });

    throw new Error("Cannot add negative coins");
  }

  user.coins = finalCoins;

  userDoc.set(user, { merge: true });
}

// Create checkout session
export const createCheckoutSession = onCall(async (request) => {
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
});

// Get session status
export const getSessionStatus = onCall(async (request) => {
  if (!request.auth) return { paymentStatus: "error" };
  try {
    const session = await stripe.checkout.sessions.retrieve(
      request.data.sessionId
    );
    const userDoc = usersRef.doc(request.auth.uid);
    const user = (await userDoc.get()).data();

    if (session.payment_status === "paid" && user && session.payment_intent) {
      try {
        await transactionsRef.doc(session.payment_intent.toString()).create({
          transactionId: session.payment_intent.toString(),
          ownerId: request.auth.uid,
          amount: session.amount_total,
          createdAt: Timestamp.now(),
          onHold: false,
          kind: "deposit",
        });
      } catch (error) {
        return {
          paymentStatus: "paid",
        };
      }

      user.coins = (user.coins || 0) + session.amount_total;
      await userDoc.set(user, { merge: true });
      return {
        paymentStatus: session.payment_status,
      };
    }
  } catch (error) {
    console.error("Error retrieving session:", error);
    return {
      paymentStatus: "error",
    };
  }
  return {
    paymentStatus: "error",
  };
});

// Get session status
export const withdrawFunds = onCall(async (request) => {
  if (!request.auth) return { status: "error" };

  const userDoc = usersRef.doc(request.auth.uid);
  const user = (await userDoc.get()).data();

  if (user) {
    try {
      updateCoins(request.auth.uid, -request.data.amount || 0, userDoc, user);

      const uuid = crypto.randomUUID();
      await transactionsRef.doc(uuid).create({
        uuid, // transaction ID

        ownerId: request.auth.uid,
        ownerName: user.displayName,

        amount: -request.data.amount,

        createdAt: Timestamp.now(),
        onHold: false,
        kind: "withdraw",
      });
    } catch (error) {
      console.error("Error retrieving session:", error);
      return {
        status: "error",
      };
    }

    return {
      status: "success",
    };
  }

  return {
    status: "error",
  };
});

export const assignTransaction = onCall(async (request) => {
  if (!request.auth) return { status: "error" };

  const userDoc = usersRef.doc(request.auth.uid);
  const user = (await userDoc.get()).data();

  const thirdParty = (
    await usersRef.doc(request.data.thirdPartyId).get()
  ).data();

  const ownerUUID = crypto.randomUUID();
  const thirdPartyUUID = crypto.randomUUID();

  if (user && thirdParty) {
    try {
      updateCoins(request.auth.uid, -request.data.amount || 0, userDoc, user);

      await transactionsRef.doc(ownerUUID).create({
        ownerUUID, // transaction ID

        ownerId: request.auth.uid,
        ownerName: user.displayName,

        thirdPartyId: request.data.thirdPartyId,
        thirdPartyName: thirdParty.displayName,

        gigId: request.data.gigId,
        gigName: request.data.gigName,

        amount: -request.data.amount,

        createdAt: Timestamp.now(),

        onHold: true,
        kind: "send",
      });

      await transactionsRef.doc(thirdPartyUUID).create({
        thirdPartyUUID, // transaction ID

        thirdPartyId: request.auth.uid,
        thirdPartyName: user.displayName,

        ownerId: request.data.thirdPartyId,
        ownerName: thirdParty.displayName,

        gigId: request.data.gigId,
        gigName: request.data.gigName,

        amount: request.data.amount,

        createdAt: Timestamp.now(),

        onHold: true,
        kind: "receive",
      });
    } catch (error) {
      await transactionsRef.doc(ownerUUID).delete();
      await transactionsRef.doc(thirdPartyUUID).delete();
      console.error("Error retrieving session:", error);
      return {
        status: "error",
      };
    }

    return {
      status: "success",
    };
  }

  return {
    status: "error",
  };
});

export const finalizeTransaction = onCall(async (request) => {
  if (!request.auth) return { status: "error" };
  try {
    const ownerTransaction = (
      await transactionsRef
        .where("ownerId", "==", request.auth.uid)
        .where("onHold", "==", true)
        .where("gigId", "==", request.data.gigId)
        .limit(1)
        .get()
    ).docs.at(0);

    const thirdPartyTransaction = (
      await transactionsRef
        .where("ownerId", "==", request.data.thirdPartyId)
        .where("onHold", "==", true)
        .where("gigId", "==", request.data.gigId)
        .limit(1)
        .get()
    ).docs.at(0);

    const userDoc = usersRef.doc(request.data.thirdPartyId);
    const user = (await userDoc.get()).data();

    if (user && thirdPartyTransaction && ownerTransaction) {
      transactionsRef.doc(thirdPartyTransaction.id).update({ onHold: false });
      transactionsRef.doc(ownerTransaction.id).update({ onHold: false });
      updateCoins(
        request.data.thirdPartyId,
        thirdPartyTransaction.get("amount"),
        userDoc,
        user
      );
    }

    return {
      status: "success",
    };
  } catch (error) {
    console.error("Error changing transaction:", error);
    return {
      status: "error",
    };
  }
  return {
    status: "error",
  };
});
