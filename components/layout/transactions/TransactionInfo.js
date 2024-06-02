"use client";

import { useSelector } from "react-redux";
import TransactionList from "./TransactionList";
import { Mouse } from "lucide-react";
import { useRef, useState, useEffect } from "react";

export default function TransactionInfo() {
  const history = useSelector((state) => state.user.history);
  const divRef = useRef(null);
  const [isOverflowing, setIsOverflowing] = useState(false);

  useEffect(() => {
    if (!divRef.current) return;

    if (divRef.current.scrollHeight > divRef.current.clientHeight) {
      setIsOverflowing(true);
    } else {
      setIsOverflowing(false);
    }
  }, [history]);

  return (
    <div className="flex flex-col items-center -mt-2 shadow-lg justify-center gap-3 bg-white p-8 py-5 rounded-b-xl pb-7">
      {history && history.length > 0 && (
        <>
          <div
            className="w-full h-80 overflow-auto no-scroll rounded-lg flex flex-col gap-3"
            ref={divRef}
          >
            {history.map((transaction, index) => (
              <TransactionList key={index} transaction={transaction} />
            ))}
          </div>

          {isOverflowing && (
            <div className="w-full flex justify-center gap-1 mt-3 text-xs font-light items-center">
              <Mouse size={15} className="animate-bounce" />
              Scroll to see more transactions
            </div>
          )}
        </>
      )}
    </div>
  );
}
