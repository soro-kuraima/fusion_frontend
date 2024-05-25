"use client";

import { useDispatch, useSelector } from "react-redux";
import { Dialog, DialogBody, Input, Button } from "@material-tailwind/react";
import { toggleRecoveryDrawer } from "@/redux/slice/proofSlice";
import Image from "next/image";
import { AtSign, Fingerprint, Key } from "lucide-react";
import { useState } from "react";
import useGenerateProof from "@/hooks/useGenerateProof";

export default function RecoveryProofModal() {
  const dispatch = useDispatch();
  const open = useSelector((state) => state.proof.recoveryDrawer);
  const [email, setEmail] = useState("");
  const { generateEmailProof } = useGenerateProof();
  const loading = useSelector((state) => state.proof.isLoading);

  const handleDrawer = () => {
    if (loading) return;
    dispatch(toggleRecoveryDrawer());
  };

  const isValidEmail = (email) => {
    const re = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/g;
    return re.test(email);
  };

  return (
    <Dialog
      size="sm"
      open={open}
      handler={handleDrawer}
      animate={{
        mount: { scale: 1, y: 0 },
        unmount: { scale: 0.9, y: -100 },
      }}
      className="font-outfit bg-transparent items-center justify-center flex shadow-none"
    >
      <DialogBody className="text-center gap-y-4 py-5 font-outfit bg-white rounded-2xl w-full max-w-[24rem] px-5 pb-3">
        <div className="flex justify-between items-center text-black mb-3 px-5">
          <p className="font-medium text-lg">Authentication Required</p>

          <Image
            src="/logoBlack.svg"
            alt="Logo"
            width={25}
            height={30}
            onClick={handleDrawer}
          />
        </div>

        <div className="flex flex-col items-center gap-y-4 text-black mt-5">
          <div className="bg-gray-200 rounded-full h-[150px] w-[150px] flex items-center justify-center">
            <AtSign size={70} className="m-auto" />
          </div>

          <p className="text-lg font-medium">Email Required</p>
          <p className="text-sm text-gray-600 -mt-4">
            Please enter your email address to generate a proof.
          </p>

          <Input
            label="Enter your recovery email address"
            placeholder="abc@xyz.com"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
            }}
            disabled={loading}
            labelProps={{
              className: "peer-disabled:text-gray-500",
            }}
            className="placeholder:opacity-100 disabled:border-[1px]"
          />

          <Button
            color="black"
            size="sm"
            className="rounded-lg font-outfit normal-case w-full py-3 font-light mb-2 flex items-center justify-center gap-x-2"
            onClick={() => {
              generateEmailProof(email);
            }}
            disabled={loading || !isValidEmail(email)}
            loading={loading}
          >
            Generate Proof
          </Button>
        </div>
      </DialogBody>
    </Dialog>
  );
}
