"use client";
import useWallet from "@/hooks/useWallet";
import { Button } from "@material-tailwind/react";
import { ChevronDown, ChevronUp, KeyRound, Loader2, Lock } from "lucide-react";
import Image from "next/image";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";

export default function SettingsMain() {
  const { getDomain, getNonce } = useWallet();
  const currentChain = useSelector((state) => state.chain.currentChain);
  const domain = getDomain();
  const [loading, setLoading] = useState(true);
  const [nonce, setNonce] = useState(0);
  const walletAddress = useSelector((state) => state.user.walletAddress);
  const [isOpen, setIsOpen] = useState(false);

  const handleNonce = async () => {
    try {
      setLoading(true);
      const nonce = await getNonce();

      setNonce(nonce);
    } catch (error) {
      console.log(error);
      setNonce(0);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!walletAddress) return;
    handleNonce();
  }, [walletAddress]);

  return (
    <>
      <div className="flex w-full flex-col items-center bg-white rounded-t-2xl gap-3 py-5">
        <p className=" font-normal text-sm text-gray-700">Settings</p>
      </div>

      <div
        className="flex flex-col items-center -mt-2 justify-center gap-3 bg-white p-8 py-5 font-outfit rounded-b-xl pb-7 cursor-pointer"
        onClick={() => {
          setIsOpen(!isOpen);
        }}
      >
        <div className="w-full gap-3 flex flex-col p-4 bg-gray-200 rounded-2xl px-5">
          <div className="flex justify-between w-full mb-1 items-center">
            <p className="font-bold">Account Details</p>
            {isOpen ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
          </div>

          {isOpen && (
            <>
              <div className="flex justify-between w-full items-center">
                <p className="text-xs text-gray-700">Domain</p>
                <p className="text-xs">
                  <span className="text-xl font-bold text-black">
                    {domain ? domain : "-"}
                  </span>
                  .fusion.id
                </p>
              </div>
              <div className="flex justify-between w-full items-center">
                <p className="text-xs text-gray-700">Account Nonce</p>
                <p className="text-xl font-bold">
                  {loading ? (
                    <Loader2 className="animate-spin h-7 w-7" />
                  ) : (
                    nonce && Number(nonce)
                  )}
                </p>
              </div>

              <div className="flex justify-between w-full items-center">
                <p className="text-xs text-gray-700">Network</p>
                <div className="text-xl font-bold flex items-center">
                  <Image
                    src={currentChain?.logo}
                    alt="network"
                    width={25}
                    height={25}
                  />

                  <p className="ml-2">{currentChain?.chainName}</p>
                </div>
              </div>

              <div className="flex justify-between w-full mt-1.5">
                <p className="text-xs text-gray-700">Build</p>
                <div className="text-base  flex flex-col items-end">
                  ChainLink
                  <p className="text-xs">BlockMagic V0.0.1</p>
                </div>
              </div>
            </>
          )}
        </div>

        <Button className="w-full h-[5.5rem] mt-2 normal-case rounded-xl flex items-center gap-3  px-4 py-4 group">
          <div className="w-14 h-full bg-white rounded-lg flex items-center justify-center">
            <KeyRound
              size={30}
              className="text-black group-hover:animate-pulse"
            />
          </div>

          <div className="flex flex-col text-left w-60">
            <p className="text-xs text-white font-light">
              Change Authentication
            </p>
            <p className="text-xs text-gray-500 mt-1 font-light">
              Forgot your password or lost your passkey. Click here to reset
              your authentication.
            </p>
          </div>
        </Button>

        <Button
          variant="outlined"
          className="w-full h-[5.5rem] normal-case border-red-400 rounded-xl flex items-center gap-3  px-4 py-4 group"
        >
          <div className="w-14 h-full border-red-400 border-[1px] rounded-lg flex items-center justify-center">
            <Lock
              size={30}
              className="text-red-400 group-hover:animate-pulse"
            />
          </div>

          <div className="flex flex-col text-left w-60">
            <p className="text-xs text-red-500 font-light">
              Change Email Address
            </p>
            <p className="text-xs text-red-500 mt-1 font-light">
              This requires OTP verification of both the email addresses.
            </p>
          </div>
        </Button>
      </div>
    </>
  );
}
