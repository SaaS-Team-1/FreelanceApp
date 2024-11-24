import { useState } from "react";
import { FaCoins } from "react-icons/fa";
import { LuCreditCard } from "react-icons/lu";

export default function CoinPurchaseForm() {
  const [selectedCoins, setSelectedCoins] = useState(1000);
  const coinOptions = [1000, 5000, 10000];

  const calculatePrice = (coins: number) => {
    return (coins / 100).toFixed(2);
  };

  return (
    <form className="relative space-y-4 text-white">
      <div className="absolute right-0 top-0 rounded bg-gray-800 px-2 py-1 text-sm text-gray-300">
        100 coins = 1€
      </div>

      <div>
        <h2 className="mb-4 text-xl font-semibold">Buy Coins</h2>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="col-span-2">
          <div className="flex flex-row flex-nowrap justify-center space-x-5 px-2">
            {coinOptions.map((coins) => (
              <div
                key={coins}
                onClick={() => setSelectedCoins(coins)}
                className={`flex-auto rounded-lg ${selectedCoins === coins ? "bg-slate-400" : "bg-slate-300"} cursor-pointer p-4 shadow-md transition-colors hover:bg-slate-400`}
              >
                <p className="flex text-2xl font-bold text-slate-900">
                  {coins.toLocaleString()}
                  <FaCoins className="m-1 ml-2 text-yellow-400" />
                </p>
              </div>
            ))}
          </div>
        </div>

        <div className="col-span-2">
          <label className="mb-2 block text-sm font-medium">Card Number</label>
          <div className="relative">
            <input
              type="text"
              className="w-full rounded-lg border bg-slate-300 p-2 pl-10"
              placeholder="1234 5678 9012 3456"
              required
            />
            <LuCreditCard className="absolute left-2 top-2.5 size-5 text-gray-400" />
          </div>
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium">Expiry Date</label>
          <input
            type="text"
            className="w-full rounded-lg border bg-slate-300 p-2"
            placeholder="MM/YY"
            required
          />
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium">CVV</label>
          <input
            type="text"
            className="w-full rounded-lg border bg-slate-300 p-2"
            maxLength={3}
            required
          />
        </div>
      </div>

      <div className="mt-4 text-right text-lg font-semibold">
        Total: {calculatePrice(selectedCoins)}€
      </div>

      <button
        type="submit"
        className="mt-4 w-full rounded-lg bg-blue-500 py-2 text-white hover:bg-blue-600"
      >
        Deposit
      </button>
    </form>
  );
}
