import {
  LuArrowUpRight,
  LuArrowDownLeft,
  LuWallet,
  LuSend,
  LuReceipt,
} from "react-icons/lu";
import { Transaction } from "@/utils/database/schema";

interface TransactionItemProps {
  transaction: Transaction;
}

export default function TransactionItem({ transaction }: TransactionItemProps) {
  const getTransactionDetails = () => {
    switch (transaction.kind) {
      case "deposit":
        return {
          icon: <LuArrowDownLeft className="size-8 text-green-500" />,
          title: "Deposit to Wallet",
          description: "Added funds to wallet",
          color: "text-green-500",
        };

      case "withdraw":
        return {
          icon: <LuArrowUpRight className="size-8 text-red-500" />,
          title: "Withdraw from Wallet",
          description: "Withdrawn to bank account",
          color: "text-red-500",
        };

      case "send":
        return {
          icon: (
            <LuSend
              className={`size-8 ${
                transaction.onHold ? "text-blue-500" : "text-red-500"
              }`}
            />
          ),
          title: `${transaction.onHold ? "On Hold - " : ""}Sent to ${transaction.thirdPartyName || "Unknown User"}`,
          description: transaction.gigId
            ? `Payment for: ${transaction.gigName}`
            : "Transfer to user",
          color: transaction.onHold ? "text-blue-500" : "text-red-500",
        };

      case "receive":
        return {
          icon: (
            <LuReceipt
              className={`size-8 ${
                transaction.onHold ? "text-blue-500" : "text-green-500"
              }`}
            />
          ),
          title: `${transaction.onHold ? "On Hold - " : ""}Received from ${transaction.thirdPartyName || "Unknown User"}`,
          description: transaction.gigId
            ? `Payment for: ${transaction.gigName}`
            : "Transfer received",
          color: transaction.onHold ? "text-blue-500" : "text-green-500",
        };

      default:
        return {
          icon: <LuWallet className="size-8 text-gray-500" />,
          title: "Transaction",
          description: "",
          color: "text-gray-500",
        };
    }
  };

  const details = getTransactionDetails();

  return (
    <div className="flex items-center justify-between rounded-md border-y border-surface-dim p-4 first:border-t-0 last:border-b-0 hover:bg-surface-container-highest">
      <div className="flex items-center space-x-4">
        <div className="flex items-center justify-center rounded-full bg-surface-container-lowest">
          {details.icon}
        </div>
        <div>
          <h3 className="font-bold ">{details.title}</h3>
          <p className="text-sm">{details.description}</p>
          <span className="text-xs ">
            {new Date(
              transaction.createdAt.seconds * 1000,
            ).toLocaleDateString()}
          </span>
        </div>
      </div>
      <div className="ml-2 text-right">
        <span className={`font-medium ${details.color}`}>
          {transaction.kind === "withdraw" || transaction.kind === "send"
            ? "-"
            : "+"}
          {Math.abs(transaction.amount).toLocaleString()}
        </span>
      </div>
    </div>
  );
}
