"use client";

import React from "react";
import {
  Button,
  Dialog,
  DialogHeader,
  DialogBody,
  DialogFooter,
} from "@material-tailwind/react";

import PubKey from "../ui/PubKey";
import QRCodeGenerator from "../ui/QRCodeGenerator";
import { useDispatch, useSelector } from "react-redux";
import { toggleQRModal } from "@/redux/slice/modalSlice";

const QRcodeModal = () => {
  const dispatch = useDispatch();
  const open = useSelector((state) => state.modal.QRModal);

  const handleOpen = () => {
    dispatch(toggleQRModal());
  };

  return (
    <Dialog
      size="sm"
      open={open}
      handler={handleOpen}
      animate={{
        mount: { scale: 1, y: 0 },
        unmount: { scale: 0.9, y: -100 },
      }}
    >
      <DialogHeader className="mx-auto w-fit text-3xl">
        Account Details
      </DialogHeader>

      <DialogBody className="text-center space-y-4 pb-6">
        <p className="text-xl text-medium">noober@Fusion.id</p>

        <div className="w-fit mx-auto">
          <QRCodeGenerator value="https://www.google.com" />
        </div>

        <PubKey pubkey="0x1234567890abcdef1234567890abcdef" />
      </DialogBody>
    </Dialog>
  );
};

export default QRcodeModal;
