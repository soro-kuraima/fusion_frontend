"use client";

import { Button } from "@material-tailwind/react";
import React from "react";

const CrossChain = () => {
  return (
    <section className="bg-black text-white p-8 font-medium text-xl rounded-xl space-y-3 text-left">
      <h3 className="text-left">
        Enable Cross-chain
        <br />
        Transactions with Gas Credits
      </h3>

      <Button size="sm" className="rounded-full" color="white">
        Explore
      </Button>
    </section>
  );
};

export default CrossChain;
