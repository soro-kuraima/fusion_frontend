"use client";

import { useDispatch, useSelector } from "react-redux";
import { toast } from "sonner";
import { ethers } from "ethers";
import {
  setDeployProof,
  setIsFinalizing,
  setIsLoading,
  setIsRequesting,
  setStep,
  toggleClaimDrawer,
} from "@/redux/slice/claimSlice";
import useWallet from "./useWallet";
import useWebAuthn from "./useWebAuthn";
import useCircuit from "./useCircuit";
import config from "@/utils/config";
import FusionABI from "@/utils/contracts/Fusion.json";
import axios from "axios";
import FusionFactoryABI from "@/utils/contracts/FusionProxyFactory.json";
import { useRouter } from "next/navigation";
import { useConfetti } from "@/utils/ui/fireConfetti";
import { setWalletAddresses } from "@/redux/slice/userSlice";

export default function useClaim() {
  const dispatch = useDispatch();
  const { getDomain, loadAddresses, switchChain } = useWallet();
  const { login } = useWebAuthn();
  const { password_prove } = useCircuit();
  const walletAddress = useSelector((state) => state.user.walletAddress);
  const deployProof = useSelector((state) => state.claim.deployProof);
  const walletAddresses = useSelector((state) => state.user.walletAddresses);
  const type = useSelector((state) => state.proof.type);
  const email = useSelector((state) => state.proof.email);
  const router = useRouter();
  const { fireMultiple } = useConfetti();

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

  const requestDeployment = async (selectedChain, setMessage) => {
    try {
      dispatch(setIsRequesting(true));

      setMessage("Requesting Deployment");

      const baseChain = config.find((chain) => chain.isBase);

      const fusionAddress = walletAddresses.find(
        (address) => address.chainId === baseChain.chainId
      );

      if (
        !fusionAddress ||
        !fusionAddress.address ||
        fusionAddress.address === ethers.constants.AddressZero
      ) {
        toast.error("Please add your Fusion Wallet Address");
        setMessage("Request Deployment");
        dispatch(setIsRequesting(false));
        return;
      }

      const domain = getDomain() + ".fusion.id";

      if (!domain) {
        toast.error("Invalid Domain");
        setMessage("Request Deployment");
        dispatch(setIsRequesting(false));
        return;
      }

      const provider = new ethers.providers.JsonRpcProvider(
        selectedChain.rpcUrl
      );

      const baseProvider = new ethers.providers.JsonRpcProvider(
        baseChain.rpcUrl
      );

      const fusion = new ethers.Contract(
        fusionAddress.address,
        FusionABI,
        baseProvider
      );

      const txHash = await fusion.TxHash();
      const recoveryHash = await fusion.RecoveryHash();
      const abiCoder = new ethers.utils.AbiCoder();

      const publicStorage = abiCoder.encode(
        ["string", "string"],
        [type, email]
      );

      const initializer = fusion.interface.encodeFunctionData("setupFusion", [
        ethers.utils.keccak256(
          ethers.utils.toUtf8Bytes(domain?.toLowerCase() + ".fusion.id")
        ),
        selectedChain.addresses.PasswordVerifier,
        selectedChain.addresses.SignatureVerifier,
        selectedChain.addresses.FusionForwarder,
        selectedChain.addresses.FusionGasTank,
        txHash,
        recoveryHash,
        publicStorage,
      ]);

      const chainDeployRequest = {
        domain,
        proof: deployProof,
        type: "password",
        initializer,
      };

      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/deploy/request/${selectedChain.chainId}`,
        {
          chainDeployRequest,
        }
      );

      if (response.data.success) {
        toast.success("Successfully Requested Deployment");
        await checkForFulfillment(selectedChain, setMessage);
      } else {
        toast.error("Failed to deploy to chain");
        console.log(response.data.error);
        setMessage("Request Deployment");
        dispatch(setIsRequesting(false));
        dispatch(setDeployProof(null));
        dispatch(setStep(0));
      }
    } catch (error) {
      console.error(error);
      toast.error("Error Requesting Deployment");
      setMessage("Request Deployment");
      dispatch(setIsRequesting(false));
    }
  };

  const checkForFulfillment = async (selectedChain, setMessage) => {
    try {
      setMessage("Checking for Fulfillment");

      const wsProvider = new ethers.providers.WebSocketProvider(
        selectedChain.wsUrl
      );

      const fusionFactory = new ethers.Contract(
        selectedChain.addresses.FusionProxyFactory,
        FusionFactoryABI,
        wsProvider
      );

      const Domain = getDomain() + ".fusion.id";

      fusionFactory.on("DomainRequestFulfilled", async () => {
        const fullfilledRequests = await fusionFactory.requests(Domain);

        if (fullfilledRequests.fulfilled) {
          toast.success("Request Verified Successfully");
          setMessage("Request Deployment");
          dispatch(setIsRequesting(false));
          dispatch(setStep(2));
          dispatch(setDeployProof(null));
          fireMultiple();
        }
      });
    } catch (error) {
      console.error(error);
      toast.error("Error Checking for Deployment");
      setMessage("Request Deployment");
      dispatch(setIsRequesting(false));
    }
  };

  const checkFinalized = async (chainId) => {
    try {
      const selectedChain = config.find(
        (chain) => chain.chainId === Number(chainId)
      );

      const provider = new ethers.providers.JsonRpcProvider(
        selectedChain.rpcUrl
      );

      const factory = new ethers.Contract(
        selectedChain.addresses.FusionProxyFactory,
        FusionFactoryABI,
        provider
      );

      const domain = getDomain() + ".fusion.id";

      const request = await factory.requests(domain);

      if (request.fulfilled) {
        return true;
      }
      return false;
    } catch (error) {
      console.error(error);
      return false;
    }
  };

  const finalizeDeployment = async (selectedChain) => {
    try {
      dispatch(setIsFinalizing(true));

      const domain = getDomain();

      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/deploy/finalize/${
          selectedChain.chainId
        }/${domain + ".fusion.id"}`
      );

      if (response.data.success) {
        toast.success("Successfully Finalized Deployment");
        let walletAddresses = await loadAddresses(domain + ".fusion.id");
        dispatch(setWalletAddresses(walletAddresses));

        dispatch(setIsFinalizing(false));
        dispatch(setStep(0));
        fireMultiple();
        router.push(`/dashboard?domain=${domain}`);
      } else {
        toast.error("Failed to finalize deployment");
        console.log(response.data.error);
        dispatch(setIsFinalizing(false));
      }
    } catch (error) {
      console.error(error);
      toast.error("Error Finalizing Deployment");
    }
  };

  return {
    generatePasskeyProof,
    generatePasswordProof,
    requestDeployment,
    checkFinalized,
    finalizeDeployment,
  };
}
