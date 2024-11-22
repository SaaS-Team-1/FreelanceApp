/* eslint-disable camelcase */
/* eslint-disable require-jsdoc */
/* eslint-disable max-len */
import * as functions from "firebase-functions/v1";
import * as admin from "firebase-admin";
import { Stripe } from "stripe";

// Initialize Firebase Admin
admin.initializeApp();

// Initialize Stripe with API version
const stripe = new Stripe(functions.config().stripe.secret, {});

/**
 * When a user is created, create a Stripe customer object for them.
 */
export const createStripeCustomer = functions.auth
  .user()
  .onCreate(async (user) => {
    const customer = await stripe.customers.create({ email: user.email });
    const intent = await stripe.setupIntents.create({
      customer: customer.id,
    });
    await admin.firestore().collection("stripe_customers").doc(user.uid).set({
      customer_id: customer.id,
      setup_secret: intent.client_secret,
    });
  });

/**
 * When adding the payment method ID on the client,
 * this function is triggered to retrieve the payment method details.
 */
export const addPaymentMethodDetails = functions.firestore
  .document("/stripe_customers/{userId}/payment_methods/{pushId}")
  .onCreate(async (snap, context) => {
    try {
      const paymentMethodId = snap.data().id;
      const paymentMethod = await stripe.paymentMethods.retrieve(
        paymentMethodId
      );
      await snap.ref.set(paymentMethod);

      const parentRef = snap.ref.parent.parent;
      if (!parentRef) {
        throw new Error("Parent reference not found");
      }

      // Create a new SetupIntent so the customer can add a new method next time
      const intent = await stripe.setupIntents.create({
        customer: `${paymentMethod.customer}`,
      });

      await parentRef.set(
        {
          setup_secret: intent.client_secret,
        },
        { merge: true }
      );
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error : new Error("Unknown error occurred");
      await snap.ref.set(
        { error: userFacingMessage(errorMessage) },
        { merge: true }
      );
      console.log(errorMessage, { user: context.params.userId });
    }
  });

/**
 * When a payment document is written on the client,
 * this function is triggered to create the payment in Stripe.
 */
export const createStripePayment = functions.firestore
  .document("stripe_customers/{userId}/payments/{pushId}")
  .onCreate(async (snap, context) => {
    const { amount, currency, payment_method } = snap.data();
    try {
      const parentRef = snap.ref.parent.parent;
      if (!parentRef) {
        throw new Error("Parent reference not found");
      }

      const customerDoc = await parentRef.get();
      const customerData = customerDoc.data();
      const customer = customerData?.customer_id;

      if (!customer) {
        throw new Error("Customer not found!");
      }

      const payment = await stripe.paymentIntents.create(
        {
          amount,
          currency,
          customer,
          payment_method,
          off_session: false,
          confirm: true,
          confirmation_method: "manual",
        },
        { idempotencyKey: context.params.pushId }
      );

      await snap.ref.set(payment);
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error : new Error("Unknown error occurred");
      functions.logger.error(errorMessage);
      await snap.ref.set(
        { error: userFacingMessage(errorMessage) },
        { merge: true }
      );
      console.log(errorMessage, { user: context.params.userId });
    }
  });

/**
 * When 3D Secure is performed, we need to reconfirm the payment
 * after authentication has been performed.
 */
export const confirmStripePayment = functions.firestore
  .document("stripe_customers/{userId}/payments/{pushId}")
  .onUpdate(async (change, context) => {
    if (change.after.data().status === "requires_confirmation") {
      const payment = await stripe.paymentIntents.confirm(
        change.after.data().id
      );
      await change.after.ref.set(payment);
    }
  });

/**
 * When a user deletes their account, clean up after them
 */
export const cleanupUser = functions.auth.user().onDelete(async (user) => {
  const dbRef = admin.firestore().collection("stripe_customers");
  const customerDoc = await dbRef.doc(user.uid).get();
  const customerData = customerDoc.data();

  if (!customerData?.customer_id) {
    return;
  }

  await stripe.customers.del(customerData.customer_id);

  // Delete the customer's payments & payment methods in firestore.
  const batch = admin.firestore().batch();

  const [paymentsMethodsSnapshot, paymentsSnapshot] = await Promise.all([
    dbRef.doc(user.uid).collection("payment_methods").get(),
    dbRef.doc(user.uid).collection("payments").get(),
  ]);

  paymentsMethodsSnapshot.forEach((doc) => batch.delete(doc.ref));
  paymentsSnapshot.forEach((doc) => batch.delete(doc.ref));

  await batch.commit();
  await dbRef.doc(user.uid).delete();
});

interface ErrorContext {
  user?: string;
  [key: string]: unknown;
}

function userFacingMessage(error: Error): string {
  if (error instanceof Stripe.errors.StripeError) {
    return error.message;
  }
  return "An error occurred, developers have been alerted";
}
