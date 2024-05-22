"use client";

import { Button } from "@material-tailwind/react";

import { useRouter } from "next/navigation";

import useWallet from "@/hooks/useWallet";

const RoundedGrayButton = ({ children, label, href }) => {
  const router = useRouter();

  const { getDomain } = useWallet();

  return (
    <div className="space-y-2 text-gray-600">
      <Button
        className="rounded-full p-4 bg-gray-300 shadow-none"
        color="white"
        onClick={() => {
          if (href) {
            router.push(href + "?domain=" + getDomain());
          }
        }}
      >
        {children}
      </Button>

      <p className="text-center text-sm">{label}</p>
    </div>
  );
};

export default RoundedGrayButton;
