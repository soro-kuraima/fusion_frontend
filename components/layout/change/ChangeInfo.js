"use client";

import { useSelector } from "react-redux";
import Step1 from "./changeInfo/Step1";
import Step2 from "./changeInfo/Step2";

export default function ChangeInfo() {
  const step = useSelector((state) => state.change.step);

  return (
    <div className="flex flex-col items-center -mt-2 justify-center shadow-lg gap-3 bg-white p-8 py-5 rounded-b-xl pb-7">
      {step === 0 && <Step1 />}
      {step === 1 && <Step2 />}
    </div>
  );
}
