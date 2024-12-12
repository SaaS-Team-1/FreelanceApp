import { Transaction, User } from "@/utils/database/schema";
import { FaCoins, FaWallet } from "react-icons/fa6";
import { Badge, Button, Modal, Tabs } from "flowbite-react";
import CoinPurchaseForm from "@/components/Wallet/CoinPurchaseForm";
import TransactionItem from "@/components/Wallet/TransactionItems";
import WithdrawForm from "@/components/Wallet/WithdrawForm";
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
              <div className="w-[50vw] justify-self-center px-6 sm:w-fit">
                <div className="my-4 flex items-start justify-between">
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
              <div className="w-[50vw] justify-self-center px-6 sm:w-fit">
                <div className="my-4 flex items-start justify-between">
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
      <Modal
        onClose={() => {
          setReturnOpen(false);
          setSearchParams({});
        }}
        show={returnOpen}
      >
        <Modal.Header>
          <span className="text-3xl">Success!</span>
        </Modal.Header>
        <Modal.Body>
          <div className="max-w-[50vw] justify-self-center rounded-xl bg-surface-container p-5">
            {sessionId && (
              <PurchaseReturn email={userDoc?.email} sessionId={sessionId} />
            )}
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button
            color="primary"
            className="ml-auto justify-self-end"
            onClick={() => {
              setReturnOpen(false);
              setSearchParams({});
            }}
          >
            Close
          </Button>
        </Modal.Footer>
      </Modal>
      <Modal onClose={() => setCheckoutOpen(false)} show={checkoutOpen}>
        <Modal.Header></Modal.Header>
        <Modal.Body>
          <CheckoutForm coins={coins}></CheckoutForm>
        </Modal.Body>
      </Modal>
    </div>
  );
}
