"use client";

import TokenSelector from "@/components/ui/TokenSelector";
import useExecute from "@/hooks/useExecute";
import useWallet from "@/hooks/useWallet";
import { setTxProof, toggleProofDrawer } from "@/redux/slice/proofSlice";
import {
  setAmount,
  setGasAmount,
  setGasless,
  setStep,
} from "@/redux/slice/transferSlice";
import { formatAddress } from "@/utils/FormatAddress";
import { Button } from "@material-tailwind/react";
import { Check, ChevronLeft, Loader2 } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "sonner";

export default function Step2() {
  const dispatch = useDispatch();
  const txProof = useSelector((state) => state.proof.txProof);
  const type = useSelector((state) => state.proof.type);
  const [selectedToken, gasToken] = useSelector(
    (state) => state.selector.token
  );
  const recipient = useSelector((state) => state.transfer.recipient);
  const router = useRouter();
  const { getDomain } = useWallet();
  const domain = getDomain();
  const gasless = useSelector((state) => state.transfer.gasless);
  const amount = useSelector((state) => state.transfer.amount);
  const { estimateGas, execute } = useExecute();
  const walletAddress = useSelector((state) => state.user.walletAddress);
  const gasAmount = useSelector((state) => state.transfer.gasAmount);
  const [isLoading, setIsLoading] = useState(false);
  const currentChain = useSelector((state) => state.chain.currentChain);

  var timeout = null;

  const handleExecute = async () => {
    console.log;
    toast.promise(
      () =>
        execute(
          currentChain,
          amount,
          selectedToken,
          gasToken,
          recipient,
          txProof,
          gasless,
          walletAddress
        ),
      {
        loading: "Processing...",
      }
    );

    dispatch(setTxProof(null));
    dispatch(setStep(0));
    dispatch(setAmount(0));
  };

  const handleEstimateGas = async () => {
    await estimateGas();
    setIsLoading(false);
  };

  useEffect(() => {
    const abortController = new AbortController();
    if (selectedToken && gasToken && amount && walletAddress && txProof) {
      clearTimeout(timeout);
      setIsLoading(true);

      timeout = setTimeout(() => {
        handleEstimateGas(abortController.signal);
      }, 1000);
    } else {
      dispatch(setGasAmount(null));
    }

    return () => {
      abortController.abort();
      clearTimeout(timeout);
    };
  }, [selectedToken, gasToken, amount, walletAddress, gasless, txProof]);

  return (
    <>
      <div className="bg-gray-300 w-full rounded-lg flex flex-col gap-2 p-4">
        <div className="flex justify-between items-center w-full">
          <p className="text-sm font-base text-gray-600">Recipient</p>
          <p className="text-xs font-semibold text-gray-800">
            {recipient && formatAddress(recipient)}
          </p>
        </div>
        <div className="flex justify-between items-center w-full">
          <p className="text-sm font-base text-gray-600">Pay</p>
          <p className="text-xs font-semibold text-gray-800">
            {Number(amount)?.toFixed(4)} {selectedToken?.name}
          </p>
        </div>
        <div className="flex justify-between items-center w-full">
          <p className="text-sm font-base text-gray-600">Network Fee</p>
          <div className="text-xs font-semibold text-gray-800 flex items-center">
            {isLoading ? (
              <Loader2 size={14} className="animate-spin mr-2" />
            ) : gasAmount ? (
              (gasAmount / 10 ** 18).toFixed(5)
            ) : (
              "-"
            )}{" "}
            {gasless ? (
              <div
                className="w-5 h-5"
                style={{
                  backgroundColor: "black",
                  maskImage: "url(/tokens/gas-logo.svg)",
                  maskSize: "cover",
                }}
              ></div>
            ) : (
              gasToken?.name
            )}
          </div>
        </div>
        <div className="flex justify-between w-full">
          <p className="text-sm font-base text-gray-600">Total</p>
          <div className="flex flex-col">
            <p className="text-xs font-semibold text-right text-gray-800 flex items-center justify-end">
              {selectedToken === gasToken && !gasless ? (
                isLoading ? (
                  <Loader2 size={14} className="animate-spin mr-2" />
                ) : selectedToken && gasAmount ? (
                  Number(Number(amount) + Number(gasAmount) / 10 ** 18).toFixed(
                    5
                  )
                ) : (
                  "- "
                )
              ) : (
                Number(amount)?.toFixed(4)
              )}{" "}
              {selectedToken?.name}
            </p>
            {(selectedToken !== gasToken || gasless) && (
              <div className="text-xs text-right font-semibold text-gray-800 flex items-center justify-end">
                +{" "}
                {isLoading ? (
                  <Loader2 size={14} className="animate-spin mr-1 ml-1" />
                ) : gasAmount ? (
                  (gasAmount / 10 ** 18).toFixed(5)
                ) : (
                  "-"
                )}{" "}
                {gasless ? (
                  <div
                    className="w-5 h-5"
                    style={{
                      backgroundColor: "black",
                      maskImage: "url(/tokens/gas-logo.svg)",
                      maskSize: "cover",
                    }}
                  ></div>
                ) : (
                  gasToken?.name
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="flex gap-2 w-full -mb-1">
        <Button
          size="sm"
          className="w-full flex items-center justify-center font-outfit text-xs font-normal rounded-lg py-3 "
          style={{
            backgroundColor: !gasless ? "black" : "#eeeeee",
            color: !gasless ? "white" : "black",
          }}
          onClick={() => {
            dispatch(setGasless(false));
          }}
        >
          <p>Gas</p>
        </Button>

        <Button
          size="sm"
          className="w-full flex items-center justify-center font-outfit text-xs font-normal rounded-lg py-3 "
          style={{
            backgroundColor: gasless ? "black" : "#eeeeee",
            color: gasless ? "white" : "black",
          }}
          onClick={() => {
            dispatch(setGasless(true));
          }}
        >
          <p>Gasless</p>
          <div
            className="w-5 h-5"
            style={{
              backgroundColor: gasless ? "#FFD700" : "gray",
              maskImage: "url(/tokens/gas-logo.svg)",
              maskSize: "cover",
            }}
          ></div>
        </Button>
      </div>

      {!gasless && (
        <>
          <div className="flex w-full items-center justify-center space-x-4">
            <div className="mt-2 h-0.5 w-full bg-gray-400"></div>
            <p className="mt-2 text-xs text-gray-600 whitespace-nowrap">
              Pay Gas with
            </p>
            <div className="mt-2 h-0.5 w-full bg-gray-400"></div>
          </div>

          <TokenSelector index={1} />
        </>
      )}

      {gasless && (
        <div className="bg-gray-200 w-full p-4 py-2 -mb-1 mt-3 rounded-lg relative overflow-hidden">
          <p className="text-lg font-medium z-20">About</p>
          <p className="text-xs z-20 relative w-[85%] font-light">
            Fusion Gas Credits are used to pay for transactions on any network
            supported by Fusion. The credits are stored safely in Fusion
            sub-chain.{" "}
            <span
              className=" font-normal underline cursor-pointer"
              onClick={() => {
                router.push("/gas?domain=" + domain);
                dispatch(setStep(0));
              }}
            >
              Get more credits
            </span>
          </p>

          <Image
            src="/FusionGas.png"
            alt="Fusion Gas"
            width={400}
            height={50}
            className="absolute -top-12 -right-1/3 z-10 opacity-60"
          />
        </div>
      )}

      {!txProof && (
        <Button
          color="black"
          size="sm"
          className="rounded-lg font-outfit normal-case w-full py-3 mt-2 font-light"
          onClick={() => {
            dispatch(toggleProofDrawer());
          }}
          disabled={!type}
        >
          Generate ZK Proof
        </Button>
      )}

      {txProof && (
        <Button
          color="black"
          size="sm"
          className="rounded-lg font-outfit normal-case w-full py-3 mt-2 font-light flex items-center justify-center"
          onClick={() => {
            handleExecute();
          }}
          disabled={!type}
        >
          Confirm Transaction <Check size={16} className="ml-2 animate-pulse" />
        </Button>
      )}

      <Button
        size="sm"
        className="rounded-lg font-outfit normal-case w-full py-3 bg-gray-600 font-light flex items-center justify-center"
        onClick={() => {
          dispatch(setStep(0));
        }}
      >
        <ChevronLeft size={16} className="mr-2 -ml-2" />
        Back
      </Button>
    </>
  );
}
