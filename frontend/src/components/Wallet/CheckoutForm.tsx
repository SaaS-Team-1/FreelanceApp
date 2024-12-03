import { loadStripe } from "@stripe/stripe-js";
import {
  EmbeddedCheckoutProvider,
  EmbeddedCheckout,
} from "@stripe/react-stripe-js";
import { useCallback } from "react";
import { useAuth, useFunctions } from "@/utils/reactfire";
import { httpsCallable } from "firebase/functions";

const stripePromise = loadStripe(
  "pk_test_51QO02pJEuHTWAV4CwZH14QhkuVBHE5Qiy8iZVg3PuCrWrJyGQdeF8MuFgKUizskncTDy9smTcJlhFVlvyGk1OoUO00dzJVkbZn",
);

type FnParams = { url: string; coins: number; email: string };
type FnReturn = { clientSecret: string };

export interface CheckoutFormParams {
  coins: number;
}

export default function CheckoutForm({ coins }: CheckoutFormParams) {
  const email = useAuth().currentUser?.email as string;
  const functions = useFunctions();

  const fetchClientSecret = useCallback(() => {
    return httpsCallable<FnParams, FnReturn>(
      functions,
      "stripe-createCheckoutSession",
    )({ url: window.location.href, email, coins }).then((res) => {
      return res.data.clientSecret;
    });
    // Create a Checkout Session
  }, [coins, email, functions]);

  return (
    <div id="checkout" className="w-fit min-w-[20vw] justify-self-center">
      <EmbeddedCheckoutProvider
        stripe={stripePromise}
        options={{ fetchClientSecret }}
      >
        <EmbeddedCheckout />
      </EmbeddedCheckoutProvider>
    </div>
  );
}
