"use client";

import useWallet from "@/hooks/useWallet";
import { Button } from "@material-tailwind/react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import React from "react";

const CrossChain = () => {
  const router = useRouter();
  const { getDomain } = useWallet();
  const domain = getDomain();

  return (
    <section className="bg-black text-white p-8 font-normal text-base rounded-xl space-y-3 text-left relative overflow-hidden">
      <h3 className="text-left z-20 relative">
        Enable Cross-chain
        <br />
        Transactions with Gas Credits
      </h3>

      <Button
        size="sm"
        className="rounded-full font-outfit z-20 relative"
        color="white"
        onClick={() => {
          if (domain) {
            router.push(`/gas?domain=${domain}`);
          }
        }}
      >
        Explore
      </Button>

      <div
        className="absolute h-80 w-full -right-44 -top-3 z-0"
        style={{
          background: "rgb(0,0,0)",
          background:
            "radial-gradient(circle, rgba(235,170,115,1) 0%, rgba(0,0,0,0) 70%)",
        }}
      />

      <Image
        src="/FusionGas.png"
        alt="Cross Chain"
        width={430}
        height={100}
        className="absolute -right-1/4 -top-8 z-10"
      />
    </section>
  );
};

export default CrossChain;
