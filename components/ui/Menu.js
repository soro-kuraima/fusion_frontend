"use client";

import useWallet from "@/hooks/useWallet";
import { Button } from "@material-tailwind/react";
import { LayoutDashboard } from "lucide-react";
import { useRouter } from "next/navigation";

import React from "react";

const Menu = () => {
  const { getDomain } = useWallet();
  const router = useRouter();
  return (
    <Button
      color="white"
      className=" rounded-full p-1.5 aspect-square"
      size="sm"
      onClick={() => {
        const domain = getDomain();

        if (domain) {
          router.push(`/dashboard?domain=${domain}`);
        }
      }}
    >
      <LayoutDashboard size="20" />
    </Button>
  );
};

export default Menu;
