"use client";

import {
  setGasAmount,
  setPasskey,
  setPassword,
} from "@/redux/slice/recoverySlice";
import useWallet from "./useWallet";
import useWebAuthn from "./useWebAuthn";
import { ethers } from "ethers";
import { useDispatch } from "react-redux";
import useCircuit from "./useCircuit";
import { useSelector } from "react-redux";
import FusionForwarderABI from "@/utils/contracts/FusionForwarder.json";
import axios from "axios";
import { useConfetti } from "@/utils/ui/fireConfetti";
import { toast } from "sonner";

export default function useRecovery() {
  const { getDomain, loadPublicStorage, loadGasCredit } = useWallet();
  const { register } = useWebAuthn();
  const dispatch = useDispatch();
  const { initializeProofWallet } = useWallet();
  const currentChain = useSelector((state) => state.chain.currentChain);
  const walletAddress = useSelector((state) => state.user.walletAddress);
  const email = useSelector((state) => state.proof.email);
  const passkey = useSelector((state) => state.recovery.passkey);
  const password = useSelector((state) => state.recovery.password);
  const { hashPassword } = useCircuit();
  const recoveryProof = useSelector((state) => state.proof.recoveryProof);
  const isGasless = useSelector((state) => state.recovery.gasless);
  const [, gasToken] = useSelector((state) => state.selector.token);
  const { fireMultiple } = useConfetti();

  const handlePasskey = async (setIsLoading) => {
    try {
      setIsLoading(true);

      const domain = getDomain();

      const id = await register(domain + ".fusion.id");

      dispatch(setPasskey(id));
      dispatch(setPassword(""));
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const estimateGas = async () => {
    try {
      const provider = new ethers.providers.JsonRpcProvider(
        currentChain.rpcUrl
      );

      const abiCoder = new ethers.utils.AbiCoder();

      const publicInputs = abiCoder.encode(
        ["string", "string"],
        [passkey ? "Passkey" : "Password", email.toString()]
      );

      let TxHash;

      if (passkey) {
        TxHash = await hashPassword(passkey);
      } else {
        TxHash = await hashPassword(password);
      }

      const forwarder = new ethers.Contract(
        currentChain.addresses.FusionForwarder,
        FusionForwarderABI,
        provider
      );

      const keypair = await initializeProofWallet();

      const message = {
        from: keypair.address,
        recipient: walletAddress,
        deadline: Number((Date.now() / 1000).toFixed(0)) + 2000,
        nonce: Number(await forwarder.nonces(keypair.address)),
        gas: 1000000,
        proof: recoveryProof,
        newTxHash: TxHash,
        newTxVerifier: currentChain.addresses.PasswordVerifier,
        publicStorage: publicInputs,
      };

      const data712 = {
        types: {
          ForwardExecuteRecovery: [
            { name: "from", type: "address" },
            { name: "recipient", type: "address" },
            { name: "deadline", type: "uint256" },
            { name: "nonce", type: "uint256" },
            { name: "gas", type: "uint256" },
            { name: "proof", type: "bytes" },
            { name: "newTxHash", type: "bytes32" },
            { name: "newTxVerifier", type: "address" },
            { name: "publicStorage", type: "bytes" },
          ],
        },
        domain: {
          name: "Fusion Forwarder",
          version: "1",
          chainId: currentChain.chainId,
          verifyingContract: currentChain.addresses.FusionForwarder,
        },
        message: message,
      };

      const signature = await keypair._signTypedData(
        data712.domain,
        data712.types,
        data712.message
      );

      const forwardRequest = {
        from: keypair.address,
        recipient: walletAddress,
        deadline: message.deadline,
        gas: message.gas,
        proof: message.proof,
        newTxHash: message.newTxHash,
        newTxVerifier: message.newTxVerifier,
        publicStorage: message.publicStorage,
        signature: signature,
      };

      if (isGasless) {
        const estimate = await axios.get(
          `${
            process.env.NEXT_PUBLIC_BACKEND_URL
          }/api/recovery/estimate/gasless/${
            currentChain.chainId
          }?forwardRequest=${JSON.stringify(forwardRequest)}`
        );

        if (estimate.data.success) {
          dispatch(setGasAmount(estimate.data.estimates.estimateFees));
          return estimate.data.estimates.estimateFees;
        } else {
          dispatch(setGasAmount(null));
          return 0;
        }
      }

      if (gasToken.address == null) {
        const estimate = await axios.get(
          `${
            process.env.NEXT_PUBLIC_BACKEND_URL
          }/api/recovery/estimate/native/${
            currentChain.chainId
          }?forwardRequest=${JSON.stringify(forwardRequest)}`
        );

        if (estimate.data.success) {
          dispatch(setGasAmount(estimate.data.estimates.estimateFees));
          return estimate.data.estimates.estimateFees;
        } else {
          dispatch(setGasAmount(null));
          return 0;
        }
      }

      const estimate = await axios.get(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/recovery/estimate/erc20/${
          currentChain.chainId
        }?forwardRequest=${JSON.stringify(forwardRequest)}&address=${
          gasToken.address
        }`
      );

      if (estimate.data.success) {
        dispatch(setGasAmount(estimate.data.estimates.estimateFees));
        return estimate.data.estimates.estimateFees;
      }
      dispatch(setGasAmount(null));
      return 0;
    } catch (error) {
      dispatch(setGasAmount(null));
      console.error(error);
    }
  };

  const executeRecovery = async (
    currentChain,
    gasToken,
    passkey,
    password,
    email,
    walletAddress,
    recoveryProof,
    domain,
    isGasless
  ) => {
    try {
      const provider = new ethers.providers.JsonRpcProvider(
        currentChain.rpcUrl
      );

      const abiCoder = new ethers.utils.AbiCoder();

      const publicInputs = abiCoder.encode(
        ["string", "string"],
        [passkey ? "Passkey" : "Password", email.toString()]
      );

      let TxHash;

      if (passkey) {
        TxHash = await hashPassword(passkey);
      } else {
        TxHash = await hashPassword(password);
      }

      const forwarder = new ethers.Contract(
        currentChain.addresses.FusionForwarder,
        FusionForwarderABI,
        provider
      );

      const keypair = await initializeProofWallet();

      const message = {
        from: keypair.address,
        recipient: walletAddress,
        deadline: Number((Date.now() / 1000).toFixed(0)) + 2000,
        nonce: Number(await forwarder.nonces(keypair.address)),
        gas: 1000000,
        proof: recoveryProof,
        newTxHash: TxHash,
        newTxVerifier: currentChain.addresses.PasswordVerifier,
        publicStorage: publicInputs,
      };

      const data712 = {
        types: {
          ForwardExecuteRecovery: [
            { name: "from", type: "address" },
            { name: "recipient", type: "address" },
            { name: "deadline", type: "uint256" },
            { name: "nonce", type: "uint256" },
            { name: "gas", type: "uint256" },
            { name: "proof", type: "bytes" },
            { name: "newTxHash", type: "bytes32" },
            { name: "newTxVerifier", type: "address" },
            { name: "publicStorage", type: "bytes" },
          ],
        },
        domain: {
          name: "Fusion Forwarder",
          version: "1",
          chainId: currentChain.chainId,
          verifyingContract: currentChain.addresses.FusionForwarder,
        },
        message: message,
      };

      const signature = await keypair._signTypedData(
        data712.domain,
        data712.types,
        data712.message
      );

      const forwardRequest = {
        from: keypair.address,
        recipient: walletAddress,
        deadline: message.deadline,
        gas: message.gas,
        proof: message.proof,
        newTxHash: message.newTxHash,
        newTxVerifier: message.newTxVerifier,
        publicStorage: message.publicStorage,
        signature: signature,
      };

      if (isGasless) {
        const response = await axios.post(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/recovery/gasless/${
            domain + ".fusion.id"
          }/${currentChain.chainId}`,
          {
            forwardRequest,
            mode: "signature",
          }
        );
        if (response.data.success) {
          await loadPublicStorage();
          await loadGasCredit(domain + ".fusion.id");
          toast.success("Recovery successfully");
          fireMultiple();
          return true;
        } else {
          toast.error(response.data.error);
          return false;
        }
      } else if (gasToken.address === null) {
        const response = await axios.post(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/recovery/native/${currentChain.chainId}`,
          {
            forwardRequest,
            mode: "signature",
          }
        );

        if (response.data.success) {
          await loadPublicStorage();
          toast.success("Recovery successfully");
          fireMultiple();
          return true;
        } else {
          toast.error(response.data.error);
          return false;
        }
      } else {
        const response = await axios.post(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/recovery/erc20/${currentChain.chainId}?address=${gasToken.address}`,
          {
            forwardRequest,
            mode: "signature",
          }
        );
        if (response.data.success) {
          await loadPublicStorage();
          toast.success("Recovery successfully");
          fireMultiple();
          return true;
        } else {
          toast.error(response.data.error);
          return false;
        }
      }
    } catch (error) {
      console.error(error);
      toast.error("Failed to execute recovery");
    }
  };

  return { handlePasskey, estimateGas, executeRecovery };
}
