"use client";

import useWallet from "@/hooks/useWallet";
import { useEffect } from "react";
import { useSelector } from "react-redux";

export default function WalletProvider({ children }) {
  const {
    loadAddresses,
    getDomain,
    listenForBalance,
    loadConversionData,
  } = useWallet();
  const currentChain = useSelector((state) => state.chain.currentChain);
  const walletAddress = useSelector((state) => state.user.walletAddress);

  useEffect(() => {
    const domain = getDomain();

    if (domain) {
      loadAddresses(domain + ".fusion.id");
    }
  }, []);

  useEffect(() => {
    if (currentChain && walletAddress) {
      listenForBalance();
      loadConversionData();
    }
  }, [currentChain, walletAddress]);

  return <>{children}</>;
}
