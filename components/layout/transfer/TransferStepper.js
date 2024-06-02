"use client";

import { Step, Stepper } from "@material-tailwind/react";
import { useSelector } from "react-redux";

export default function TransferStepper() {
  const step = useSelector((state) => state.transfer.step);

  return (
    <div className="flex w-full flex-col items-center bg-white shadow-lg rounded-t-2xl gap-3 py-5">
      <p className=" font-normal text-sm text-gray-700">Transfer</p>

      <Stepper
        activeStep={step}
        lineClassName="bg-transparent"
        activeLineClassName="bg-transparent"
        className="w-fit gap-2"
      >
        <Step
          className="relative h-2 w-20 bg-gray-400 cursor-pointer"
          onClick={() => {}}
        >
          {/* <UserRound className="h-4 w-4" /> */}
        </Step>
        <Step
          className="relative h-2 w-20 bg-gray-400 cursor-pointer"
          onClick={() => {}}
        >
          {/* <UserRound className="h-4 w-4" /> */}
        </Step>
      </Stepper>
    </div>
  );
}
