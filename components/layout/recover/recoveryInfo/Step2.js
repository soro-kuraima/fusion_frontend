"use client";

import TokenSelector from "@/components/ui/TokenSelector";
import useWallet from "@/hooks/useWallet";
import {
  setGasAmount,
  setGasless,
  setPasskey,
  setPassword,
  setStep,
} from "@/redux/slice/recoverySlice";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import { Button } from "@material-tailwind/react";
import { Check, ChevronLeft, Loader2 } from "lucide-react";
import { useState, useEffect } from "react";
import {
  setRecoveryProof,
  toggleRecoveryDrawer,
} from "@/redux/slice/proofSlice";
import useRecovery from "@/hooks/useRecovery";
import { toast } from "sonner";

export default function Step2() {
  const gasless = useSelector((state) => state.recovery.gasless);
  const dispatch = useDispatch();
  const router = useRouter();
  const { getDomain } = useWallet();
  const domain = getDomain();
  const recoveryProof = useSelector((state) => state.proof.recoveryProof);
  const email = useSelector((state) => state.proof.email);
  const [, gasToken] = useSelector((state) => state.selector.token);
  const [isLoading, setIsLoading] = useState(false);
  const gasAmount = useSelector((state) => state.recovery.gasAmount);
  const { estimateGas, executeRecovery } = useRecovery();
  const walletAddress = useSelector((state) => state.user.walletAddress);
  const currentChain = useSelector((state) => state.chain.currentChain);
  const passkey = useSelector((state) => state.recovery.passkey);
  const password = useSelector((state) => state.recovery.password);

  var timeout = null;

  const handleEstimateGas = async () => {
    await estimateGas();
    setIsLoading(false);
  };

  const handleExecute = async () => {
    toast.promise(
      () =>
        executeRecovery(
          currentChain,
          gasToken,
          passkey,
          password,
          email,
          walletAddress,
          recoveryProof,
          domain,
          gasless
        ),
      {
        loading: "Processing...",
      }
    );

    dispatch(setRecoveryProof(null));
    dispatch(setStep(0));
    dispatch(setPasskey(null));
    dispatch(setPassword(""));
    router.push("/settings?domain=" + domain);
  };

  useEffect(() => {
    const abortController = new AbortController();
    if (gasToken && walletAddress && recoveryProof) {
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
  }, [gasToken, walletAddress, gasless, recoveryProof, currentChain]);

  return (
    <>
      <div className="bg-gray-300 w-full rounded-lg flex flex-col gap-2 p-4">
        <div className="flex justify-between items-center w-full">
          <p className="text-sm font-base text-gray-600">Operation</p>
          <p className="text-xs font-semibold text-gray-800">Recovery</p>
        </div>
        <div className="flex justify-between items-center w-full">
          <p className="text-sm font-base text-gray-600">Network Fees</p>
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
      </div>

      <div className="flex gap-2 w-full -mb-1 mt-1">
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

      {!recoveryProof && (
        <Button
          color="black"
          size="sm"
          className="rounded-lg font-outfit normal-case w-full py-3 mt-2 font-light"
          onClick={() => {
            dispatch(toggleRecoveryDrawer());
          }}
          disabled={!email}
        >
          Generate ZK Proof
        </Button>
      )}

      {recoveryProof && (
        <Button
          color="black"
          size="sm"
          className="rounded-lg font-outfit normal-case w-full py-3 mt-2 font-light flex items-center justify-center"
          onClick={() => {
            handleExecute();
          }}
          disabled={!email}
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
