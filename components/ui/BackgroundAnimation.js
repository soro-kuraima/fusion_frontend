"use client";

import MaskTokenGray from "@/components/ui/MaskTokenGray";
import { usePathname } from "next/navigation";
import { useSelector } from "react-redux";

const BackgroundAnimation = () => {
  const pathname = usePathname();

  const currentChain =
    pathname.split("/")[1] === "login"
      ? "/tokens/link-logo.svg"
      : pathname.split("/")[1] === "register"
      ? "/tokens/link-logo.svg"
      : useSelector((state) => state.chain.currentChain.logo);

  return (
    <div className="bg-gray-200 w-screen h-screen overflow-hidden grid grid-cols-4  md:grid-cols-6 lg:grid-cols-8  xl:grid-cols-10 2xl:grid-cols-16 grid-container animate absolute top-0 left-0 opacity-10">
      {[...Array(16)].map((_, index) => (
        <div key={index} className="space-y-8 mx-auto">
          {[...Array(16)].map((_, index) => (
            <MaskTokenGray key={index} chain={currentChain} />
          ))}
        </div>
      ))}
    </div>
  );
};

export default BackgroundAnimation;
