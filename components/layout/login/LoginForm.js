"use client";

import useWallet from "@/hooks/useWallet";
import { Card, Input, Button, Typography } from "@material-tailwind/react";
import { ethers } from "ethers";
import { Info, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";

import { useRef, useState, useEffect } from "react";

const LoginForm = () => {
  const inputRef = useRef();
  const [domain, setDomain] = useState("");
  const [isUsed, setIsUsed] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { getFusion } = useWallet();
  const router = useRouter();

  var timeout = null;

  const handleName = (e) => {
    if (e.target.value.length > 20) {
      setDomain(
        e.target.value
          .slice(0, 20)
          .replace(/[^a-zA-Z0-9]/g, "")
          ?.toLowerCase()
      );
    } else {
      setDomain(e.target.value.replace(/[^a-zA-Z0-9]/g, "")?.toLowerCase());
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
    <Card color="transparent" shadow={false} className="w-fit mx-10">
      <div className="p-5 bg-white rounded-t-xl">
        <Typography
          variant="h4"
          color="blue-gray"
          className="text-center font-outfit"
        >
          Login to your account
        </Typography>

        <form className="mt-8 mb-2 w-80 max-w-screen-lg sm:w-96">
          <div className="mb-1 flex flex-col gap-6">
            <div className="mt-2 flex w-full">
              <Input
                variant="standard"
                label="Your Fusion Domain"
                placeholder="vitalik"
                className="font-outfit"
                ref={inputRef}
                onChange={(e) => handleName(e)}
                value={domain}
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
          </div>

          {isLoading && domain.length > 3 && (
            <p className="mt-2 flex text-sm text-text-gray">
              <Loader2 size={20} className="mr-1 inline animate-spin " />
              Checking availability...
            </p>
          )}

          {!isLoading && !isUsed && domain.length > 3 && (
            <p className="mt-2 flex text-sm text-red-500">
              <Info size={20} className="mr-1 inline" />
              This domain is not registered.
            </p>
          )}

          <Button
            className="mt-6 font-outfit normal-case"
            fullWidth
            disabled={
              domain.length <= 3 ||
              domain.length > 20 ||
              !isUsed ||
              isLoading ||
              isTyping
            }
            onClick={() => {
              router.push("/dashboard?domain=" + domain);
            }}
          >
            Login
          </Button>
        </form>
      </div>

      <div className="border-[20px] border-white rounded-2xl p-8 -translate-y-5"></div>
    </Card>
  );
};

export default LoginForm;
