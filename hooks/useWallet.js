"use client";

import { ethers } from "ethers";

import baseChain from "@/utils/baseChain";
import FusionProxyFactoryABI from "@/utils/contracts/FusionProxyFactory.json";

export default function useWallet() {
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

  return { getFusion };
}
