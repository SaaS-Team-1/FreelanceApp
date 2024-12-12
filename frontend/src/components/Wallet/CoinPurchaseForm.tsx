import { Button } from "flowbite-react";
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
    <div className="flex flex-col space-y-4  2xl:min-h-[35vh] 2xl:max-w-[25vw]">
      <div className="absolute right-0 top-0 rounded px-2 py-1 text-sm ">
        100 coins = 1€
      </div>

      <div>
        <h2 className="mb-4 text-xl font-semibold">Buy Coins</h2>
      </div>

      <div className="grid grid-cols-3 gap-4 text-on-surface">
        {coinOptions.map((coins) => (
          <div
            key={coins}
            onClick={() => setSelectedCoins(coins)}
            className={`rounded-lg ${
              selectedCoins === coins && "outline outline-primary/30"
            } cursor-pointer p-4 transition-colors hover:bg-surface-container-highest bg-surface-dim`}
          >
            <p className="flex text-2xl font-bold items-center w-28 text-slate-900">
              {coins.toLocaleString()}
              <FaCoins className="text-amber-500 justify-self-end ml-auto" />
            </p>
          </div>
        ))}
      </div>

      <div className="mt-4 text-right text-lg font-semibold">
        Total: {calculatePrice(selectedCoins)}€
      </div>

      <Button
        onClick={() => onBuy(selectedCoins)}
        color="primary"
        size="xl"
        
        className="w-full h-fit"
      >
        Buy
      </Button>
    </div>
  );
}
