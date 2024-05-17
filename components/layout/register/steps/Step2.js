"use client";

import { Input, Button } from "@material-tailwind/react";
import { Fingerprint, Info, Loader2Icon, Check } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { useState } from "react";
import { setPasskey, setPassword, setStep } from "@/redux/slice/signUpSlice";
import useSignup from "@/hooks/useSignup";

const Step2 = () => {
  const password = useSelector((state) => state.signup.password);
  const passkey = useSelector((state) => state.signup.passkey);
  const [isLoading, setIsLoading] = useState(false);
  const { handlePasskey } = useSignup();
  const dispatch = useDispatch();
  return (
    <div className="flex flex-col">
      <div className="mt-2">
        <Input
          label="*******"
          size="lg"
          className={"font-outfit"}
          type="password"
          value={password}
          disabled={passkey ? true : false}
          onChange={(e) => {
            dispatch(setPassword(e.target.value));
          }}
        />
        <p className="mt-2 flex text-sm text-gray-500">
          <Info size={20} className="mr-1 inline" />
          Use at least 8 characters, one uppercase, one lowercase and one
          number.
        </p>
      </div>

      <div className="mt-2 flex items-center justify-center gap-4">
        <div className="mt-2 h-0.5 w-[45%] bg-gray-400"></div>
        <p className="mt-2 text-sm text-gray-600">or</p>
        <div className="mt-2 h-0.5 w-[45%] bg-gray-400"></div>
      </div>

      <Button
        color="white"
        className="mt-4 flex h-[5.7rem] w-full font-outfit rounded-xl border-[1px] border-black bg-bg-off-white px-3"
        onClick={() => {
          handlePasskey(setIsLoading);
        }}
        disabled={isLoading || passkey ? true : false}
      >
        <div className="flex h-full w-16 items-center justify-center rounded-lg bg-black/90">
          {passkey ? (
            <Check className="h-5 w-5 text-white" />
          ) : isLoading ? (
            <Loader2Icon className="h-5 w-5 animate-spin text-white" />
          ) : (
            <Fingerprint className="h-5 w-5 text-white" />
          )}
        </div>

        <div
          className={
            "ml-3 flex h-full w-56 font-outfit flex-col justify-center text-start normal-case "
          }
        >
          <h1 className="text-xl">
            {passkey
              ? "Passkey Added"
              : isLoading
              ? "Adding Passkey"
              : "Add Passkey"}
          </h1>
          <p className="mt-1 w-72 text-xs font-normal text-gray-500">
            A safe way to access your account without a password.
          </p>
        </div>
      </Button>
      {passkey && (
        <p
          className="mt-2 text-xs text-gray-500 hover:cursor-pointer hover:underline"
          onClick={() => {
            dispatch(setPasskey(null));
          }}
        >
          Clear Passkey
        </p>
      )}

      <Button
        className="mt-8 font-outfit normal-case bg-black"
        disabled={(passkey ? false : password.length < 8) || isLoading}
        onClick={() => {
          dispatch(setStep(2));
        }}
      >
        Continue
      </Button>
    </div>
  );
};

export default Step2;
