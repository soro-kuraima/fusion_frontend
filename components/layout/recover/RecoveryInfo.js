"use client";

import { useSelector } from "react-redux";
import Step1 from "./recoveryInfo/Step1";
import Step2 from "./recoveryInfo/Step2";

export default function RecoveryInfo() {
  const step = useSelector((state) => state.recovery.step);

  return (
    <div className="flex flex-col shadow-lg items-center -mt-2 justify-center gap-3 bg-white p-8 py-5 rounded-b-xl pb-7">
      {step === 0 && <Step1 />}
      {step === 1 && <Step2 />}
    </div>
  );
}
