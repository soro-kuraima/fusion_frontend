"use client";

import TokenSelector from "@/components/ui/TokenSelector";
import { setStep } from "@/redux/slice/transferSlice";
import { Button, Input } from "@material-tailwind/react";
import { ChevronRight } from "lucide-react";
import { useDispatch } from "react-redux";

export default function Step1() {
  const dispatch = useDispatch();

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
      />

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
        />
        <div className="absolute top-[0.91rem] right-2">
          <Button className="rounded-lg text-[0.6rem] flex items-center justify-center font-normal p-2">
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
      >
        Next
        <ChevronRight size={16} className="-mr-2 ml-2" />
      </Button>
    </>
  );
}
