"use client";

import useChange from "@/hooks/useChange";
import { setEmail, setStep, setRecoveryHash } from "@/redux/slice/changeSlice";
import { Input, Button } from "@material-tailwind/react";
import { ChevronRight } from "lucide-react";
import Image from "next/image";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";

export default function Step1() {
  const recoveryHash = useSelector((state) => state.change.recoveryHash);
  const dispatch = useDispatch();
  const email = useSelector((state) => state.change.email);
  const [isLoading, setIsLoading] = useState(false);
  const { handleEmail } = useChange();

  const isValidEmail = (email) => {
    const re = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/g;
    return re.test(email);
  };

  return (
    <>
      <div className="bg-gray-200 w-full p-4 py-2 rounded-lg relative overflow-hidden">
        <p className="text-lg font-medium z-20">Info</p>
        <p className="text-xs z-20 relative w-[85%] font-light">
          Change your recovery email address to secure your account. You will be
          required to verify your new email address as well as your old email
          address.
        </p>

        <Image
          src="/ShieldIcon.png"
          alt="Fusion Gas"
          width={150}
          height={50}
          className="absolute -top-2 -right-6 z-10 opacity-60"
        />
      </div>

      <Input
        label="Enter your email address"
        placeholder="abc@xyz.com"
        className="font-outfit placeholder:opacity-100 disabled:border-[1px]"
        containerProps={{
          className: "mt-2",
        }}
        labelProps={{
          className: "peer-disabled:text-gray-500",
        }}
        size="lg"
        shrink={true}
        disabled={recoveryHash ? true : false || isLoading}
        value={email}
        onChange={(e) => {
          dispatch(setEmail(e.target.value));
        }}
      />

      {recoveryHash && (
        <p
          className="-mt-2 text-left w-full text-xs text-gray-500 hover:cursor-pointer hover:underline"
          onClick={() => {
            dispatch(setRecoveryHash(null));
          }}
        >
          Clear Email
        </p>
      )}

      {!recoveryHash && (
        <Button
          color="black"
          size="sm"
          className="rounded-lg font-outfit normal-case w-full py-3 mt-1 font-light flex items-center justify-center"
          onClick={() => {
            handleEmail(setIsLoading);
          }}
          disabled={!isValidEmail(email) || isLoading}
          loading={isLoading}
        >
          Verify Email
          <ChevronRight size={16} className="-mr-2 ml-2" />
        </Button>
      )}

      {recoveryHash && (
        <Button
          color="black"
          size="sm"
          className="rounded-lg font-outfit normal-case w-full py-3 mt-1 font-light flex items-center justify-center"
          onClick={() => {
            dispatch(setStep(1));
          }}
        >
          Next
          <ChevronRight size={16} className="-mr-2 ml-2" />
        </Button>
      )}
    </>
  );
}
