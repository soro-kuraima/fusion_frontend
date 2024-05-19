"use client";

import { ethers } from "ethers";

import baseChain from "@/utils/baseChain";
import FusionProxyFactoryABI from "@/utils/contracts/FusionProxyFactory.json";
import config from "@/utils/config";
import { setCurrentChain } from "@/redux/slice/chainSlice";
import { useDispatch } from "react-redux";

export default function useWallet() {
  const dispatch = useDispatch();

  const getFusion = async (domain) => {
    try {
      const provider = new ethers.providers.JsonRpcProvider(baseChain.rpcUrl);

      const factory = new ethers.Contract(
        baseChain.addresses.FusionProxyFactory,
        FusionProxyFactoryABI,
        provider
      );

      const fusionAddress = await factory.getFusionProxy(
        domain?.toLowerCase() + ".fusion.id"
      );

      return fusionAddress;
    } catch (error) {
      return ethers.constants.AddressZero;
    }
  };

  const switchChain = async (chainId) => {
    const chain = config.find((chain) => chain.chainId === chainId);

    // Changes Requried here
    dispatch(setCurrentChain(chain));
  };

  return { getFusion, switchChain };
}
