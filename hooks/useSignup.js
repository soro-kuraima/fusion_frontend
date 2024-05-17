"use client";

import { useDispatch, useSelector } from "react-redux";
import useWebAuthn from "./useWebAuthn";
import {
  setEmail,
  setPasskey,
  setPassword,
  setRecoveryAddress,
  setStep,
} from "@/redux/slice/signUpSlice";
import baseChain from "@/utils/baseChain";
import { ethers } from "ethers";
import { Magic } from "magic-sdk";
import useCircuit from "./useCircuit";
import { toast } from "sonner";
import FusionABI from "@/utils/contracts/Fusion.json";
import FactoryForwarderABI from "@/utils/contracts/FactoryForwarder.json";
import FusionProxyFactoryABI from "@/utils/contracts/FusionProxyFactory.json";
import axios from "axios";
import { useConfetti } from "@/utils/ui/fireConfetti";

export default function useSignup() {
  const { register } = useWebAuthn();
  const dispatch = useDispatch();
  const domain = useSelector((state) => state.signup.domain);
  const email = useSelector((state) => state.signup.email);
  const { hashPassword, hashKey } = useCircuit();
  const recoveryAddress = useSelector((state) => state.signup.recoveryAddress);
  const passkey = useSelector((state) => state.signup.passkey);
  const password = useSelector((state) => state.signup.password);
  const { fire } = useConfetti();

  const handlePasskey = async (setIsLoading) => {
    try {
      setIsLoading(true);
      const id = await register(domain + ".fusion.id");
      dispatch(setPassword(""));
      dispatch(setPasskey(id));
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };

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

      dispatch(setEmail(email));
      dispatch(setRecoveryAddress(pub_key_x));
      dispatch(setStep(3));
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };

  const deployWallet = async (setIsLoading, setSuccess) => {
    try {
      setIsLoading(true);

      let TxHash;

      if (passkey) {
        TxHash = await hashPassword(passkey);
      } else {
        TxHash = await hashPassword(password);
      }

      const recoveryHash = await hashKey("0x" + recoveryAddress);

      const provider = new ethers.providers.JsonRpcProvider(baseChain.rpcUrl);

      const masterCopy = new ethers.Contract(
        baseChain.addresses.Fusion,
        FusionABI,
        provider
      );

      const abiCoder = new ethers.utils.AbiCoder();

      const publicInputs = abiCoder.encode(
        ["string", "string"],
        [passkey ? "Passkey" : "Password", email.toString()]
      );

      const initializer = masterCopy.interface.encodeFunctionData(
        "setupFusion",
        [
          ethers.utils.keccak256(
            ethers.utils.toUtf8Bytes(domain + ".fusion.id")
          ),
          baseChain.addresses.PasswordVerifier,
          baseChain.addresses.SignatureVerifier,
          baseChain.addresses.FusionForwarder,
          baseChain.addresses.FusionGasTank,
          TxHash,
          recoveryHash,
          publicInputs,
        ]
      );

      const keypair = ethers.Wallet.createRandom();

      const forwarder = new ethers.Contract(
        baseChain.addresses.FactoryForwarder,
        FactoryForwarderABI,
        provider
      );

      const message = {
        from: keypair.address,
        recipient: baseChain.addresses.FusionProxyFactory,
        deadline: Number((Date.now() / 1000).toFixed(0)) + 2000,
        nonce: Number(await forwarder.nonces(keypair.address)),
        gas: 2000000,
        domain: domain + ".fusion.id",
        initializer: initializer,
      };

      const data712 = {
        types: {
          ForwardDeploy: [
            { name: "from", type: "address" },
            { name: "recipient", type: "address" },
            { name: "deadline", type: "uint48" },
            { name: "nonce", type: "uint256" },
            { name: "gas", type: "uint256" },
            { name: "domain", type: "string" },
            { name: "initializer", type: "bytes" },
          ],
        },
        domain: {
          name: "Fusion Forwarder",
          version: "1",
          chainId: baseChain.chainId,
          verifyingContract: baseChain.addresses.FactoryForwarder,
        },
        message: message,
      };

      const signature = await keypair._signTypedData(
        data712.domain,
        data712.types,
        data712.message
      );

      const forwardRequest = {
        from: message.from,
        recipient: message.recipient,
        deadline: message.deadline,
        gas: message.gas,
        domain: message.domain,
        initializer: message.initializer,
        signature: signature,
      };

      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/deploy/${baseChain.chainId}`,
        {
          forwardRequest,
        }
      );

      if (response.data.success === true) {
        const factory = new ethers.Contract(
          baseChain.addresses.FusionProxyFactory,
          FusionProxyFactoryABI,
          provider
        );

        const proxy = await factory.getFusionProxy(domain + ".fusion.id");

        if (proxy === ethers.constants.AddressZero) {
          throw new Error("Failed to deploy wallet");
        }

        setSuccess(true);

        fire(0.25, {
          spread: 26,
          startVelocity: 55,
        });
        fire(0.2, {
          spread: 60,
        });
        fire(0.35, {
          spread: 100,
          decay: 0.91,
          scalar: 0.8,
        });
        fire(0.1, {
          spread: 120,
          startVelocity: 25,
          decay: 0.92,
          scalar: 1.2,
        });
        fire(0.1, {
          spread: 120,
          startVelocity: 45,
        });
      } else {
        setSuccess(false);
        toast.error(response.data.error);
      }
    } catch (error) {
      console.log(error);
      toast.error("Failed to deploy wallet");
      setSuccess(false);
    } finally {
      setIsLoading(false);
    }
  };

  return {
    handlePasskey,
    handleEmail,
    deployWallet,
  };
}
