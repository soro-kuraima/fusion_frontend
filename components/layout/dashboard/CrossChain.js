"use client";

import { Button } from "@material-tailwind/react";
import Image from "next/image";
import React from "react";

const CrossChain = () => {
  return (
    <section className="bg-black text-white p-8 font-normal text-base rounded-xl space-y-3 text-left relative overflow-hidden">
      <h3 className="text-left z-0">
        Enable Cross-chain
        <br />
        Transactions with Gas Credits
      </h3>

      <Button size="sm" className="rounded-full font-outfit z-10" color="white">
        Explore
      </Button>

      <Image
        src="/FusionGas.png"
        alt="Cross Chain"
        width={430}
        height={100}
        className="absolute -right-1/4 -top-8 z-0"
      />
    </section>
  );
};

export default CrossChain;
