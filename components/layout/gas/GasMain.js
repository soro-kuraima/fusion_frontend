"use client";

import Image from "next/image";
import GasStepper from "./GasStepper";
import GasInfo from "./GasInfo";

export default function GasMain() {
  return (
    <>
      {/* <div className="h-28 w-full bg-white rounded-xl relative overflow-hidden ">
        <Image
          src="/FusionGas2.png"
          alt="Gas"
          width={470}
          height={200}
          className="absolute translate-x-1/2 -left-1/2 -top-20  z-0"
        />
      </div> */}

      <GasStepper />
      <GasInfo />
    </>
  );
}
