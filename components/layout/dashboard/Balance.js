"use client";

import { formatAmount } from "@/utils/FormatAmount";
import { Button } from "@material-tailwind/react";
import { Plus } from "lucide-react";

import { useEffect, useState } from "react";

import { useSelector } from "react-redux";

const Balance = () => {
  const [usdBalance, setUsdBalance] = useState(0);
  const currentChain = useSelector((state) => state.chain.currentChain);

  const tokenBalanceData = useSelector((state) => state.user.tokenBalanceData);
  const tokenConversionData = useSelector(
    (state) => state.user.tokenConversionData
  );

  useEffect(() => {
    if (tokenBalanceData && tokenConversionData) {
      let totalUsdBalance = 0;

      for (let i = 0; i < tokenBalanceData.length; i++) {
        const balance =
          tokenBalanceData[i].balance / 10 ** tokenBalanceData[i].decimals;
        const conversion = tokenConversionData.find(
          (conversion) => conversion.address === tokenBalanceData[i].address
        )?.value;

        if (!conversion) {
          continue;
        }

        totalUsdBalance += balance / conversion;
      }

      setUsdBalance(totalUsdBalance);
    }

    return () => {
      setUsdBalance(0);
    };
  }, [tokenBalanceData, tokenConversionData]);

  return (
    <div className="text-center gap-3 flex flex-col shadow-lg bg-white p-8 py-6 rounded-t-xl">
      <p className="text-gray-600 text-sm">Total Balance</p>

      <div className="flex text-4xl font-medium items-center space-x-3 justify-center">
        <span>$</span>
        <p>{formatAmount(usdBalance)}</p>

        <Button
          size="sm"
          className="rounded-full p-0 h-6 w-6 flex items-center justify-center text-2xl font-light"
          onClick={() => window.open(currentChain.faucetUrl, "_blank")}
        >
          <Plus className="w-4 h-4" />
        </Button>
      </div>
    </div>
  );
};

export default Balance;
