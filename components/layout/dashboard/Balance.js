"use client";

import { Button } from "@material-tailwind/react";

import React from "react";

const Balance = () => {
  return (
    <div className="text-center space-y-3 bg-white p-8 rounded-t-xl">
      <p className="text-gray-600 text-lg">Total Balance</p>

      <div className="flex text-4xl font-medium items-center space-x-3 justify-center">
        <span>$</span>
        <p>203.4908</p>

        <Button
          size="sm"
          className="rounded-full p-0 h-6 w-6 flex items-center justify-center text-2xl font-light"
        >
          +
        </Button>
      </div>
    </div>
  );
};

export default Balance;
