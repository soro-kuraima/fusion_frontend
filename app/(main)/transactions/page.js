import TransactionList from "@/components/layout/transactions/TransactionList";
import { History } from "lucide-react";

export default function Transaction() {
  return (
    <div className="space-y-2 flex flex-grow flex-col">
      <div className="bg-white p-6 rounded-t-xl flex justify-between items-center">
        <h2 className="text-xl font-bold">Transactions</h2>

        <History size={24} />
      </div>

      <ul className="bg-white py-4 px-3 rounded-b-xl flex space-y-2 items-start flex-grow flex-col">
        <TransactionList
          address="0x1234567890"
          type="Send"
          amount="0.0001"
          date={1716387834}
        />

        <TransactionList
          address="0x1234567890"
          type="Receive"
          amount="0.0001"
          date={1716387834}
        />
      </ul>
    </div>
  );
}
