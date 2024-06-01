import TransactionHeader from "@/components/layout/transactions/TransactionHeader";
import TransactionInfo from "@/components/layout/transactions/TransactionInfo";
import { Suspense } from "react";

export default function Transaction() {
  return (
    <Suspense>
      <TransactionHeader />
      <TransactionInfo />
    </Suspense>
  );
}
