"use client";

import { Button } from "@material-tailwind/react";
import { Plus } from "lucide-react";
import Image from "next/image";

import React from "react";

const Gas = () => {
  return (
    <div className="bg-white py-1 px-2 rounded-full flex items-center gap-2">
      <Image
        src="/tokens/gas-logo.svg"
        alt="Gas"
        width={20}
        height={20}
        className="-mr-1"
      />

      <div className="text-sm">
        <span>10</span>
        <span className="ml-1 font-medium">GAS</span>
      </div>

      <Button
        size="sm"
        className="rounded-full p-0 h-5 w-5 flex items-center justify-center text-lg font-light"
      >
        <Plus className="w-4 h-4" />
      </Button>
    </div>
  );
};

export default Gas;
