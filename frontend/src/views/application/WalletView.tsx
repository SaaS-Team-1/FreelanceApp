import { Transaction, User } from "@/utils/database/schema";
import { FaCoins, FaWallet } from "react-icons/fa6";
import { Badge, Tabs } from "flowbite-react";
import CoinPurchaseForm from "@/components/Wallet/CoinPurchaseForm";
import TransactionItem from "@/components/Wallet/TransactionItems";
import WithdrawForm from "@/components/Wallet/WithdrawForm";
import CommonModal from "@/components/Common/CommonModal";
import { useEffect, useState } from "react";
import CheckoutForm from "@/components/Wallet/CheckoutForm";
import { useSearchParams } from "react-router-dom";
import PurchaseReturn from "@/components/Wallet/PurchaseReturn";
import { useFirestore, useUser } from "@/utils/reactfire";
import { transactionsRef, usersRef } from "@/utils/database/collections";
import { doc, onSnapshot, orderBy, query, where } from "firebase/firestore";
import Loading from "@/components/Loading";

export default function WalletView() {
  const db = useFirestore();
  const user = useUser();
  const [checkoutOpen, setCheckoutOpen] = useState(false);
  const [transactions, setTransactions] = useState<Transaction[]>();
  const [returnOpen, setReturnOpen] = useState(false);
  const [coins, setCoins] = useState(100);
  const [userDoc, setUserDoc] = useState<User>();
  const [searchParams, setSearchParams] = useSearchParams();
  const sessionId = searchParams.get("session_id");
  const userId = user.data?.uid;

  useEffect(() => setReturnOpen(!!sessionId), [sessionId]);

  useEffect(() => {
    if (!userId) return;

    return onSnapshot(doc(usersRef(db), userId), (doc) => {
      const userData = doc.data();
      if (!userData) return;
      setUserDoc(userData as User);
    });
  }, [db, userId]);

  useEffect(() => {
    if (!userId) return;
    return onSnapshot(
      query(
        transactionsRef(db),
        where("ownerId", "==", userId),
        orderBy("createdAt", "desc"),
      ),
      (res) =>
        setTransactions(res.docs.map((doc) => doc.data()) as Transaction[]),
    );
  }, [db, userId]);

  if (!userDoc) return <Loading />;

  return (
    <div className="scrollbar mx-auto flex h-screen w-full flex-col items-center space-y-10 overflow-y-scroll py-10 2xl:overflow-y-hidden">
      <div className="flex items-center justify-center space-x-6 2xl:w-full">
        <div className="space-y-4 justify-self-end rounded-lg bg-primary-container p-4 text-on-primary-container shadow-md">
          <span className="text-lg font-bold">Current Balance</span>
          <Badge color="yellow" size="" className="rounded-md">
            <div className="ml-1 flex w-full items-center space-x-2 text-2xl">
              <span className="ml-auto font-bold">
                {userDoc?.coins?.toLocaleString() || 0}
              </span>
              <FaCoins />
            </div>
          </Badge>
        </div>
      </div>

      <div className="flex h-fit w-max flex-col gap-10 space-y-10 pb-10 2xl:flex-row 2xl:space-y-0">
        <div className="max-h-[55vh]">
          <h2 className="mb-4 text-xl font-bold text-white">Deposit</h2>
          <Tabs aria-label="Deposit Tabs" variant="fullWidth">
            <Tabs.Item active title="Deposit" icon={FaWallet}>
              <div className="w-[50vw] justify-self-center px-6">
                <div className="flex justify-between my-4 items-start">
                  <h2 className="mb-4 text-xl font-semibold">Buy Coins</h2>
                  <div className="rounded px-2 py-1 text-sm ">
                    100 coins = 1€
                  </div>
                </div>

                <CoinPurchaseForm
                  onBuy={(number) => {
                    setCheckoutOpen(true);
                    setCoins(number);
                  }}
                />
              </div>
            </Tabs.Item>

            <Tabs.Item title="Withdraw" icon={FaWallet}>
              <div className="w-[50vw] justify-self-center px-6">
                <div className="flex justify-between my-4 items-start">
                  <h2 className="mb-4 text-xl font-semibold">
                    Withdraw to bank account
                  </h2>
                  <div className="rounded px-2 py-1 text-sm ">
                    100 coins = 1€
                  </div>
                </div>

                <WithdrawForm currentUser={userDoc} />
              </div>
            </Tabs.Item>
          </Tabs>
        </div>

        <div className="max-h-fit 2xl:max-h-[55vh]">
          <h2 className="mb-4 text-xl font-bold text-white">
            Transaction History
          </h2>
          <div className="scrollbar mb-10 rounded-lg bg-surface-container p-4 text-on-surface shadow-md 2xl:h-full 2xl:overflow-y-scroll">
            {transactions && transactions.length !== 0 ? (
              transactions.map((transaction) => (
                <TransactionItem
                  key={transaction.transactionId}
                  transaction={transaction as Transaction}
                />
              ))
            ) : (
              <div className="p-6 text-center ">No transactions yet</div>
            )}
          </div>
        </div>
      </div>
      {returnOpen && sessionId ? (
        <CommonModal
          onClose={() => {
            setReturnOpen(false);
            setSearchParams({});
          }}
          isOpen={returnOpen}
        >
          <div className="h-40 w-96 p-5">
            <PurchaseReturn email={userDoc?.email} sessionId={sessionId} />
          </div>
        </CommonModal>
      ) : (
        <></>
      )}
      {checkoutOpen ? (
        <CommonModal
          scroll
          onClose={() => setCheckoutOpen(false)}
          isOpen={checkoutOpen}
        >
          <CheckoutForm coins={coins}></CheckoutForm>
        </CommonModal>
      ) : (
        <></>
      )}
    </div>
  );
}
