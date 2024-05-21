"use client";

import { toggleQRModal } from "@/redux/slice/modalSlice";
import { Button } from "@material-tailwind/react";
import { LucideQrCode } from "lucide-react";

import React from "react";
import { useDispatch } from "react-redux";

const QR = () => {
  const dispatch = useDispatch();

  const handleQR = () => {
    dispatch(toggleQRModal());
  };

  return (
    <Button
      className=" rounded-full p-1.5 aspect-square"
      size="sm"
      onClick={handleQR}
    >
      <LucideQrCode size="20" />
    </Button>
  );
};

export default QR;
