"use client";

import TokenSelector from "@/components/ui/TokenSelector";
import useWallet from "@/hooks/useWallet";
import { setAmount, setRecipient, setStep } from "@/redux/slice/transferSlice";
import { Button, Input } from "@material-tailwind/react";
import { ChevronRight, Info, Loader2 } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { useRef, useState, useEffect } from "react";
import { ethers } from "ethers";

export default function Step1() {
  const dispatch = useDispatch();
  const recipient = useSelector((state) => state.transfer.recipient);
  const { getFusionCurrent: getFusion, getDomain } = useWallet();
  const domain = getDomain();
  const [isLoading, setIsLoading] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const inputRef = useRef(null);
  var inputTimeout = null;
  const walletAddress = useSelector((state) => state.user.walletAddress);
  const [isValid, setIsValid] = useState(false);

  const [selectedToken] = useSelector((state) => state.selector.token);

  const tokenBalanceData = useSelector((state) => state.user.tokenBalanceData);

  const tokenBalance = tokenBalanceData?.find((token) => {
    return token.address === selectedToken.address;
  });

  const amount = useSelector((state) => state.transfer.amount);

  useEffect(() => {
    const abortController = new AbortController();
    if (!inputRef.current) return;
    inputRef.current.addEventListener("keydown", function () {
      clearTimeout(inputTimeout);

      inputTimeout = setTimeout(() => {
        setIsTyping(false);
      }, 1000);

      setIsTyping(true);
    });

    return () => {
      clearTimeout(inputTimeout);
      abortController.abort();
    };
  }, []);

  useEffect(() => {
    if (isTyping) {
      setIsLoading(true);
    } else {
      checkFusion();
    }
  }, [isTyping, recipient]);

  const checkFusion = async () => {
    setIsLoading(true);

    if (!recipient) {
      setIsValid(false);
      setIsLoading(false);
      return;
    }

    if (recipient.startsWith("0x") && recipient.length === 42) {
      if (walletAddress === recipient) {
        setIsValid(false);
        setIsLoading(false);
        return;
      }
      setIsValid(true);
      setIsLoading(false);
      return;
    }

    if (!recipient.includes(".fusion.id") && recipient.length >= 6) {
      setIsValid(false);
      setIsLoading(false);
      return;
    }

    if (recipient.length < 6) {
      setIsValid(false);
      setIsLoading(false);
      return;
    }

    if (
      recipient.split(".fusion.id")[0]?.toLowerCase() === domain?.toLowerCase()
    ) {
      setIsValid(false);
      setIsLoading(false);
      return;
    }

    const address = await getFusion(
      recipient.split(".fusion.id")[0]?.toLowerCase()
    );

    if (address === ethers.constants.AddressZero) {
      setIsValid(false);
      setIsLoading(false);
      return;
    }

    dispatch(setRecipient(address));
    setIsValid(true);
    setIsLoading(false);
  };

  return (
    <>
      <Input
        label="Enter Recipient"
        placeholder="vitalik.fusion.id"
        className="font-outfit placeholder:opacity-100"
        containerProps={{
          className: "mt-2",
        }}
        size="lg"
        shrink={true}
        value={recipient}
        onChange={(e) => {
          dispatch(setRecipient(e.target.value));
        }}
        ref={inputRef}
      />

      <div className="-mt-3 w-full">
        {!recipient && (
          <div className={"mt-2 text-xs flex items-center text-gray-600"}>
            <Info size={14} className="inline mr-1" />
            Enter a valid Fusion domain or an arbitrary address.
          </div>
        )}

        {isLoading && recipient && (
          <div className={"mt-2 flex items-center "}>
            <Loader2 className="animate-spin -mt-0.5 mr-2" size={14} />
            <span className="text-xs">Checking domain...</span>
          </div>
        )}

        {!isLoading && recipient && !isValid && (
          <div className={"mt-2 text-xs flex text-red-600 "}>
            <Info size={14} className="inline mt-0.5 mr-1" />
            Fusion domain or address is invalid.
          </div>
        )}

        {!isLoading && recipient && isValid && (
          <div className={"mt-2 text-xs flex text-green-600 "}>
            <Info size={14} className="inline mt-0.5 mr-1" />
            The Address is valid.
          </div>
        )}
      </div>

      <div className="relative w-full">
        <Input
          label="Enter Amount"
          placeholder="0"
          className="font-outfit placeholder:opacity-100 pr-16"
          containerProps={{
            className: "mt-2 min-w-0",
          }}
          size="lg"
          shrink={true}
          value={amount}
          onChange={(e) => {
            const decimalRegex = /^[0-9]*\.?[0-9]*$/;
            if (e.target.value.match(decimalRegex)) {
              dispatch(setAmount(e.target.value));
            }
          }}
        />
        <div className="absolute top-[0.91rem] right-2">
          <Button
            className="rounded-lg text-[0.6rem] flex items-center justify-center font-normal p-2"
            onClick={() => {
              if (!tokenBalance) return;
              dispatch(
                setAmount(tokenBalance?.balance / 10 ** tokenBalance?.decimals)
              );
            }}
          >
            MAX
          </Button>
        </div>
      </div>

      <div className="flex w-full items-center justify-center space-x-4 -mt-1">
        <div className="mt-2 h-0.5 w-full bg-gray-400"></div>
        <p className="mt-2 text-xs text-gray-600 whitespace-nowrap">
          Select Token
        </p>
        <div className="mt-2 h-0.5 w-full bg-gray-400"></div>
      </div>

      <TokenSelector index={0} className="mt-1" />

      <Button
        color="black"
        size="sm"
        className="rounded-lg font-outfit normal-case w-full py-3 mt-1 font-light flex items-center justify-center"
        onClick={() => {
          dispatch(setStep(1));
        }}
        disabled={
          !isValid ||
          !recipient ||
          !amount ||
          amount > tokenBalance?.balance / 10 ** tokenBalance?.decimals
        }
      >
        Next
        <ChevronRight size={16} className="-mr-2 ml-2" />
      </Button>
    </>
  );
}
