import { Stripe } from "stripe";
import { onCall } from "firebase-functions/v2/https";
import { transactionsRef, usersRef } from "./firebase";
import { Timestamp } from "firebase-admin/firestore";

// Initialize Stripe with your secret key
const stripe = new Stripe(
  "sk_test_51QO02pJEuHTWAV4CiWXUcQQAoC3CTP2huEnukgG9YOphFtq2e18nupKGVPmtdZcgkormLBor6zMrrJYSwZu1t4X000lq5qRDac"
);

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
    const transactions = await transactionsRef
      .where("ownerId", "==", request.auth.uid)
      .where("onHold", "==", false)
      .get();

    const totalCoins = transactions.docs
      .map<number>((doc) => doc.data().amount)
      .reduce((sum, num) => sum + num);

    if (totalCoins != user.coins) {
      user.coins = totalCoins;
    }
    const finalCoins = (user.coins || 0) - request.data.amount;

    if (finalCoins < 0) {
      user.coins = totalCoins;

      userDoc.set(user, { merge: true });

      return { status: "error" };
    }

    user.coins = finalCoins;

    userDoc.set(user, { merge: true });

    try {
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

  if (user) {
    const transactions = await transactionsRef
      .where("ownerId", "==", request.auth.uid)
      .where("onHold", "==", false)
      .get();

    const totalCoins = transactions.docs
      .map<number>((doc) => doc.data().amount)
      .reduce((sum, num) => sum + num);

    if (totalCoins != user.coins) {
      user.coins = totalCoins;
    }
    const finalCoins = (user.coins || 0) - request.data.amount;

    if (finalCoins < 0) {
      user.coins = totalCoins;

      userDoc.set(user, { merge: true });

      return { status: "error" };
    }

    user.coins = finalCoins;

    userDoc.set(user, { merge: true });

    const ownerUUID = crypto.randomUUID();
    const thirdPartyUUID = crypto.randomUUID();

    try {
      await transactionsRef.doc(ownerUUID).create({
        ownerUUID, // transaction ID

        ownerId: request.auth.uid,
        ownerName: user.displayName,

        thirdPartyId: request.data.thirdPartyId,
        thirdPartyName: request.data.thirdPartyName,

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
        ownerName: request.data.thirdPartyName,

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

// export const finalizeTransaction = onCall(async (request) => {});
