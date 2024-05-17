"use client";

import { Input, Button } from "@material-tailwind/react";
import { useRef, useState, useEffect } from "react";
import useWallet from "@/hooks/useWallet";
import { ethers } from "ethers";
import { Info, Loader2 } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { setDomain, setStep } from "@/redux/slice/signUpSlice";

const Step1 = () => {
  const inputRef = useRef();
  const domain = useSelector((state) => state.signup.domain);
  const [isUsed, setIsUsed] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { getFusion } = useWallet();
  const dispatch = useDispatch();

  var timeout = null;

  const handleName = (e) => {
    if (e.target.value.length > 20) {
      dispatch(
        setDomain(
          e.target.value
            .slice(0, 20)
            .replace(/[^a-zA-Z0-9]/g, "")
            ?.toLowerCase()
        )
      );
    } else {
      dispatch(
        setDomain(e.target.value.replace(/[^a-zA-Z0-9]/g, "")?.toLowerCase())
      );
    }
  };

  const checkFusion = async () => {
    if (domain.length < 3) return;
    if (domain.length > 20) return;

    const address = await getFusion(domain.toLowerCase());

    if (address === ethers.constants.AddressZero) {
      setIsUsed(false);
      setIsLoading(false);
      return;
    }

    setIsUsed(true);
    setIsLoading(false);
  };

  useEffect(() => {
    if (!inputRef.current) return;
    const controller = new AbortController();
    const signal = controller.signal;

    inputRef.current.addEventListener("keydown", function () {
      clearTimeout(timeout);

      timeout = setTimeout(function () {
        if (signal.aborted) return;
        setIsTyping(false);
      }, 1000);

      setIsTyping(true);
    });

    return () => {
      controller.abort();
    };
  }, []);

  useEffect(() => {
    if (isTyping) {
      setIsLoading(true);
    } else {
      checkFusion();
    }
  }, [isTyping, domain]);

  return (
    <div className="flex flex-col">
      <div className="mt-2 flex w-full">
        <Input
          variant="standard"
          label="Choose your domain"
          placeholder="vitalik"
          className="font-outfit"
          ref={inputRef}
          value={domain}
          onChange={handleName}
        />

        <Button
          ripple={false}
          variant="text"
          color="blue-gray"
          className={
            "flex items-center rounded-none border font-outfit hover:bg-transparent active:bg-transparent border-x-0 border-t-0 border-blue-gray-200 px-3 py-0 text-sm font-bold normal-case"
          }
        >
          .fusion.id
        </Button>
      </div>

      {isLoading && domain.length > 3 && (
        <p className="mt-2 flex text-sm text-gray-500">
          <Loader2 size={20} className="mr-1 inline animate-spin " />
          Checking availability...
        </p>
      )}

      {!isLoading && isUsed && (
        <p className="mt-2 flex text-sm text-red-500">
          <Info size={20} className="mr-1 inline" />
          This domain is already taken.
        </p>
      )}

      {!isLoading && !isUsed && domain.length > 3 && (
        <p className="mt-2 flex text-sm text-green-500">
          <Info size={20} className="mr-1 inline" />
          This domain is available.
        </p>
      )}

      <Button
        size="md"
        className="mt-8 bg-black font-outfit normal-case"
        fullWidth
        disabled={
          domain.length <= 3 ||
          domain.length > 20 ||
          isUsed ||
          isLoading ||
          isTyping
        }
        onClick={() => {
          dispatch(setStep(1));
        }}
      >
        Select Domain
      </Button>
    </div>
  );
};

export default Step1;
