"use client";

import { setToken, toggleTokenDrawer } from "@/redux/slice/selectorSlice";
import { useDispatch, useSelector } from "react-redux";
import { Dialog, DialogBody } from "@material-tailwind/react";
import { Copy } from "lucide-react";
import Image from "next/image";
import { formatAddress } from "@/utils/FormatAddress";
import { ethers } from "ethers";
import { toast } from "sonner";
import { formatAmount } from "@/utils/FormatAmount";

export default function TokenModal() {
  const dispatch = useDispatch();
  const tokenDrawer = useSelector((state) => state.selector.tokenDrawer);
  const open = useSelector((state) => state.selector.tokenDrawer);
  const currentChain = useSelector((state) => state.chain.currentChain);
  const walletAddress = useSelector((state) => state.user.walletAddress);
  const tokenBalanceData = useSelector((state) => state.user.tokenBalanceData);
  const tokenConversionData = useSelector(
    (state) => state.user.tokenConversionData
  );
  const tokenIndex = useSelector((state) => state.selector.tokenIndex);

  const handleDrawer = () => {
    dispatch(toggleTokenDrawer());
  };

  return (
    <Dialog
      size="sm"
      open={open}
      handler={handleDrawer}
      animate={{
        mount: { scale: 1, y: 0 },
        unmount: { scale: 0.9, y: -100 },
      }}
      className="font-outfit bg-transparent items-center justify-center flex shadow-none"
    >
      <DialogBody className="text-center gap-y-4 py-5 font-outfit bg-white rounded-2xl w-full max-w-[29rem] px-5 pb-3">
        <div className="flex justify-between items-center text-black mb-3 px-5">
          <p className="font-medium text-lg">Select Token</p>

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
              className=" flex items-center px-5 justify-between rounded-xl text-black hover:bg-gray-300 border-t-2 border-gray-200 py-3 hover:cursor-pointer transition-colors duration-300 "
              onClick={() => {
                dispatch(
                  setToken({
                    index: tokenIndex,
                    token: token,
                  })
                );
                dispatch(toggleTokenDrawer());
              }}
            >
              <div className="flex gap-3 items-center">
                <Image
                  src={token.logo}
                  alt="TokenLogo"
                  width={35}
                  height={30}
                />
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
      </DialogBody>
    </Dialog>
  );
}
