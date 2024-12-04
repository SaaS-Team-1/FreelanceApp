import { User } from "@/utils/database/schema";
import { useFunctions } from "@/utils/reactfire";
import { httpsCallable } from "firebase/functions";
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

  if (currentUser.coins < 1000)
    return (
      <div className="flex items-center justify-center space-y-4 text-white lg:h-[35vh] lg:w-[25vw]">
        <h2 className="mb-4 text-xl font-semibold text-red-400">
          Minimum amount to withdraw is 1,000 Coins!
        </h2>
      </div>
    );
  const processingFee = calculateEuros(amount) * 0.25;
  const finalAmount = calculateEuros(amount) - processingFee;

  return (
    <form
      className="flex flex-col justify-evenly space-y-4 text-white lg:min-h-[35vh] lg:max-w-[25vw]"
      method=""
      onSubmit={(event) => {
        event.preventDefault();
        withdrawFunction();
      }}
    >
      <div className="absolute right-0 top-0 rounded bg-gray-800 px-2 py-1 text-sm text-gray-300">
        100 coins = 1€
      </div>

      <h2 className="mb-4 text-xl font-semibold">Withdraw to Bank Account</h2>

      <div className="grid gap-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="mb-2 block text-sm font-medium">First Name</label>
            <input
              type="text"
              className="w-full rounded-lg border bg-slate-300 p-2 text-black"
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
                className="w-full rounded-lg border bg-slate-300 p-2 text-black"
                min="1000"
                max={currentUser.coins.toString()}
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
            className="w-full rounded-lg border bg-slate-300 p-2 text-black"
            placeholder="DE89 3704 0044 0532 0130 00"
            required
            value={IBAN}
            onChange={(e) => setIBAN(e.target.value)}
          />
        </div>
      </div>

      <div className="mt-6 rounded-lg bg-gray-800 p-4">
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-gray-300">Coins</span>
            <span className="font-medium">{amount.toLocaleString()}</span>
          </div>

          <div className="flex justify-between text-sm">
            <span className="text-gray-300">Price per Coin</span>
            <span className="font-medium">€0.01</span>
          </div>

          <div className="flex justify-between text-sm">
            <span className="text-gray-300">Processing Fee (25%)</span>
            <span className="font-medium text-red-400">
              -€{processingFee.toFixed(2)}
            </span>
          </div>

          <div className="mt-2 border-t border-gray-600 pt-2">
            <div className="flex justify-between">
              <span className="font-medium">Final Amount</span>
              <span className="font-bold text-green-400">
                €{finalAmount.toFixed(2)}
              </span>
            </div>
          </div>
        </div>
      </div>

      <button
        type="submit"
        className="mt-4 w-full rounded-lg bg-blue-500 py-2 text-white hover:bg-blue-600"
      >
        Withdraw
      </button>
    </form>
  );
}
