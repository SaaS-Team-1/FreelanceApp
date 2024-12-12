import { User } from "@/utils/database/schema";
import { useFunctions } from "@/utils/reactfire";
import { httpsCallable } from "firebase/functions";
import { Button } from "flowbite-react";
import { useCallback, useState } from "react";

function calculateEuros(coins: number): number {
  return coins * 0.01;
}

type FnParams = { amount: number; IBAN: string };
type FnReturn = { status: string };

export default function WithdrawForm({ currentUser }: { currentUser?: User }) {
  const [amount, setAmount] = useState<number>(1000);
  const [IBAN, setIBAN] = useState<string>("");
  const functions = useFunctions();

  const withdrawFunction = () => {
    httpsCallable<FnParams, FnReturn>(
      functions,
      "stripe-withdrawFunds",
    )({ amount, IBAN }).then(() => {
      setAmount(0);
      // return res.data.clientSecret;
    });
  };

  if (!currentUser) return null;

  if ((currentUser.coins || 0) < 1000)
    return (
      <div className="flex items-center justify-center space-y-4 2xl:h-[35vh] 2xl:w-[25vw]">
        <h2 className="mb-4 text-xl font-semibold text-error">
          Minimum amount to withdraw is 1,000 Coins!
        </h2>
      </div>
    );
  const processingFee = calculateEuros(amount) * 0.25;
  const finalAmount = calculateEuros(amount) - processingFee;

  return (
    <form
      className="flex flex-col space-y-4 text-on-surface 2xl:min-h-[35vh] 2xl:max-w-[25vw]"
      method=""
      onSubmit={(event) => {
        event.preventDefault();
        withdrawFunction();
      }}
    >
      <div className="flex flex-col space-y-4">
        <div className="grid grid-cols-none grid-rows-2 gap-4 sm:grid-cols-2 sm:grid-rows-none">
          <div>
            <label className="mb-2 block text-sm font-medium">First Name</label>
            <input
              type="text"
              className="w-2/3 rounded-lg border-0  bg-surface-dim p-4 text-sm text-on-primary-container ring-0 placeholder:text-on-surface/30 focus:border-0 focus:ring-0 sm:w-full"
              value={currentUser.displayName}
              disabled
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium">
              Amount (Coins)
            </label>
            <div className="relative">
              <input
                type="number"
                className="w-2/3 rounded-lg border-0 bg-surface-container-highest p-4 text-sm text-on-primary-container ring-0 placeholder:text-on-surface/30 focus:border-0 focus:ring-0 sm:w-full"
                min="1000"
                max={currentUser.coins?.toString()}
                value={amount || ""}
                onChange={(e) => setAmount(Number(e.target.value))}
                required
              />
            </div>
          </div>
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium">IBAN</label>
          <input
            type="text"
            className="w-2/3 rounded-lg border-0 bg-surface-container-highest p-4 text-sm text-on-primary-container ring-0 placeholder:text-on-surface/30 focus:border-0 focus:ring-0 sm:w-full"
            placeholder="DE89 3704 0044 0532 0130 00"
            required
            value={IBAN}
            onChange={(e) => setIBAN(e.target.value)}
          />
        </div>
      </div>

      <div className="mt-6 rounded-lg  py-4 px-2">
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="">Coins</span>
            <span className="font-medium">{amount.toLocaleString()}</span>
          </div>

          <div className="flex justify-between text-sm">
            <span className="">Price per Coin</span>
            <span className="font-medium">€0.01</span>
          </div>

          <div className="flex justify-between text-sm">
            <span className="">Processing Fee (25%)</span>
            <span className="font-medium text-error">
              -€{processingFee.toFixed(2)}
            </span>
          </div>

          <div className="mt-2 border-t-2 border-primary/20 pt-2">
            <div className="flex justify-between">
              <span className="font-medium">Final Amount</span>
              <span className="font-bold text-tertiary">
                €{finalAmount.toFixed(2)}
              </span>
            </div>
          </div>
        </div>
      </div>

      <Button
        type="submit"
        color="primary"
        size="xl"
        className="mt-4 w-2/3 sm:w-full"
      >
        Withdraw
      </Button>
    </form>
  );
}
