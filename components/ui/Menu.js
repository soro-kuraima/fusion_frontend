"use client";

import { Button } from "@material-tailwind/react";
import { LayoutDashboard, User } from "lucide-react";

import { usePathname, useRouter } from "next/navigation";

import useWallet from "@/hooks/useWallet";

const Menu = () => {
  const router = useRouter();
  const pathname = usePathname();

  const { getDomain } = useWallet();

  const handleClick = () => {
    const domain = getDomain();

    if (!domain) return;

    if (pathname === "/profile") {
      router.push(`/dashboard?domain=${domain}`);
    }

    if (pathname === "/dashboard") {
      router.push(`/profile?domain=${domain}`);
    }

    if (pathname === "/gas") {
      router.push(`/dashboard?domain=${domain}`);
    }
  };

  return (
    <>
      <Button
        color="white"
        className=" rounded-full p-1.5 aspect-square"
        size="sm"
        onClick={handleClick}
      >
        {pathname === "/dashboard" ? (
          <User size="20" />
        ) : (
          <LayoutDashboard size="20" />
        )}
      </Button>
    </>
  );
};

export default Menu;
