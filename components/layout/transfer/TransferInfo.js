"use client";

import { useSelector } from "react-redux";
import Step1 from "./transferInfo/Step1";
import Step2 from "./transferInfo/Step2";

export default function TransferInfo() {
  const step = useSelector((state) => state.transfer.step);
  return (
    <div className="flex flex-col items-center -mt-2 justify-center shadow-lg gap-3 bg-white p-8 py-5 font-outfit rounded-b-xl pb-7">
      {step === 0 && <Step1 />}
      {step === 1 && <Step2 />}
    </div>
  );
}
