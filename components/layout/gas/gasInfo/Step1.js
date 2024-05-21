"use client";

import { Button } from "@material-tailwind/react";
import Image from "next/image";
import TokenSelector from "@/components/ui/TokenSelector";
import AmountButton from "../AmountButton";
import { useDispatch } from "react-redux";
import { setStep } from "@/redux/slice/gasSlice";

export default function Step1() {
  const dispatch = useDispatch();
  return (
    <>
      <div className="bg-gray-200 w-full p-4 py-2 mb-2 rounded-lg relative overflow-hidden">
        <p className="text-lg font-medium z-20">About</p>
        <p className="text-xs z-20 relative w-[85%] font-light">
          Fusion Gas Credits are used to pay for transactions on any network
          supported by Fusion. The credits are stored safely in Fusion
          sub-chain, powered by AvaCloud.
        </p>

        <Image
          src="/FusionGas.png"
          width={400}
          height={50}
          className="absolute -top-12 -right-1/3 z-10 opacity-60"
        />
      </div>

      <div className=" flex items-center justify-between w-full gap-2">
        <AmountButton amount={1} />
        <AmountButton amount={2} />
        <AmountButton amount={5} />
      </div>

      <div className="flex w-full items-center justify-center space-x-4">
        <div className="mt-2 h-0.5 w-full bg-gray-400"></div>
        <p className="mt-2 text-xs text-gray-600 whitespace-nowrap">Pay with</p>
        <div className="mt-2 h-0.5 w-full bg-gray-400"></div>
      </div>

      <TokenSelector index={0} />

      <div className="flex items-center justify-between w-full mt-2">
        <p className="text-base text-gray-500">Total Cost</p>
        <p className="text-base font-medium">2 AVAX</p>
      </div>

      <Button
        color="black"
        size="sm"
        className="rounded-lg font-outfit normal-case w-full py-3 mt-1"
        onClick={() => {
          dispatch(setStep(1));
        }}
      >
        Next
      </Button>
    </>
  );
}
