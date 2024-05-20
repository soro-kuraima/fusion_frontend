"use client";

import { Button } from "@material-tailwind/react";
import { LucideQrCode } from "lucide-react";

import React from "react";

const QR = () => {
  return (
    <Button className=" rounded-full p-1.5 aspect-square" size="sm">
      <LucideQrCode size="20" />
    </Button>
  );
};

export default QR;
