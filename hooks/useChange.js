"use client";

import { ethers } from "ethers";
import { Magic } from "magic-sdk";
import { useDispatch, useSelector } from "react-redux";
import useCircuit from "./useCircuit";
import { setGasAmount, setRecoveryHash } from "@/redux/slice/changeSlice";
import FusionForwarderABI from "@/utils/contracts/FusionForwarder.json";
import useWallet from "./useWallet";
import axios from "axios";
import { toast } from "sonner";
import { useConfetti } from "@/utils/ui/fireConfetti";

export default function useChange() {
  const { hashKey } = useCircuit();
  const dispatch = useDispatch();
  const email = useSelector((state) => state.change.email);
  const currentChain = useSelector((state) => state.chain.currentChain);
  const walletAddress = useSelector((state) => state.user.walletAddress);
  const type = useSelector((state) => state.proof.type);
  const {
    initializeProofWallet,
    loadGasCredit,
    loadPublicStorage,
  } = useWallet();
  const recoveryHash = useSelector((state) => state.change.recoveryHash);
  const recoveryProof = useSelector((state) => state.proof.recoveryProof);
  const isGasless = useSelector((state) => state.change.gasless);
  const [, gasToken] = useSelector((state) => state.selector.token);
  const { fireMultiple } = useConfetti();

  const handleEmail = async (setIsLoading) => {
    try {
      setIsLoading(true);

      const magic = new Magic(process.env.NEXT_PUBLIC_MAGIC_API_KEY);
      await magic.auth.loginWithEmailOTP({ email });
      const userMetadata = await magic.user.isLoggedIn();
      if (!userMetadata) {
        throw new Error("Error logging in");
      }

      const provider = new ethers.providers.Web3Provider(magic.rpcProvider);
      const signer = provider.getSigner();

      const signature = await signer.signMessage("Fusion_New_User_Sign_Up");

      const pubKey_uncompressed = ethers.utils.recoverPublicKey(
        ethers.utils.hashMessage(
          ethers.utils.toUtf8Bytes("Fusion_New_User_Sign_Up")
        ),
        signature
      );

      let pubKey = pubKey_uncompressed.slice(4);
      let pub_key_x = pubKey.substring(0, 64);

      const recoveryHash = await hashKey("0x" + pub_key_x);

      dispatch(setRecoveryHash(recoveryHash));
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
        [type, email.toString()]
      );

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
        gas: 2000000,
        proof: recoveryProof,
        newRecoveryHash: recoveryHash,
        newRecoveryVerifier: currentChain.addresses.SignatureVerifier,
        publicStorage: publicInputs,
      };

      const data712 = {
        types: {
          ForwardChangeRecovery: [
            { name: "from", type: "address" },
            { name: "recipient", type: "address" },
            { name: "deadline", type: "uint256" },
            { name: "nonce", type: "uint256" },
            { name: "gas", type: "uint256" },
            { name: "proof", type: "bytes" },
            { name: "newRecoveryHash", type: "bytes32" },
            { name: "newRecoveryVerifier", type: "address" },
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
        newRecoveryHash: message.newRecoveryHash,
        newRecoveryVerifier: message.newRecoveryVerifier,
        publicStorage: message.publicStorage,
        signature: signature,
      };

      if (isGasless) {
        const estimate = await axios.get(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/change/estimate/gasless/${
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
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/change/estimate/native/${
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
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/change/estimate/erc20/${
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
      console.error(error);
      dispatch(setGasAmount(null));
    }
  };

  const changeRecovery = async (
    currentChain,
    gasToken,
    type,
    email,
    recoveryHash,
    recoveryProof,
    walletAddress,
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
        [type, email.toString()]
      );

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
        gas: 2000000,
        proof: recoveryProof,
        newRecoveryHash: recoveryHash,
        newRecoveryVerifier: currentChain.addresses.SignatureVerifier,
        publicStorage: publicInputs,
      };

      const data712 = {
        types: {
          ForwardChangeRecovery: [
            { name: "from", type: "address" },
            { name: "recipient", type: "address" },
            { name: "deadline", type: "uint256" },
            { name: "nonce", type: "uint256" },
            { name: "gas", type: "uint256" },
            { name: "proof", type: "bytes" },
            { name: "newRecoveryHash", type: "bytes32" },
            { name: "newRecoveryVerifier", type: "address" },
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
        newRecoveryHash: message.newRecoveryHash,
        newRecoveryVerifier: message.newRecoveryVerifier,
        publicStorage: message.publicStorage,
        signature: signature,
      };

      if (isGasless) {
        const response = await axios.post(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/change/gasless/${
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
          toast.success("Successfully changed recovery");
          fireMultiple();
          return true;
        } else {
          toast.error(response.data.error);
          return false;
        }
      } else if (gasToken.address == null) {
        const response = await axios.post(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/change/native/${currentChain.chainId}`,
          {
            forwardRequest,
            mode: "signature",
          }
        );

        if (response.data.success) {
          await loadPublicStorage();
          fireMultiple();
          toast.success("Successfully changed recovery");
          return true;
        } else {
          toast.error(response.data.error);
          return false;
        }
      } else {
        const response = await axios.post(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/change/erc20/${currentChain.chainId}?address=${gasToken.address}`,
          {
            forwardRequest,
            mode: "signature",
          }
        );
        if (response.data.success) {
          await loadPublicStorage();
          fireMultiple();
          toast.success("Successfully changed recovery");
          return true;
        } else {
          toast.error(response.data.error);
          return false;
        }
      }
    } catch (error) {
      console.error(error);
      toast.error("Error changing recovery");
    }
  };

  return { handleEmail, estimateGas, changeRecovery };
}
