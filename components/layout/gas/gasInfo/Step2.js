"use client";

import TokenSelector from "@/components/ui/TokenSelector";
import useBuy from "@/hooks/useBuy";
import useWallet from "@/hooks/useWallet";
import { setGasAmount, setStep } from "@/redux/slice/gasSlice";
import { setTxProof, toggleProofDrawer } from "@/redux/slice/proofSlice";
import { Button } from "@material-tailwind/react";
import { Check, ChevronLeft, Loader2 } from "lucide-react";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "sonner";

export default function Step2() {
  const dispatch = useDispatch();
  const [selectedToken, gasToken] = useSelector(
    (state) => state.selector.token
  );
  const currentChain = useSelector((state) => state.chain.currentChain);
  const amount = useSelector((state) => state.gas.amount);
  const updates = useSelector((state) => state.gas.updates);
  const [isLoading, setIsLoading] = useState(false);
  const gasAmount = useSelector((state) => state.gas.gasAmount);
  const walletAddress = useSelector((state) => state.user.walletAddress);
  const type = useSelector((state) => state.proof.type);
  const { getDomain } = useWallet();
  const domain = getDomain();

  const selectedUpdate = updates?.find(
    (update) => update.chainId === currentChain.chainId
  );
  const selectedPrice = selectedUpdate?.tokens.find(
    (update) => update.address === selectedToken?.address
  );

  const txProof = useSelector((state) => state.proof.txProof);

  var timeout = null;

  const { estimateGas, buy } = useBuy();

  const handleEstimateGas = async () => {
    await estimateGas();
    setIsLoading(false);
  };

  const handleBuy = async () => {
    toast.promise(
      () =>
        buy(
          txProof,
          selectedToken,
          gasToken,
          amount,
          currentChain,
          domain,
          walletAddress,
          selectedPrice
        ),
      {
        loading: "Processing...",
      }
    );

    dispatch(setTxProof(null));
    dispatch(setStep(0));
  };

  useEffect(() => {
    const abortController = new AbortController();
    if (
      selectedToken &&
      gasToken &&
      amount &&
      walletAddress &&
      updates &&
      txProof
    ) {
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
  }, [selectedToken, gasToken, amount, walletAddress, updates, txProof]);

  return (
    <>
      <div className="bg-gray-300 w-full rounded-lg flex flex-col gap-2 p-4">
        <div className="flex justify-between items-center w-full">
          <p className="text-sm font-base text-gray-600">Pay</p>
          <p className="text-xs font-semibold text-gray-800">
            {selectedToken && selectedPrice
              ? (selectedPrice?.creditCost * amount) /
                10 ** selectedToken?.decimals
              : "-"}{" "}
            {selectedToken?.name}
          </p>
        </div>
        <div className="flex justify-between items-center w-full">
          <p className="text-sm font-base text-gray-600">Network Fee</p>
          <p className="text-xs font-semibold text-gray-800 flex items-center">
            {isLoading ? (
              <Loader2 size={14} className="animate-spin mr-2" />
            ) : gasAmount ? (
              (gasAmount / 10 ** 18).toFixed(5)
            ) : (
              "-"
            )}{" "}
            {gasToken?.name}
          </p>
        </div>
        <div className="flex justify-between w-full">
          <p className="text-sm font-base text-gray-600">Total</p>
          <div className="flex flex-col">
            <p className="text-xs font-semibold text-right text-gray-800 flex items-center justify-end">
              {selectedToken === gasToken ? (
                isLoading ? (
                  <Loader2 size={14} className="animate-spin mr-2" />
                ) : selectedToken && selectedPrice && gasAmount ? (
                  (
                    (selectedPrice?.creditCost * amount) /
                      10 ** selectedToken?.decimals +
                    gasAmount / 10 ** 18
                  ).toFixed(5)
                ) : (
                  "- "
                )
              ) : selectedPrice && selectedToken ? (
                (selectedPrice?.creditCost * amount) /
                10 ** selectedToken?.decimals
              ) : (
                "- "
              )}{" "}
              {selectedToken?.name}
            </p>
            {selectedToken !== gasToken && (
              <p className="text-xs text-right font-semibold text-gray-800 flex items-center justify-end">
                +{" "}
                {isLoading ? (
                  <Loader2 size={14} className="animate-spin ml-1 mr-1" />
                ) : gasAmount ? (
                  (gasAmount / 10 ** 18).toFixed(5)
                ) : (
                  "-"
                )}{" "}
                {gasToken?.name}
              </p>
            )}
          </div>
        </div>
      </div>

      <div className="flex w-full items-center justify-center space-x-4">
        <div className="mt-2 h-0.5 w-full bg-gray-400"></div>
        <p className="mt-2 text-xs text-gray-600 whitespace-nowrap">
          Pay Gas with
        </p>
        <div className="mt-2 h-0.5 w-full bg-gray-400"></div>
      </div>

      <TokenSelector index={1} />

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
            handleBuy();
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
