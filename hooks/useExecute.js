"use client";

import { setGasAmount } from "@/redux/slice/transferSlice";
import { ethers } from "ethers";
import { useDispatch, useSelector } from "react-redux";
import useWallet from "./useWallet";
import FusionForwarderABI from "@/utils/contracts/FusionForwarder.json";
import axios from "axios";
import { toast } from "sonner";
import { useConfetti } from "@/utils/ui/fireConfetti";

export default function useExecute() {
  const [selectedToken, gasToken] = useSelector(
    (state) => state.selector.token
  );
  const dispatch = useDispatch();
  const gasless = useSelector((state) => state.transfer.gasless);
  const currentChain = useSelector((state) => state.chain.currentChain);
  const walletAddress = useSelector((state) => state.user.walletAddress);
  const { initializeProofWallet } = useWallet();
  const amount = useSelector((state) => state.transfer.amount);
  const recipient = useSelector((state) => state.transfer.recipient);
  const txProof = useSelector((state) => state.proof.txProof);
  const { getDomain, loadGasCredit, loadTransactions } = useWallet();
  const domain = getDomain();
  const { fireMultiple } = useConfetti();

  const estimateGas = async () => {
    try {
      const provider = new ethers.providers.JsonRpcProvider(
        currentChain.rpcUrl
      );

      if (!walletAddress) {
        dispatch(setGasAmount(null));
        return;
      }

      const forwarder = new ethers.Contract(
        currentChain.addresses.FusionForwarder,
        FusionForwarderABI,
        provider
      );

      const keypair = await initializeProofWallet();

      if (selectedToken.address === null) {
        const message = {
          from: keypair.address,
          recipient: walletAddress,
          deadline: Number((Date.now() / 1000).toFixed(0)) + 2000,
          nonce: Number(await forwarder.nonces(keypair.address)),
          gas: 1000000,
          proof: txProof,
          to: recipient,
          value: (Number(amount) * 10 ** selectedToken.decimals).toFixed(0),
          data: "0x",
        };

        const data712 = {
          types: {
            ForwardExecute: [
              { name: "from", type: "address" },
              { name: "recipient", type: "address" },
              { name: "deadline", type: "uint256" },
              { name: "nonce", type: "uint256" },
              { name: "gas", type: "uint256" },
              { name: "proof", type: "bytes" },
              { name: "to", type: "address" },
              { name: "value", type: "uint256" },
              { name: "data", type: "bytes" },
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
          to: message.to,
          value: message.value,
          data: message.data,
          signature: signature,
        };

        if (gasless) {
          const estimate = await axios.get(
            `${
              process.env.NEXT_PUBLIC_BACKEND_URL
            }/api/execute/estimate/gasless/${
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
        } else if (gasToken.address === null) {
          const estimate = await axios.get(
            `${
              process.env.NEXT_PUBLIC_BACKEND_URL
            }/api/execute/estimate/native/${
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
        } else {
          const estimate = await axios.get(
            `${
              process.env.NEXT_PUBLIC_BACKEND_URL
            }/api/execute/estimate/erc20/${
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
        }
      } else {
        const erc20Contract = new ethers.Contract(
          selectedToken.address,
          ["function transfer(address to, uint256 amount) returns (bool)"],
          provider
        );

        const data = erc20Contract.interface.encodeFunctionData("transfer", [
          recipient,
          (Number(amount) * 10 ** selectedToken.decimals).toFixed(0),
        ]);

        const message = {
          from: keypair.address,
          recipient: walletAddress,
          deadline: Number((Date.now() / 1000).toFixed(0)) + 2000,
          nonce: Number(await forwarder.nonces(keypair.address)),
          gas: 1000000,
          proof: txProof,
          to: selectedToken.address,
          value: 0,
          data: data,
        };

        const data712 = {
          types: {
            ForwardExecute: [
              { name: "from", type: "address" },
              { name: "recipient", type: "address" },
              { name: "deadline", type: "uint256" },
              { name: "nonce", type: "uint256" },
              { name: "gas", type: "uint256" },
              { name: "proof", type: "bytes" },
              { name: "to", type: "address" },
              { name: "value", type: "uint256" },
              { name: "data", type: "bytes" },
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
          to: message.to,
          value: message.value,
          data: message.data,
          signature: signature,
        };

        if (gasless) {
          const estimate = await axios.get(
            `${
              process.env.NEXT_PUBLIC_BACKEND_URL
            }/api/execute/estimate/gasless/${
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
        } else if (gasToken.address === null) {
          const estimate = await axios.get(
            `${
              process.env.NEXT_PUBLIC_BACKEND_URL
            }/api/execute/estimate/native/${
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
        } else {
          const estimate = await axios.get(
            `${
              process.env.NEXT_PUBLIC_BACKEND_URL
            }/api/execute/estimate/erc20/${
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
        }
      }
    } catch (error) {
      console.error(error);
    }
  };

  const execute = async (
    currentChain,
    amount,
    selectedToken,
    gasToken,
    recipient,
    txProof,
    gasless,
    walletAddress
  ) => {
    try {
      const provider = new ethers.providers.JsonRpcProvider(
        currentChain.rpcUrl
      );

      if (!walletAddress) {
        dispatch(setGasAmount(null));
        return;
      }

      const forwarder = new ethers.Contract(
        currentChain.addresses.FusionForwarder,
        FusionForwarderABI,
        provider
      );

      const keypair = await initializeProofWallet();

      if (selectedToken.address === null) {
        const message = {
          from: keypair.address,
          recipient: walletAddress,
          deadline: Number((Date.now() / 1000).toFixed(0)) + 2000,
          nonce: Number(await forwarder.nonces(keypair.address)),
          gas: 1000000,
          proof: txProof,
          to: recipient,
          value: (Number(amount) * 10 ** selectedToken.decimals).toFixed(0),
          data: "0x",
        };

        const data712 = {
          types: {
            ForwardExecute: [
              { name: "from", type: "address" },
              { name: "recipient", type: "address" },
              { name: "deadline", type: "uint256" },
              { name: "nonce", type: "uint256" },
              { name: "gas", type: "uint256" },
              { name: "proof", type: "bytes" },
              { name: "to", type: "address" },
              { name: "value", type: "uint256" },
              { name: "data", type: "bytes" },
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
          to: message.to,
          value: message.value,
          data: message.data,
          signature: signature,
        };

        if (gasless) {
          const response = await axios.post(
            `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/execute/gasless/${
              domain?.toLowerCase() + ".fusion.id"
            }/${currentChain.chainId}`,
            {
              forwardRequest,
              mode: "password",
            }
          );

          if (response.data.success) {
            await loadGasCredit(domain?.toLowerCase() + ".fusion.id");
            toast.success("Transaction sent successfully");
            loadTransactions();
            fireMultiple();
            return true;
          } else {
            toast.error(response.data.error);
            return false;
          }
        } else if (gasToken.address === null) {
          const response = await axios.post(
            `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/execute/native/${currentChain.chainId}`,
            {
              forwardRequest,
              mode: "password",
            }
          );

          if (response.data.success) {
            toast.success("Transaction sent successfully");
            loadTransactions();
            fireMultiple();
            return true;
          } else {
            toast.error(response.data.error);
            return false;
          }
        } else {
          const response = await axios.post(
            `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/execute/erc20/${currentChain.chainId}?address=${gasToken.address}`,
            {
              forwardRequest,
              mode: "password",
            }
          );
          if (response.data.success) {
            toast.success("Transaction sent successfully");
            loadTransactions();
            fireMultiple();
            return true;
          } else {
            toast.error(response.data.error);
            return false;
          }
        }
      } else {
        const erc20Contract = new ethers.Contract(
          selectedToken.address,
          ["function transfer(address to, uint256 amount) returns (bool)"],
          provider
        );

        const data = erc20Contract.interface.encodeFunctionData("transfer", [
          recipient,
          (Number(amount) * 10 ** selectedToken.decimals).toFixed(0),
        ]);

        const message = {
          from: keypair.address,
          recipient: walletAddress,
          deadline: Number((Date.now() / 1000).toFixed(0)) + 2000,
          nonce: Number(await forwarder.nonces(keypair.address)),
          gas: 1000000,
          proof: txProof,
          to: selectedToken.address,
          value: 0,
          data: data,
        };

        const data712 = {
          types: {
            ForwardExecute: [
              { name: "from", type: "address" },
              { name: "recipient", type: "address" },
              { name: "deadline", type: "uint256" },
              { name: "nonce", type: "uint256" },
              { name: "gas", type: "uint256" },
              { name: "proof", type: "bytes" },
              { name: "to", type: "address" },
              { name: "value", type: "uint256" },
              { name: "data", type: "bytes" },
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
          to: message.to,
          value: message.value,
          data: message.data,
          signature: signature,
        };

        if (gasless) {
          const response = await axios.post(
            `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/execute/gasless/${
              domain?.toLowerCase() + ".fusion.id"
            }/${currentChain.chainId}`,
            {
              forwardRequest,
              mode: "password",
            }
          );

          if (response.data.success) {
            await loadGasCredit(domain?.toLowerCase() + ".fusion.id");
            toast.success("Transaction sent successfully");
            loadTransactions();
            fireMultiple();
            return true;
          } else {
            toast.error(response.data.error);
            return false;
          }
        } else if (gasToken.address === null) {
          const response = await axios.post(
            `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/execute/native/${currentChain.chainId}`,
            {
              forwardRequest,
              mode: "password",
            }
          );

          if (response.data.success) {
            toast.success("Transaction sent successfully");
            loadTransactions();
            fireMultiple();
            return true;
          } else {
            toast.error(response.data.error);
            return false;
          }
        } else {
          const response = await axios.post(
            `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/execute/erc20/${currentChain.chainId}?address=${gasToken.address}`,
            {
              forwardRequest,
              mode: "password",
            }
          );
          if (response.data.success) {
            toast.success("Transaction sent successfully");
            loadTransactions();
            fireMultiple();
            return true;
          } else {
            toast.error(response.data.error);
            return false;
          }
        }
      }
    } catch (error) {
      console.error(error);
    }
  };

  return { estimateGas, execute };
}
