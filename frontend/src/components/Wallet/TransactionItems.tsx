import {
  LuArrowUpRight,
  LuArrowDownLeft,
  LuWallet,
  LuSend,
  LuReceipt,
} from "react-icons/lu";
import { Gig, Transaction, User } from "@/utils/database/schema";

interface TransactionItemProps {
  transaction: Transaction;
  user?: Pick<User, "displayName">;
  gig?: Pick<Gig, "title">;
}

export default function TransactionItem({
  transaction,
  user,
  gig,
}: TransactionItemProps) {
  const getTransactionDetails = () => {
    switch (transaction.kind) {
      case "deposit":
        return {
          icon: <LuArrowDownLeft className="size-5 text-green-500" />,
          title: "Deposit to Wallet",
          description: "Added funds to wallet",
          color: "text-green-500",
        };

      case "withdraw":
        return {
          icon: <LuArrowUpRight className="size-5 text-red-500" />,
          title: "Withdraw from Wallet",
          description: "Withdrawn to bank account",
          color: "text-red-500",
        };

      case "send":
        return {
          icon: <LuSend className="size-5 text-blue-500" />,
          title: `Sent to ${user?.displayName || "Unknown User"}`,
          description: gig ? `Payment for: ${gig.title}` : "Transfer to user",
          color: "text-blue-500",
        };

      case "recieve":
        return {
          icon: <LuReceipt className="size-5 text-green-500" />,
          title: `Received from ${user?.displayName || "Unknown User"}`,
          description: gig ? `Payment for: ${gig.title}` : "Transfer received",
          color: "text-green-500",
        };

      default:
        return {
          icon: <LuWallet className="size-5 text-gray-500" />,
          title: "Transaction",
          description: "",
          color: "text-gray-500",
        };
    }
  };

  const details = getTransactionDetails();

  return (
    <div className="flex items-center justify-between rounded-md border-b p-4 last:border-b-0 hover:bg-slate-700">
      <div className="flex items-center space-x-4">
        <div className="flex size-10 items-center justify-center rounded-full bg-gray-100">
          {details.icon}
        </div>
        <div>
          <h3 className="font-bold text-gray-100">{details.title}</h3>
          <p className="text-sm  text-gray-300">{details.description}</p>
          <span className="text-xs text-gray-200">
            {new Date(
              transaction.createdAt.seconds * 1000,
            ).toLocaleDateString()}
          </span>
        </div>
      </div>
      <div className="text-right">
        <span className={`font-medium ${details.color}`}>
          {transaction.kind === "withdraw" || transaction.kind === "send"
            ? "-"
            : "+"}
          ${Math.abs(transaction.amount).toFixed(2)}
        </span>
      </div>
    </div>
  );
}
