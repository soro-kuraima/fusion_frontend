"use client";

import { Button } from "@material-tailwind/react";

export default function Step4() {
  return (
    <div className="flex flex-col">
      <p className="mt-2 font-noto text-sm text-gray-600">
        Your Wallet is ready to deploy. Click the button below to deploy your
        wallet.
      </p>

      <Button className="mt-8 w-fit bg-black">Deploy</Button>
    </div>
  );
}
