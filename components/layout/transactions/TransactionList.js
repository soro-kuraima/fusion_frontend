"use client";

import { formatAddress } from "@/utils/FormatAddress";
import { formatAmount } from "@/utils/FormatAmount";
import { Copy, ExternalLink } from "lucide-react";
import Image from "next/image";
import React from "react";
import { useSelector } from "react-redux";
import { toast } from "sonner";

const TransactionList = ({ transaction }) => {
  const walletAddress = useSelector((state) => state.user.walletAddress);
  const isSend =
    walletAddress &&
    transaction.from === walletAddress.toString().toLowerCase();

  const currentChain = useSelector((state) => state.chain.currentChain);

  const token = transaction.tokenName
    ? currentChain.tokens.find(
        (token) =>
          token.address &&
          token.address.toLowerCase() === transaction.contractAddress
      )
    : currentChain.tokens.find((token) => token.address === null);

  function unixToFormattedTime(unixTime) {
    const date = new Date(unixTime * 1000);

    const options = {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    };

    const formattedTime = date
      .toLocaleDateString("en-GB", options)
      .replace(",", "");

    return formattedTime;
  }

  return (
    <div className="w-full gap-3 flex flex-col p-4 bg-gray-100 rounded-xl px-5">
      <div className="flex justify-between items-center w-full">
        <div
          className="flex items-center gap-1 hover:cursor-pointer"
          onClick={() => {
            if (currentChain) {
              window.open(`${currentChain.explorerUrl}/tx/${transaction.hash}`);
            }
          }}
        >
          <p className="font-semibold text-sm">{isSend ? "Send" : "Receive"}</p>
          <ExternalLink size={12} />
        </div>

        <div className="bg-green-100 p-1 rounded-lg px-2 flex gap-2 items-center">
          <p className="text-xs font-light ">Successful</p>
          <div className="bg-green-500 h-2 w-2 rounded-full"></div>
        </div>
      </div>

      <div className="flex justify-between items-center w-full text-gray-700 text-xs font-light">
        {isSend ? <p>To</p> : <p>From</p>}
        {isSend ? (
          <div
            className="text-black flex items-center gap-1 hover:cursor-pointer"
            onClick={() => {
              navigator.clipboard.writeText(transaction.to);
              toast("Copied to clipboard");
            }}
          >
            {formatAddress(transaction.to)}

            <Copy size={12} />
          </div>
        ) : (
          <div
            className="text-black flex items-center gap-1 hover:cursor-pointer"
            onClick={() => {
              navigator.clipboard.writeText(transaction.from);
              toast("Copied to clipboard");
            }}
          >
            {formatAddress(transaction.from)}

            <Copy size={12} />
          </div>
        )}
      </div>

      <div className="flex justify-between items-center w-full text-gray-700 text-xs font-light">
        <p>Token</p>

        <div className="flex gap-1 items-center">
          <Image src={token && token.logo} width={14} height={20} alt="token" />

          <p className="text-black font-normal">{token && token.name}</p>
        </div>
      </div>

      <div className="flex justify-between items-center w-full text-gray-700 text-xs font-light">
        <p>Amount</p>

        <div className="flex gap-1 items-center text-black font-normal">
          {token && formatAmount(transaction.value / 10 ** token.decimals)}{" "}
        </div>
      </div>

      <div className="flex justify-between items-center w-full text-gray-700 text-xs font-light">
        <p>Time</p>

        <div className="flex gap-1 items-center">
          <p className="text-black font-normal">
            {unixToFormattedTime(transaction.timeStamp)}
          </p>
        </div>
      </div>
    </div>
  );
};

export default TransactionList;
