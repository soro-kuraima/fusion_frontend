"use client";

import { LucideQrCode } from "lucide-react";
import { Button } from "@material-tailwind/react";

import { useDispatch } from "react-redux";

import { toggleQRModal } from "@/redux/slice/modalSlice";

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
