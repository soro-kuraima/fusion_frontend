"use client";

import { Dialog, DialogBody } from "@material-tailwind/react";

import { useDispatch, useSelector } from "react-redux";

import PubKey from "../ui/PubKey";
import QRCodeGenerator from "../ui/QRCodeGenerator";

import { toggleQRModal } from "@/redux/slice/modalSlice";
import useWallet from "@/hooks/useWallet";

const QRcodeModal = () => {
  const dispatch = useDispatch();
  const open = useSelector((state) => state.modal.QRModal);
  const walletAddress = useSelector((state) => state.user.walletAddress);
  const currentChain = useSelector((state) => state.chain.currentChain);
  const { getDomain } = useWallet();
  const domain = getDomain();

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
      className="font-outfit bg-transparent items-center justify-center flex shadow-none"
    >
      <DialogBody className="text-center space-y-4 py-5 font-outfit bg-white rounded-2xl w-fit px-10">
        <p className="text-xs">
          <span className="text-lg font-bold text-black">
            {domain ? domain : "-"}
          </span>
          .fusion.id
        </p>

        <div className="w-fit mx-auto">
          <QRCodeGenerator value={walletAddress} />
        </div>

        <PubKey pubkey={walletAddress} logo={currentChain?.logo} />
      </DialogBody>
    </Dialog>
  );
};

export default QRcodeModal;
