"use client";

import useClaim from "@/hooks/useClaim";
import config from "@/utils/config";
import { Button } from "@material-tailwind/react";
import { PackageCheck } from "lucide-react";
import { useParams } from "next/navigation";
import { useSelector } from "react-redux";

export default function Step3() {
  const params = useParams();
  const id = params.id;
  const selectedChain = config.find((chain) => chain.chainId === Number(id));
  const isFinalizing = useSelector((state) => state.claim.isFinalizing);
  const { finalizeDeployment } = useClaim();

  return (
    <>
      <div className="bg-gray-200 rounded-full h-[150px] w-[150px] flex items-center justify-center">
        <PackageCheck size={70} className="m-auto" />
      </div>

      <p className="text-sm font-light w-full px-4 text-center">
        Your Request has been verified, you can now finalize and switch to{" "}
        {selectedChain?.chainName}.
      </p>

      <Button
        color="black"
        size="sm"
        className="rounded-lg mt-1 font-outfit normal-case w-full py-3 mb-2 font-light flex items-center justify-center gap-x-2"
        onClick={() => {
          finalizeDeployment(selectedChain);
        }}
        loading={isFinalizing}
        disabled={isFinalizing}
      >
        Finalize Deployment
      </Button>
    </>
  );
}
