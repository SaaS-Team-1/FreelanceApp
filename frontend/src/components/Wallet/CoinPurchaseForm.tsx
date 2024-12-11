import { useState } from "react";
import { FaCoins } from "react-icons/fa";

export default function CoinPurchaseForm({
  onBuy,
}: {
  onBuy: (amount: number) => void;
}) {
  const [selectedCoins, setSelectedCoins] = useState(100);
  const coinOptions = [100, 300, 500, 1000, 2000, 3000, 4000, 5000, 10000];

  const calculatePrice = (coins: number) => {
    return (coins / 100).toFixed(2);
  };

  return (
    <div className="relative space-y-4  2xl:min-h-[35vh] 2xl:max-w-[25vw]">
      <div className="absolute right-0 top-0 rounded px-2 py-1 text-sm ">
        100 coins = 1€
      </div>

      <div>
        <h2 className="mb-4 text-xl font-semibold">Buy Coins</h2>
      </div>

      <div className="grid grid-cols-3 gap-4">
        {coinOptions.map((coins) => (
          <div
            key={coins}
            onClick={() => setSelectedCoins(coins)}
            className={`rounded-lg ${
              selectedCoins === coins ? "bg-slate-400" : "bg-slate-300"
            } cursor-pointer p-4 shadow-md transition-colors hover:bg-slate-400`}
          >
            <p className="flex text-2xl font-bold text-slate-900">
              {coins.toLocaleString()}
              <FaCoins className="m-1 ml-2 text-yellow-400" />
            </p>
          </div>
        ))}
      </div>

      <div className="mt-4 text-right text-lg font-semibold">
        Total: {calculatePrice(selectedCoins)}€
      </div>

      <button
        onClick={() => onBuy(selectedCoins)}
        className="mt-4 w-full rounded-lg bg-blue-500 py-2  hover:bg-blue-600"
      >
        Buy
      </button>
    </div>
  );
}
