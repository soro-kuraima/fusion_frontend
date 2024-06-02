"use client";

import { useSelector } from "react-redux";
import config from "@/utils/config";
import { ethers } from "ethers";
import Image from "next/image";
import { Button, Chip, Tooltip } from "@material-tailwind/react";
import { toast } from "sonner";
import { formatAddress } from "@/utils/FormatAddress";
import { Copy } from "lucide-react";
import { useRouter } from "next/navigation";
import useWallet from "@/hooks/useWallet";

export default function DeployInfo() {
  const currentChain = useSelector((state) => state.chain.currentChain);
  const walletAddresses = useSelector((state) => state.user.walletAddresses);
  const router = useRouter();
  const { getDomain } = useWallet();

  const domain = getDomain();

  const deployments = walletAddresses?.filter(
    (address) => address.address !== ethers.constants.AddressZero
  );

  return (
    <div className="flex flex-col items-center -mt-2 shadow-lg justify-center gap-3 bg-white p-8 py-5 font-outfit rounded-b-xl pb-7">
      <div className="flex justify-between items-center w-full">
        <p className="font-medium text-lg">Networks</p>

        <div className="flex gap-2 items-center text-xs">
          {deployments && deployments.length} / {config.length} Claimed
        </div>
      </div>

      {config.map((chain) => {
        const deployed = deployments?.find(
          (deployed) => deployed.chainId === chain.chainId
        );

        if (!deployed) {
        }

        return (
          <Tooltip
            content={
              (deployed && (
                <div className="flex gap-2 items-center">
                  <p className="text-xs">{formatAddress(deployed.address)}</p>
                </div>
              )) || (
                <div className="flex gap-2 bg-transparent">
                  <p className="text-xs">Not Deployed</p>
                </div>
              )
            }
            className="text-xs"
            key={chain.chainId}
            animate={{
              mount: { scale: 1, y: 0 },
              unmount: { scale: 0, y: 25 },
            }}
          >
            <div
              key={chain.chainId}
              className="flex mt-1 items-center justify-between border-t-2 border-gray-200 pt-3 w-full"
            >
              <div className="flex gap-3 items-center">
                <Image
                  src={chain.logo}
                  alt="TokenLogo"
                  width={35}
                  height={30}
                />
                <p>{chain.chainName}</p>
              </div>

              {walletAddresses && (
                <div className="flex gap-2 items-center text-xs">
                  {currentChain.chainId === chain.chainId && (
                    <Chip
                      variant="ghost"
                      color="green"
                      size="sm"
                      className="text-xs normal-case font-light"
                      value="Current"
                      icon={
                        <span className="mx-auto mt-1 block h-2 w-2 rounded-full bg-green-900 content-['']" />
                      }
                    />
                  )}

                  {chain.isBase && (
                    <Chip
                      variant="ghost"
                      color="blue"
                      size="sm"
                      className="text-xs normal-case font-light"
                      value="Base"
                      icon={
                        <span className="mx-auto mt-1 block h-2 w-2 rounded-full bg-blue-900 content-['']" />
                      }
                    />
                  )}

                  {!deployed && (
                    <Chip
                      variant="ghost"
                      color="red"
                      size="sm"
                      className="text-xs normal-case font-light"
                      value="Unclaimed"
                      icon={
                        <span className="mx-auto mt-1 block h-2 w-2 rounded-full bg-red-900 content-['']" />
                      }
                    />
                  )}

                  {!deployed && (
                    <Button
                      className="normal-case text-xs font-light"
                      size="sm"
                      onClick={() => {
                        if (!currentChain.isBase) {
                          toast.error("You can only claim on the base chain");
                        }

                        router.push(
                          "/claim/" + chain.chainId + "?domain=" + domain
                        );
                      }}
                    >
                      Claim
                    </Button>
                  )}
                </div>
              )}
            </div>
          </Tooltip>
        );
      })}
    </div>
  );
}
