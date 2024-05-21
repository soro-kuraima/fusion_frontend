"use client";

import { useSelector } from "react-redux";

import ChainItem from "./chainSelector/ChainItem";

import config from "@/utils/config";

const ChainSelector = () => {
  const currentChain = useSelector((state) => state.chain.currentChain);

  return (
    <div className="flex w-fit items-center gap-3 mx-auto">
      {config.map((chain) => (
        <ChainItem
          key={chain.chainId}
          chainId={chain.chainId}
          logo={chain.logo}
          name={chain.chainName}
          isActive={chain.chainId === currentChain.chainId}
        />
      ))}
    </div>
  );
};

export default ChainSelector;
