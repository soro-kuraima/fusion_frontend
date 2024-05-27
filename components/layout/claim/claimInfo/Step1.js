"use client";

import { toggleClaimDrawer } from "@/redux/slice/claimSlice";
import config from "@/utils/config";
import { Button } from "@material-tailwind/react";
import { Info } from "lucide-react";
import Image from "next/image";
import { useParams } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";

export default function Step1() {
  const params = useParams();
  const id = params.id;
  const dispatch = useDispatch();

  const selectedChain = config.find((chain) => chain.chainId === Number(id));
  const type = useSelector((state) => state.proof.type);

  return (
    <>
      <div className="bg-gray-200 rounded-full h-[150px] w-[150px] flex items-center justify-center">
        <Image
          src={selectedChain?.logo}
          width={70}
          height={70}
          className="m-auto"
          alt={selectedChain?.chainName}
        />
      </div>

      <p className="text-sm font-light w-48 text-center">
        Getting started with claiming your domain on {selectedChain?.chainName}
      </p>

      <div className="flex bg-gray-300 p-2 text-xs rounded-full font-normal px-4 items-center">
        <Info size={16} className="mr-1" />
        <p>This process will take less than a minute.</p>
      </div>

      <Button
        color="black"
        size="sm"
        className="rounded-lg mt-1 font-outfit normal-case w-full py-3 mb-2 font-light flex items-center justify-center gap-x-2"
        onClick={() => {
          dispatch(toggleClaimDrawer());
        }}
        disabled={!type}
      >
        Generate ZK Proof
      </Button>
    </>
  );
}
