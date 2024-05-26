"use client";

import { useDispatch, useSelector } from "react-redux";
import { toast } from "sonner";
import { ethers } from "ethers";
import {
  setDeployProof,
  setIsLoading,
  setStep,
  toggleClaimDrawer,
} from "@/redux/slice/claimSlice";
import useWallet from "./useWallet";
import useWebAuthn from "./useWebAuthn";
import useCircuit from "./useCircuit";

export default function useClaim() {
  const dispatch = useDispatch();
  const { getDomain } = useWallet();
  const { login } = useWebAuthn();
  const { password_prove } = useCircuit();
  const walletAddress = useSelector((state) => state.user.walletAddress);

  const generatePasskeyProof = async () => {
    try {
      dispatch(setIsLoading(true));

      const domain = getDomain();

      if (!domain) {
        toast.error("Invalid Domain");
        return;
      }

      const id = await login();

      const nonce = 9999;

      const proof = await password_prove(id, nonce, walletAddress);

      if (!proof) {
        toast.error("Error Generating Proof");
        return;
      }

      dispatch(setTxProof(proof));
      dispatch(toggleClaimDrawer());
      dispatch(setStep(1));
    } catch (error) {
      console.error(error);
      toast.error("Error Authorizing Transaction");
    } finally {
      dispatch(setIsLoading(false));
    }
  };

  const generatePasswordProof = async (password) => {
    try {
      dispatch(setIsLoading(true));

      const domain = getDomain();

      if (!domain) {
        toast.error("Invalid Domain");
        return;
      }
      const nonce = 9999;

      const proof = await password_prove(password, nonce, walletAddress);

      if (!proof) {
        toast.error("Error Generating Proof");
        return;
      }

      dispatch(setDeployProof(proof));
      dispatch(toggleClaimDrawer());
      dispatch(setStep(1));
    } catch (error) {
      console.error(error);
      toast.error("Error Authorizing Transaction");
    } finally {
      dispatch(setIsLoading(false));
    }
  };

  return { generatePasskeyProof, generatePasswordProof };
}
