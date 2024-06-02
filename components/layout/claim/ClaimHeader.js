"use client";

import { Step, Stepper } from "@material-tailwind/react";
import { ethers } from "ethers";
import { useParams } from "next/navigation";
import { useSelector } from "react-redux";
import config from "@/utils/config";

export default function ClaimHeader() {
  const step = useSelector((state) => state.claim.step);
  const params = useParams();
  const id = params.id;
  const walletAddresses = useSelector((state) => state.user.walletAddresses);

  const isValid = config.find((chain) => chain.chainId === Number(id));

  const isDeployed = walletAddresses?.find(
    (address) =>
      address.chainId === Number(id) &&
      address.address !== ethers.constants.AddressZero
  );

  return (
    <div className="flex w-full shadow-lg flex-col items-center bg-white rounded-t-2xl gap-3 py-5">
      <p className=" font-normal text-sm text-gray-700">Claim</p>

      {!isDeployed && isValid && (
        <Stepper
          activeStep={step}
          lineClassName="bg-transparent"
          activeLineClassName="bg-transparent"
          className="w-fit gap-2"
        >
          <Step
            className="relative h-2 w-20 bg-gray-400 cursor-pointer"
            onClick={() => {}}
          ></Step>
          <Step
            className="relative h-2 w-20 bg-gray-400 cursor-pointer"
            onClick={() => {}}
          ></Step>
          <Step
            className="relative h-2 w-20 bg-gray-400 cursor-pointer"
            onClick={() => {}}
          ></Step>
        </Stepper>
      )}
    </div>
  );
}
