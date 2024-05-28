"use client";
import { ethers } from "ethers";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { setGasAmount } from "@/redux/slice/gasSlice";
import FusionForwarderABI from "@/utils/contracts/FusionForwarder.json";
import FusionVaultABI from "@/utils/contracts/FusionVault.json";
import useWallet from "./useWallet";
import { toast } from "sonner";
import { useConfetti } from "@/utils/ui/fireConfetti";

export default function useBuy() {
  const walletAddress = useSelector((state) => state.user.walletAddress);
  const dispatch = useDispatch();
  const {
    initializeProofWallet,
    loadGasCredit,
    loadTransactions,
  } = useWallet();
  const txProof = useSelector((state) => state.proof.txProof);

  const [selectedToken, gasToken] = useSelector(
    (state) => state.selector.token
  );
  const currentChain = useSelector((state) => state.chain.currentChain);
  const amount = useSelector((state) => state.gas.amount);
  const updates = useSelector((state) => state.gas.updates);

  const selectedUpdate = updates?.find(
    (update) => update.chainId === currentChain.chainId
  );
  const selectedPrice = selectedUpdate?.tokens.find(
    (update) => update.address === selectedToken?.address
  );
  const { fire } = useConfetti();

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

      const FusionVault = new ethers.Contract(
        currentChain.addresses.FusionVault,
        FusionVaultABI,
        provider
      );

      const keypair = await initializeProofWallet();

      if (selectedToken.address === null) {
        const deposit = FusionVault.interface.encodeFunctionData("deposit", [
          ethers.constants.AddressZero,
          Number(selectedPrice?.creditCost * amount).toFixed(0),
        ]);

        const message = {
          from: keypair.address,
          recipient: walletAddress,
          deadline: Number((Date.now() / 1000).toFixed(0)) + 2000,
          nonce: Number(await forwarder.nonces(keypair.address)),
          gas: 1000000,
          proof: txProof ? txProof : "0x",
          to: FusionVault.address,
          value: Number(selectedPrice?.creditCost * amount).toFixed(0),
          data: deposit,
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

        if (gasToken.address == null) {
          const estimate = await axios.get(
            `${
              process.env.NEXT_PUBLIC_BACKEND_URL
            }/api/execute/estimate/native/${
              currentChain.chainId
            }?forwardRequest=${JSON.stringify(forwardRequest)}`
          );

          if (estimate.data.success) {
            dispatch(setGasAmount(estimate.data.estimates.estimateFees));
            return;
          } else {
            console.log(estimate.data);
            dispatch(setGasAmount(null));
            return 0;
          }
        }

        const estimate = await axios.get(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/execute/estimate/erc20/${
            currentChain.chainId
          }?forwardRequest=${JSON.stringify(forwardRequest)}&address=${
            gasToken.address
          }`
        );

        if (estimate.data.success) {
          dispatch(setGasAmount(estimate.data.estimates.estimateFees));
          return;
        }
        dispatch(setGasAmount(null));
      } else {
        const to = [selectedToken.address, FusionVault.address];
        let toHash = ethers.constants.HashZero;
        for (let i = 0; i < to.length; i++) {
          toHash = ethers.utils.keccak256(
            ethers.utils.solidityPack(["bytes32", "address"], [toHash, to[i]])
          );
        }

        const value = [0, 0];
        let valueHash = ethers.constants.HashZero;
        for (let i = 0; i < value.length; i++) {
          valueHash = ethers.utils.keccak256(
            ethers.utils.solidityPack(
              ["bytes32", "uint256"],
              [valueHash, value[i]]
            )
          );
        }

        const erc20Contract = new ethers.Contract(
          selectedToken.address,
          [
            "function approve(address spender, uint256 amount) public returns (bool)",
          ],
          provider
        );

        const approveData = erc20Contract.interface.encodeFunctionData(
          "approve",
          [
            FusionVault.address,
            Number(amount * selectedPrice?.creditCost).toFixed(0),
          ]
        );

        const depositData = FusionVault.interface.encodeFunctionData(
          "deposit",
          [
            selectedToken.address,
            Number(amount * selectedPrice?.creditCost).toFixed(0),
          ]
        );

        const dataArray = [approveData, depositData];

        let dataHash = ethers.constants.HashZero;
        for (let i = 0; i < dataArray.length; i++) {
          dataHash = ethers.utils.keccak256(
            ethers.utils.solidityPack(
              ["bytes32", "bytes32"],
              [dataHash, ethers.utils.keccak256(dataArray[i])]
            )
          );
        }

        const message = {
          from: keypair.address,
          recipient: walletAddress,
          deadline: Number((Date.now() / 1000).toFixed(0)) + 2000,
          nonce: Number(await forwarder.nonces(keypair.address)),
          gas: 1000000,
          proof: txProof ? txProof : "0x",
          to: toHash,
          value: valueHash,
          data: dataHash,
        };

        const data712 = {
          types: {
            ForwardExecuteBatch: [
              { name: "from", type: "address" },
              { name: "recipient", type: "address" },
              { name: "deadline", type: "uint256" },
              { name: "nonce", type: "uint256" },
              { name: "gas", type: "uint256" },
              { name: "proof", type: "bytes" },
              { name: "to", type: "bytes32" },
              { name: "value", type: "bytes32" },
              { name: "data", type: "bytes32" },
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
          to: to,
          value: value,
          data: dataArray,
          signature: signature,
        };

        if (gasToken.address == null) {
          const estimate = await axios.get(
            `${
              process.env.NEXT_PUBLIC_BACKEND_URL
            }/api/executeBatch/estimate/native/${
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
          `${
            process.env.NEXT_PUBLIC_BACKEND_URL
          }/api/executeBatch/estimate/erc20/${
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
    } catch (error) {
      dispatch(setGasAmount(null));
      console.error(error);
    }
  };

  const buy = async (
    proof,
    selectedToken,
    gasToken,
    amount,
    currentChain,
    domain,
    walletAddress,
    selectedPrice
  ) => {
    try {
      const provider = new ethers.providers.JsonRpcProvider(
        currentChain.rpcUrl
      );

      const forwarder = new ethers.Contract(
        currentChain.addresses.FusionForwarder,
        FusionForwarderABI,
        provider
      );

      const FusionVault = new ethers.Contract(
        currentChain.addresses.FusionVault,
        FusionVaultABI,
        provider
      );

      const keypair = await initializeProofWallet();

      if (selectedToken.address === null) {
        const deposit = FusionVault.interface.encodeFunctionData("deposit", [
          ethers.constants.AddressZero,
          Number(selectedPrice?.creditCost * amount).toFixed(0),
        ]);

        const message = {
          from: keypair.address,
          recipient: walletAddress,
          deadline: Number((Date.now() / 1000).toFixed(0)) + 2000,
          nonce: Number(await forwarder.nonces(keypair.address)),
          gas: 1000000,
          proof: proof,
          to: FusionVault.address,
          value: Number(selectedPrice?.creditCost * amount).toFixed(0),
          data: deposit,
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

        if (gasToken.address == null) {
          const response = await axios.post(
            `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/execute/native/${currentChain.chainId}`,
            {
              forwardRequest,
              mode: "password",
            }
          );

          if (response.data.success) {
            toast.promise(
              () =>
                verifyTransaction(
                  response.data.receipt.transactionHash,
                  selectedToken,
                  currentChain,
                  domain
                ),
              {
                loading: "Verifying...",
              }
            );
            return true;
          } else {
            toast.error(response.data.error);
            return false;
          }
        }

        const response = await axios.post(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/execute/erc20/${currentChain.chainId}?address=${gasToken.address}`,
          {
            forwardRequest,
            mode: "password",
          }
        );
        if (response.data.success) {
          toast.promise(
            () =>
              verifyTransaction(
                response.data.receipt.transactionHash,
                selectedToken,
                currentChain,
                domain
              ),
            {
              loading: "Verifying...",
            }
          );
          return true;
        } else {
          toast.error(response.data.error);
          return false;
        }
      } else {
        const to = [selectedToken.address, FusionVault.address];
        let toHash = ethers.constants.HashZero;
        for (let i = 0; i < to.length; i++) {
          toHash = ethers.utils.keccak256(
            ethers.utils.solidityPack(["bytes32", "address"], [toHash, to[i]])
          );
        }

        const value = [0, 0];
        let valueHash = ethers.constants.HashZero;
        for (let i = 0; i < value.length; i++) {
          valueHash = ethers.utils.keccak256(
            ethers.utils.solidityPack(
              ["bytes32", "uint256"],
              [valueHash, value[i]]
            )
          );
        }

        const erc20Contract = new ethers.Contract(
          selectedToken.address,
          [
            "function approve(address spender, uint256 amount) public returns (bool)",
          ],
          provider
        );

        const approveData = erc20Contract.interface.encodeFunctionData(
          "approve",
          [
            FusionVault.address,
            Number(amount * selectedPrice?.creditCost).toFixed(0),
          ]
        );

        const depositData = FusionVault.interface.encodeFunctionData(
          "deposit",
          [
            selectedToken.address,
            Number(amount * selectedPrice?.creditCost).toFixed(0),
          ]
        );

        const dataArray = [approveData, depositData];

        let dataHash = ethers.constants.HashZero;
        for (let i = 0; i < dataArray.length; i++) {
          dataHash = ethers.utils.keccak256(
            ethers.utils.solidityPack(
              ["bytes32", "bytes32"],
              [dataHash, ethers.utils.keccak256(dataArray[i])]
            )
          );
        }

        const message = {
          from: keypair.address,
          recipient: walletAddress,
          deadline: Number((Date.now() / 1000).toFixed(0)) + 2000,
          nonce: Number(await forwarder.nonces(keypair.address)),
          gas: 1000000,
          proof: proof,
          to: toHash,
          value: valueHash,
          data: dataHash,
        };

        const data712 = {
          types: {
            ForwardExecuteBatch: [
              { name: "from", type: "address" },
              { name: "recipient", type: "address" },
              { name: "deadline", type: "uint256" },
              { name: "nonce", type: "uint256" },
              { name: "gas", type: "uint256" },
              { name: "proof", type: "bytes" },
              { name: "to", type: "bytes32" },
              { name: "value", type: "bytes32" },
              { name: "data", type: "bytes32" },
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
          to: to,
          value: value,
          data: dataArray,
          signature: signature,
        };

        if (gasToken.address == null) {
          const response = await axios.post(
            `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/executeBatch/native/${currentChain.chainId}`,
            {
              forwardRequest,
              mode: "password",
            }
          );

          if (response.data.success) {
            toast.promise(
              () =>
                verifyTransaction(
                  response.data.receipt.transactionHash,
                  selectedToken,
                  currentChain,
                  domain
                ),
              {
                loading: "Verifying...",
              }
            );
            return true;
          } else {
            toast.error(response.data.error);
            return false;
          }
        }

        const response = await axios.post(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/executeBatch/erc20/${currentChain.chainId}?address=${gasToken.address}`,
          {
            forwardRequest,
            mode: "password",
          }
        );
        if (response.data.success) {
          toast.promise(
            () =>
              verifyTransaction(
                response.data.receipt.transactionHash,
                selectedToken,
                currentChain,
                domain
              ),
            {
              loading: "Verifying...",
            }
          );
          return true;
        } else {
          toast.error(response.data.error);
          return false;
        }
      }
    } catch (error) {
      console.error(error);
      return 0;
    }
  };

  const verifyTransaction = async (
    txHash,
    selectedToken,
    currentChain,
    domain
  ) => {
    try {
      if (selectedToken.address === null) {
        const response = await axios.post(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/gasCredit/native/verify/${
            currentChain.chainId
          }?tx=${txHash}&domain=${domain + ".fusion.id"}`
        );

        if (response.data.success) {
          await loadGasCredit(domain + ".fusion.id");
          toast.success("Transaction verified");
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
          loadTransactions();
        } else {
          console.log(response.data);
          toast.error("Failed to verify transaction");
        }
      } else {
        const response = await axios.post(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/gasCredit/erc20/verify/${
            currentChain.chainId
          }?tx=${txHash}&domain=${domain + ".fusion.id"}&address=${
            selectedToken.address
          }`
        );

        if (response.data.success) {
          await loadGasCredit(domain + ".fusion.id");
          toast.success("Transaction verified");
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
          loadTransactions();
        } else {
          console.log(response.data);
          toast.error("Failed to verify transaction");
        }
      }
    } catch (error) {
      toast.error("Failed to verify transaction");
      console.log(error);
    } finally {
    }
  };

  return {
    estimateGas,
    buy,
    verifyTransaction,
  };
}
