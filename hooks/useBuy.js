"use client";
import { ethers } from "ethers";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { setGasAmount } from "@/redux/slice/gasSlice";
import FusionForwarderABI from "@/utils/contracts/FusionForwarder.json";
import FusionVaultABI from "@/utils/contracts/FusionVault.json";

export default function useBuy() {
  const walletAddress = useSelector((state) => state.user.walletAddress);
  const dispatch = useDispatch();

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

      const keypair = ethers.Wallet.createRandom();

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
          proof: "0x",
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
          console.log(estimate.data);
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
          proof: "0x",
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

  return {
    estimateGas,
  };
}
