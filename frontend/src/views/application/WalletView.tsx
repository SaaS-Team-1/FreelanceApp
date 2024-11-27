import { Transaction } from "@/utils/database/schema";
import { FaCoins, FaWallet } from "react-icons/fa6";
import { Tabs } from "flowbite-react";
import CoinPurchaseForm from "@/components/Wallet/CoinPurchaseForm";
import TransactionItem from "@/components/Wallet/TransactionItems";
import WithdrawForm from "@/components/Wallet/WithdrawForm";

function WalletView() {
  const currentUser = {
    userId: "user123",
    email: "john@example.com",
    displayName: "John Doe",
    profile: {
      bio: "Software developer",
      credits: 1250.75,
      picture: "https://example.com/pic.jpg",
      location: "New York",
    },
    stats: {
      completedGigs: 15,
      averageRating: 4.8,
    },
  };

  const dummyTransactions = [
    {
      transactionId: "tx1",
      kind: "deposit",
      amount: 500,
      receiverId: currentUser.userId,
      createdAt: { seconds: Date.now() / 1000 - 3600 },
    },
    {
      transactionId: "tx2",
      kind: "withdraw",
      amount: 200,
      receiverId: currentUser.userId,
      createdAt: { seconds: Date.now() / 1000 - 7200 },
    },
    {
      transactionId: "tx3",
      kind: "send",
      amount: 500,
      senderId: currentUser.userId,
      receiverId: "user456",
      user: { displayName: "Jane Smith" },
      gig: { title: "Website Development" },
      createdAt: { seconds: Date.now() / 1000 - 86400 },
    },
    {
      transactionId: "tx4",
      kind: "recieve",
      amount: 250,
      senderId: "user789",
      receiverId: currentUser.userId,
      user: { displayName: "Mike Johnson" },
      gig: { title: "Logo Design" },
      createdAt: { seconds: Date.now() / 1000 - 86400 * 2 },
    },
    {
      transactionId: "tx4",
      kind: "recieve",
      amount: 250,
      senderId: "user789",
      receiverId: currentUser.userId,
      user: { displayName: "Mike Johnson" },
      gig: { title: "Logo Design" },
      createdAt: { seconds: Date.now() / 1000 - 86400 * 2 },
    },
  ];

  return (
    <div className="mx-auto w-max p-6">
      <div className="mb-6 flex items-center justify-between">
        <h2 className="text-4xl font-bold text-white">Wallet</h2>
        <div className="rounded-lg bg-gray-800 p-4 shadow-md">
          <span className="text-sm font-bold text-gray-200">
            Current Balance
          </span>
          <p className="flex text-2xl font-bold text-gray-200">
            {currentUser.profile.credits.toFixed(0)}{" "}
            <FaCoins className="m-1 ml-2 text-yellow-400" />
          </p>
        </div>
      </div>
      <div className="flex w-max flex-col gap-10 lg:flex-row">
        <Tabs aria-label="Deposit Tabs" className="" variant="underline">
          <Tabs.Item active title="Deposit" icon={FaWallet}>
            <CoinPurchaseForm />
          </Tabs.Item>

          <Tabs.Item title="Withdraw" icon={FaWallet}>
            <WithdrawForm currentUser={currentUser} />
          </Tabs.Item>
        </Tabs>

        <div className="mt-4 lg:mt-0">
          <h2 className="mb-4 text-xl font-bold text-white">
            Transaction History
          </h2>
          <div className="scrollbar overflow-scroll rounded-lg bg-gray-800 p-4 shadow-md lg:max-h-screen">
            {dummyTransactions.length === 0 ? (
              <div className="p-6 text-center text-gray-500">
                No transactions yet
              </div>
            ) : (
              dummyTransactions
                .sort((a, b) => b.createdAt.seconds - a.createdAt.seconds)
                .map((transaction) => (
                  <TransactionItem
                    key={transaction.transactionId}
                    transaction={transaction as Transaction}
                    user={transaction.user}
                    gig={transaction.gig}
                  />
                ))
            )}
            {dummyTransactions.length === 0 ? (
              <div className="p-6 text-center text-gray-500">
                No transactions yet
              </div>
            ) : (
              dummyTransactions
                .sort((a, b) => b.createdAt.seconds - a.createdAt.seconds)
                .map((transaction) => (
                  <TransactionItem
                    key={transaction.transactionId}
                    transaction={transaction as Transaction}
                    user={transaction.user}
                    gig={transaction.gig}
                  />
                ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default WalletView;
