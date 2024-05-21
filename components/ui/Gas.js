"use client";

import { Plus } from "lucide-react";
import { Button } from "@material-tailwind/react";

import Image from "next/image";
import { useSelector } from "react-redux";

const Gas = () => {
  const gasCredit = useSelector((state) => state.user.gasCredit);

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
        <span>{gasCredit ? gasCredit.toFixed(2) : 0.0}</span>
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
