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
      <div className="grid grid-cols-3 gap-4 text-on-surface">
        {coinOptions.map((coins) => (
          <div
            key={coins}
            onClick={() => setSelectedCoins(coins)}
            className={`rounded-lg ${
              selectedCoins === coins && "outline outline-primary/30"
            } cursor-pointer bg-surface-dim p-4 transition-colors hover:bg-surface-container-highest`}
          >
            <p className="flex w-28 items-center text-2xl font-bold text-slate-900">
              {coins.toLocaleString()}
              <FaCoins className="ml-auto justify-self-end text-amber-500" />
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
        size="lg"
        className="h-fit w-full"
      >
        Buy
      </Button>
    </div>
  );
}
