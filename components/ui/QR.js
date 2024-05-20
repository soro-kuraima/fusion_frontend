"use client";

import { Button } from "@material-tailwind/react";
import { LucideQrCode } from "lucide-react";

import React from "react";

const QR = () => {
  return (
    <Button className=" rounded-full p-1.5 px-2 aspect-square" size="sm">
      <LucideQrCode size="15" />
    </Button>
  );
};

export default QR;
