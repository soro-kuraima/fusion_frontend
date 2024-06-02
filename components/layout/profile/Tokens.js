"use client";

import { formatAddress } from "@/utils/FormatAddress";
import { formatAmount } from "@/utils/FormatAmount";
import { ethers } from "ethers";
import { Copy } from "lucide-react";
import Image from "next/image";
import { useSelector } from "react-redux";
import { toast } from "sonner";

export default function Tokens() {
  const currentChain = useSelector((state) => state.chain.currentChain);
  const walletAddress = useSelector((state) => state.user.walletAddress);
  const tokenBalanceData = useSelector((state) => state.user.tokenBalanceData);
  const tokenConversionData = useSelector(
    (state) => state.user.tokenConversionData
  );

  return (
    <div className="text-center gap-3 flex shadow-lg flex-col bg-white p-8 py-6 rounded-b-xl -mt-2.5 relative">
      <div className="flex justify-between items-center">
        <p className="font-medium text-lg">Tokens</p>

        <div className="flex gap-2 items-center">
          <Image
            src={currentChain?.logo}
            alt="ChainLogo"
            width={20}
            height={20}
          />

          <p className="text-xs">
            {" "}
            {walletAddress ? formatAddress(walletAddress) : "-"}{" "}
          </p>

          <Copy
            size={16}
            className="hover:cursor-pointer"
            onClick={() => {
              if (
                !walletAddress ||
                walletAddress === ethers.constants.AddressZero
              )
                return;
              navigator.clipboard.writeText(walletAddress);
              toast.success("Copied to clipboard");
            }}
          />
        </div>
      </div>

      {currentChain?.tokens.map((token) => {
        const tokenBalance = tokenBalanceData?.find(
          (balance) => balance.address === token.address
        );

        const tokenConversion = tokenConversionData?.find(
          (conversion) => conversion.address === token.address
        );

        return (
          <div
            key={token.address}
            className="flex mt-1 items-center justify-between border-t-2 border-gray-200 pt-3"
          >
            <div className="flex gap-3 items-center">
              <Image src={token.logo} alt="TokenLogo" width={35} height={30} />
              <p>{token.name}</p>
            </div>

            <div className="flex flex-col ">
              <p className="text-base">
                {tokenBalance
                  ? tokenBalance.balance
                    ? `${formatAmount(
                        tokenBalance.balance / 10 ** token.decimals
                      )} ${token.symbol}`
                    : "0" + " " + token.symbol
                  : "0" + " " + token.symbol}
              </p>
              <p className="text-xs text-right text-gray-800">
                {tokenConversion && tokenBalance
                  ? `${
                      tokenConversion.value && tokenBalance.balance
                        ? `$${formatAmount(
                            tokenBalance.balance /
                              10 ** token.decimals /
                              tokenConversion.value
                          )}`
                        : "$ 0"
                    }`
                  : "-"}
              </p>
            </div>
          </div>
        );
      })}
    </div>
  );
}
