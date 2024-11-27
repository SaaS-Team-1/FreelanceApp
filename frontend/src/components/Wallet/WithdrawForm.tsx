import { User } from "@/utils/database/schema";
import { useState } from "react";

export default function WithdrawForm({
  currentUser,
}: {
  currentUser: Pick<User, "displayName">;
}) {
  const [amount, setAmount] = useState<number>(0);

  const calculateEuros = (coins: number) => {
    return (coins / 100).toFixed(2);
  };

  return (
    <form className="relative space-y-4 text-white">
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
              value={currentUser.displayName.split(" ")[0]}
              disabled
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium">Last Name</label>
            <input
              type="text"
              className="w-full rounded-lg border bg-slate-300 p-2 text-black"
              value={currentUser.displayName.split(" ")[1]}
              disabled
            />
          </div>
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium">
            Amount (Coins)
          </label>
          <div className="relative">
            <input
              type="number"
              className="w-full rounded-lg border bg-slate-300 p-2 text-black"
              min="0"
              value={amount || ""}
              onChange={(e) => setAmount(Number(e.target.value))}
              required
            />
          </div>
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium">IBAN</label>
          <input
            type="text"
            className="w-full rounded-lg border bg-slate-300 p-2 text-black"
            placeholder="DE89 3704 0044 0532 0130 00"
            required
          />
        </div>
      </div>

      <div className="mt-4 text-right text-lg font-semibold">
        You will receive: {calculateEuros(amount)}€
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
