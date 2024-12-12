import { useFunctions } from "@/utils/reactfire";
import { httpsCallable } from "firebase/functions";
import { useEffect, useState } from "react";
import Loading from "react-loading";

export interface PurchaseReturnParams {
  email: string;
  sessionId: string;
}
type FnParams = { sessionId: string };
type FnReturn = { paymentStatus: string };

export default function PurchaseReturn({
  email,
  sessionId,
}: PurchaseReturnParams) {
  const [status, setStatus] = useState("loading");
  const functions = useFunctions();

  useEffect(() => {
    httpsCallable<FnParams, FnReturn>(
      functions,
      "stripe-getSessionStatus",
    )({ sessionId }).then((res) => {
      setStatus(res.data.paymentStatus);
    });
    // Create a Checkout Session
  }, [functions, sessionId]);

  if (status === "paid") {
    return (
      <section className="w-full text-on-surface">
        <p className="font-bold">
          We appreciate your business! A confirmation email will be sent to{" "}
          {email}. If you have any questions, please email{" "}
          <a
            className="text-primary hover:underline dark:text-blue-500"
            href="mailto:orders@example.com"
          >
            orders@example.com
          </a>
          .
        </p>
      </section>
    );
  }

  if (status === "loading") {
    return <Loading className="mt-5 justify-self-center" />;
  }

  return (
    <section>
      <p className="font-bold text-error/80">
        An error has occured, please contact support.
      </p>
    </section>
  );
}
