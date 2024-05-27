"use client";

import { useParams } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import { Button } from "@material-tailwind/react";
import config from "@/utils/config";
import { Hourglass, Info } from "lucide-react";
import useClaim from "@/hooks/useClaim";
import { useState } from "react";

export default function Step2() {
  const params = useParams();
  const id = params.id;
  const dispatch = useDispatch();
  const selectedChain = config.find((chain) => chain.chainId === Number(id));
  const isLoading = useSelector((state) => state.claim.isRequesting);
  const { requestDeployment } = useClaim();
  const [message, setMessage] = useState("Request Deployment");

  return (
    <>
      <div className="bg-gray-200 rounded-full h-[150px] w-[150px] flex items-center justify-center">
        <Hourglass size={70} className="m-auto" />
      </div>

      <p className="text-sm font-light w-full px-3 text-center">
        Request deployment on {selectedChain?.chainName}, your proof will be
        verified through ChainLink Functions.
      </p>

      <div className="flex bg-gray-300 p-2 text-xs rounded-full font-normal px-4 items-center">
        <Info size={16} className="mr-1" />
        <p>Don't refresh the page</p>
      </div>

      <Button
        color="black"
        size="sm"
        className="rounded-lg mt-1 font-outfit normal-case w-full py-3 mb-2 font-light flex items-center justify-center gap-x-2"
        onClick={() => {
          requestDeployment(selectedChain, setMessage);
        }}
        loading={isLoading}
        disabled={isLoading}
      >
        {message}
      </Button>
    </>
  );
}
