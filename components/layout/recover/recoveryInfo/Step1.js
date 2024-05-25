"use client";

import { Input, Button } from "@material-tailwind/react";
import {
  Check,
  ChevronRight,
  Fingerprint,
  Info,
  Loader2Icon,
} from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { useState } from "react";
import { setPasskey, setPassword, setStep } from "@/redux/slice/recoverySlice";
import Image from "next/image";
import useRecovery from "@/hooks/useRecovery";

export default function Step1() {
  const passkey = useSelector((state) => state.recovery.passkey);
  const [isLoading, setIsLoading] = useState(false);
  const dispatch = useDispatch();
  const password = useSelector((state) => state.recovery.password);
  const { handlePasskey } = useRecovery();

  return (
    <>
      <div className="bg-gray-200 w-full p-4 py-2 rounded-lg relative overflow-hidden">
        <p className="text-lg font-medium z-20">Info</p>
        <p className="text-xs z-20 relative w-[85%] font-light">
          Forgot your password or lost your passkey? You can recover your
          account using your recovery email address. You will be required to
          verify your email address.
        </p>

        <Image
          src="/LockIcon.png"
          alt="Fusion Gas"
          width={150}
          height={50}
          className="absolute -top-2 -right-6 z-10 opacity-60"
        />
      </div>

      <Input
        label="Enter new Password"
        placeholder="********"
        type="password"
        className="font-outfit placeholder:opacity-100"
        containerProps={{
          className: "mt-2",
        }}
        size="lg"
        shrink={true}
        value={password}
        disabled={passkey ? true : false}
        onChange={(e) => {
          dispatch(setPassword(e.target.value));
        }}
      />
      <p className="-mt-1 flex text-xs text-gray-500 ">
        <Info size={16} className="mr-1 inline" />
        Use at least 8 characters, one uppercase, one lowercase and one number.
      </p>

      <div className="flex w-full items-center justify-center space-x-4 -mt-1">
        <div className="mt-2 h-0.5 w-full bg-gray-400"></div>
        <p className="mt-2 text-xs text-gray-600 whitespace-nowrap">Or</p>
        <div className="mt-2 h-0.5 w-full bg-gray-400"></div>
      </div>

      <Button
        color="white"
        className=" my-2 flex h-[5.7rem] w-full font-outfit rounded-xl border-[1px] border-black bg-bg-off-white px-3"
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
          className="-mt-2 text-left w-full text-xs text-gray-500 hover:cursor-pointer hover:underline"
          onClick={() => {
            dispatch(setPasskey(null));
          }}
        >
          Clear Passkey
        </p>
      )}

      <Button
        color="black"
        size="sm"
        className="rounded-lg font-outfit normal-case w-full py-3 mt-1 font-light flex items-center justify-center"
        onClick={() => {
          dispatch(setStep(1));
        }}
        disabled={password.length < 8 && (passkey ? false : true)}
      >
        Next
        <ChevronRight size={16} className="-mr-2 ml-2" />
      </Button>
    </>
  );
}
