"use client";

import { Dialog, DialogBody } from "@material-tailwind/react";

import { useDispatch, useSelector } from "react-redux";

import PubKey from "../ui/PubKey";
import QRCodeGenerator from "../ui/QRCodeGenerator";

import { toggleQRModal } from "@/redux/slice/modalSlice";

const QRcodeModal = () => {
  const dispatch = useDispatch();
  const open = useSelector((state) => state.modal.QRModal);

  const handleOpen = () => {
    dispatch(toggleQRModal());
  };

  return (
    <Dialog
      size="xs"
      open={open}
      handler={handleOpen}
      animate={{
        mount: { scale: 1, y: 0 },
        unmount: { scale: 0.9, y: -100 },
      }}
    >
      <DialogBody className="text-center space-y-4 py-10">
        <div className="w-fit mx-auto">
          <QRCodeGenerator value="https://www.google.com" />
        </div>
        <p className="text-xl text-medium">noober@Fusion.id</p>
        <PubKey pubkey="0x1234567890abcdef1234567890abcdef" />
      </DialogBody>
    </Dialog>
  );
};

export default QRcodeModal;
