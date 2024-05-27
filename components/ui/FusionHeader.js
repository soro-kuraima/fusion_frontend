"use client";

import useWallet from "@/hooks/useWallet";
import { useRouter } from "next/navigation";

export default function FusionHeader() {
  const router = useRouter();
  const { getDomain } = useWallet();

  return (
    <h1
      className="text-3xl font-medium hover:cursor-pointer "
      onClick={() => {
        const domain = getDomain();
        router.push(`/dashboard?domain=${domain}`);
      }}
    >
      Fusion
    </h1>
  );
}
