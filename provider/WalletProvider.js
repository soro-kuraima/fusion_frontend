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
    listenForCredits,
    getGasUpdates,
    loadPublicStorage,
    loadTransactions,
  } = useWallet();
  const currentChain = useSelector((state) => state.chain.currentChain);
  const walletAddress = useSelector((state) => state.user.walletAddress);

  useEffect(() => {
    const domain = getDomain();

    if (domain) {
      loadAddresses(domain + ".fusion.id");
      listenForCredits(domain + ".fusion.id");
      getGasUpdates();
    }
  }, []);

  useEffect(() => {
    const abortController = new AbortController();
    let timeout;

    clearTimeout(timeout);

    if (currentChain && walletAddress) {
      timeout = setTimeout(() => {
        listenForBalance(abortController.signal);
        loadConversionData(abortController.signal);
        loadPublicStorage(abortController.signal);
        loadTransactions(abortController.signal);
      }, 1000);
    } else {
      clearTimeout(timeout);
    }

    return () => {
      abortController.abort();
      clearTimeout(timeout);
    };
  }, [currentChain, walletAddress]);

  return <>{children}</>;
}
