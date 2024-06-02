"use client";

import { Button } from "@material-tailwind/react";
import { LayoutDashboard, User, X } from "lucide-react";

import { usePathname, useRouter } from "next/navigation";

import useWallet from "@/hooks/useWallet";

const Menu = () => {
  const router = useRouter();
  const pathname = usePathname();

  const { getDomain } = useWallet();

  const handleClick = () => {
    const domain = getDomain();

    if (!domain) return;

    if (pathname === "/dashboard") {
      router.push(`/profile?domain=${domain}`);
    } else {
      router.push(`/dashboard?domain=${domain}`);
    }
  };

  return (
    <>
      <Button
        color="white"
        className=" rounded-full p-1.5 aspect-square shadow-md"
        size="sm"
        onClick={handleClick}
      >
        {pathname === "/dashboard" ? <User size="20" /> : <X size="20" />}
      </Button>
    </>
  );
};

export default Menu;
