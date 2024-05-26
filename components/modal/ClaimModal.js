"use client";

import { useDispatch, useSelector } from "react-redux";
import { Dialog, DialogBody, Input, Button } from "@material-tailwind/react";
import Image from "next/image";
import { Fingerprint, Key } from "lucide-react";
import { useState } from "react";
import { toggleClaimDrawer } from "@/redux/slice/claimSlice";
import useClaim from "@/hooks/useClaim";

export default function ClaimModal() {
  const dispatch = useDispatch();
  const open = useSelector((state) => state.claim.claimDrawer);
  const type = useSelector((state) => state.proof.type);
  const [password, setPassword] = useState("");
  const loading = useSelector((state) => state.claim.isLoading);
  const { generatePasskeyProof, generatePasswordProof } = useClaim();

  const handleDrawer = () => {
    if (loading) return;
    dispatch(toggleClaimDrawer());
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
            {type === "Password" ? (
              <Key size={70} className="m-auto" />
            ) : (
              <Fingerprint size={70} className="m-auto" />
            )}
          </div>

          <p className="text-lg font-medium">
            {type === "Password" ? "Password" : "Passkey"} Required
          </p>
          <p className="text-sm text-gray-600 -mt-4">
            {type === "Password"
              ? "Enter your password to generate proof"
              : "Provide your passkey to generate proof"}
          </p>

          {type === "Password" && (
            <Input
              type="password"
              label="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          )}

          {type === "Password" && (
            <Button
              color="black"
              size="sm"
              className="rounded-lg font-outfit normal-case w-full py-3 font-light mb-2 flex items-center justify-center gap-x-2"
              onClick={() => {
                generatePasswordProof(password);
              }}
              disabled={!password || password.length < 8 || loading}
              loading={loading}
            >
              Generate Proof
            </Button>
          )}

          {type !== "Password" && (
            <Button
              color="black"
              size="sm"
              className="rounded-lg font-outfit normal-case w-full py-3 mb-2 font-light flex items-center justify-center gap-x-2"
              onClick={() => {
                generatePasskeyProof();
              }}
              loading={loading}
              disabled={loading}
            >
              Generate Proof
            </Button>
          )}
        </div>
      </DialogBody>
    </Dialog>
  );
}
