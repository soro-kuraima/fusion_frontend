"use client";

import { ethers } from "ethers";

import baseChain from "@/utils/baseChain";
import FusionProxyFactoryABI from "@/utils/contracts/FusionProxyFactory.json";
import config from "@/utils/config";
import { setCurrentChain } from "@/redux/slice/chainSlice";
import { useDispatch, useSelector } from "react-redux";
import {
  setDeployed,
  setGasCredit,
  setTokenBalanceData,
  setTokenConversionData,
  setWalletAddress,
  setWalletAddresses,
} from "@/redux/slice/userSlice";
import { useSearchParams } from "next/navigation";
import { useState } from "react";
import axios from "axios";

export default function useWallet() {
  const dispatch = useDispatch();
  const searchParams = useSearchParams();
  const currentChain = useSelector((state) => state.chain.currentChain);
  const walletAddress = useSelector((state) => state.user.walletAddress);
  const [wsProvider, setWsProvider] = useState(null);
  const tokenBalanceData = useSelector((state) => state.user.tokenBalanceData);
  const [timeout, setTimeout] = useState(null);

  const getDomain = () => {
    const domain = searchParams.get("domain");
    return domain;
  };

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

  const getFusionAddress = async (currentChain, domain) => {
    try {
      const provider = new ethers.providers.JsonRpcProvider(
        currentChain.rpcUrl
      );

      const factory = new ethers.Contract(
        currentChain.addresses.FusionProxyFactory,
        FusionProxyFactoryABI,
        provider
      );

      const address = await factory.getFusionProxy(domain?.toLowerCase());

      return address;
    } catch (error) {
      return ethers.constants.AddressZero;
    }
  };

  const loadAddresses = async (domain) => {
    let addresses = [];

    await Promise.all(
      config.map(async (chain) => {
        const address = await getFusionAddress(chain, domain);

        const isBaseChain = chain.chainId === baseChain.chainId;

        if (isBaseChain && address !== ethers.constants.AddressZero) {
          dispatch(setWalletAddress(address));
          dispatch(setDeployed(true));
        }

        addresses = [...addresses, { chainId: chain.chainId, address }];
        dispatch(setWalletAddresses(addresses));
      })
    );
  };

  const initializeBalance = async () => {
    let balanceData = [];

    const provider = new ethers.providers.JsonRpcProvider(currentChain.rpcUrl);

    const ethBalance = await provider.getBalance(walletAddress);

    balanceData.push({
      address: null,
      balance: Number(ethBalance),
      decimals: 18,
      logo: currentChain.logo,
      name: currentChain.symbol,
    });

    const tokens = currentChain.tokens;

    await Promise.all(
      tokens.map(async (token) => {
        if (!token.address) {
          return;
        }

        const contract = new ethers.Contract(
          token.address,
          ["function balanceOf(address) view returns (uint256)"],
          provider
        );

        const balance = await contract.balanceOf(walletAddress);

        balanceData.push({
          address: token.address,
          balance: Number(balance),
          decimals: token.decimals,
          logo: token.logo,
          name: token.symbol,
        });
      })
    );

    dispatch(setTokenBalanceData(balanceData));

    return balanceData;
  };

  const listenForBalance = async () => {
    if (wsProvider) {
      wsProvider.destroy();
    }

    let tokenBalanceData = await initializeBalance();

    console.log("Listening for balance");

    const WsProvider = new ethers.providers.WebSocketProvider(
      currentChain.wsUrl
    );

    WsProvider.on("block", async () => {
      const newBalance = Number(await WsProvider.getBalance(walletAddress));

      if (!tokenBalanceData) {
        return;
      }

      const updatedBalanceData = tokenBalanceData.map((balance) => {
        if (!balance.address) {
          return {
            ...balance,
            balance: newBalance,
          };
        } else {
          return balance;
        }
      });

      tokenBalanceData = updatedBalanceData;

      dispatch(setTokenBalanceData(updatedBalanceData));
    });

    const tokens = currentChain.tokens;

    tokens.map((token) => {
      if (!token.address) {
        return;
      }

      const contract = new ethers.Contract(
        token.address,
        [
          "event Transfer(address indexed from, address indexed to, uint256 value)",
          "function balanceOf(address) view returns (uint256)",
        ],
        WsProvider
      );

      contract.on("Transfer", (from, to, value) => {
        if (from !== walletAddress && to !== walletAddress) {
          return;
        }

        if (!tokenBalanceData) {
          return;
        }

        const balanceData = tokenBalanceData.map((balance) => {
          if (balance.address === token.address) {
            return {
              ...balance,
              balance: Number(value),
            };
          } else {
            return balance;
          }
        });

        tokenBalanceData = balanceData;

        dispatch(setTokenBalanceData(balanceData));
      });
    });

    setWsProvider(WsProvider);
  };

  const convertBalance = async (convert_id, id) => {
    try {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/public-conversion?convert_id=${convert_id}&id=${id}`
      );

      if (response.data.status.error_code !== "0") {
        return 0;
      }

      return response.data.data.quote[0].price;
    } catch (error) {
      return 0;
    }
  };

  const loadConversionData = async () => {
    const tokensConversion = await Promise.all(
      currentChain.tokens.map(async (token) => {
        const rate = await convertBalance(token.convert_id, token.usd_id);
        return {
          value: rate,
          address: token.address,
        };
      })
    );

    let conversionData = [...tokensConversion];

    dispatch(setTokenConversionData(conversionData));
  };

  const loadGasCredit = async (domain) => {
    try {
      const response = await axios.get(
        `${
          process.env.NEXT_PUBLIC_BACKEND_URL
        }/api/gasCredit/balance/${domain?.toLowerCase()}`
      );

      if (response.data.success) {
        dispatch(setGasCredit(response.data.senderBalance));
      } else {
        dispatch(setGasCredit(0));
      }
    } catch (error) {
      return 0;
    }
  };

  const listenForCredits = async (domain) => {
    if (timeout) {
      clearTimeout(timeout);
    }

    const interval = setInterval(async () => {
      await loadGasCredit(domain);
    }, 10000);

    setTimeout(interval);
  };

  const switchChain = async (chainId) => {
    const chain = config.find((chain) => chain.chainId === chainId);

    // Changes Requried here
    dispatch(setCurrentChain(chain));
  };

  return {
    getFusion,
    switchChain,
    loadAddresses,
    getDomain,
    listenForBalance,
    loadConversionData,
    loadGasCredit,
    listenForCredits,
  };
}
