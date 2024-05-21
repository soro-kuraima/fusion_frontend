"use client";

import { Button } from "@material-tailwind/react";
import Image from "next/image";

import React from "react";

const Gas = () => {
  return (
    <div className="bg-white py-1 px-2 rounded-full flex items-center gap-2">
      <Image src="/tokens/gas-token.svg" width={20} height={20} alt="Gas" />

      <div>
        <span>10</span>
        <span className="ml-1 font-medium">GAS</span>
      </div>

      <Button
        size="sm"
        className="rounded-full p-0 h-5 w-5 flex items-center justify-center text-xl font-light"
      >
        +
      </Button>
    </div>
  );
};

export default Gas;
