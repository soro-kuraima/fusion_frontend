"use client";

import useSignup from "@/hooks/useSignup";
import { ClearAll, setStep } from "@/redux/slice/signUpSlice";
import { Button } from "@material-tailwind/react";
import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";

export default function Step4() {
  const { deployWallet } = useSignup();
  const [isLoading, setIsLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const router = useRouter();
  const dispatch = useDispatch();
  const domain = useSelector((state) => state.signup.domain);

  return (
    <div className="flex flex-col">
      {!success && !isLoading && (
        <>
          <p className="mt-2 font-noto text-sm text-gray-600 text-center">
            Your Wallet is ready to deploy. Click the button below to deploy
            your wallet.
          </p>

          <Button
            className="mt-8 normal-case font-outfit bg-black"
            onClick={() => {
              deployWallet(setIsLoading, setSuccess);
            }}
          >
            Deploy
          </Button>
          <Button
            className="mt-3 normal-case font-outfit bg-gray-600"
            onClick={() => {
              dispatch(setStep(0));
            }}
          >
            Go Back
          </Button>
        </>
      )}

      {isLoading && !success && (
        <div className="flex items-center justify-center gap-2">
          <Loader2 className="h-5 w-5 animate-spin text-gray-500" />
          <p className=" flex text-sm text-gray-500 text-center">
            Deploying your wallet...
          </p>
        </div>
      )}

      {success && (
        <div className="flex items-center flex-col">
          <p className="mt-2 flex text-sm text-gray-600 text-center">
            Your wallet has been deployed successfully.
          </p>

          <Button
            className="mt-8 normal-case font-outfit bg-black"
            onClick={() => {
              router.push("/dashboard?domain=" + domain);
              dispatch(ClearAll());
            }}
            fullWidth
          >
            Go to Dashboard
          </Button>
        </div>
      )}
    </div>
  );
}
