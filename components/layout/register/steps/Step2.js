"use client";

import { Input, Button } from "@material-tailwind/react";
import { Fingerprint, Info } from "lucide-react";

const Step2 = () => {
  return (
    <div className="flex flex-col">
      <p className="font-noto text-sm text-gray-600">Your Password</p>
      <div className="mt-2">
        <Input
          label="*******"
          size="lg"
          className={"font-noto"}
          type="password"
        />
        <p className="mt-2 flex text-sm text-gray-500">
          <Info size={20} className="mr-1 inline" />
          Use at least 8 characters, one uppercase, one lowercase and one
          number.
        </p>
      </div>

      <div className="mt-2 flex items-center justify-center gap-4">
        <div className="mt-2 h-0.5 w-[45%] bg-gray-400"></div>
        <p className="mt-2 text-sm text-gray-600">or</p>
        <div className="mt-2 h-0.5 w-[45%] bg-gray-400"></div>
      </div>

      <Button
        color="white"
        className="mt-4 flex h-[5.7rem] w-full rounded-xl border-[1px] border-black bg-bg-off-white px-3"
      >
        <div className="flex h-full w-16 items-center justify-center rounded-lg bg-black/90">
          <Fingerprint className="h-5 w-5 text-white" />
        </div>

        <div
          className={
            "ml-3 flex h-full w-56 flex-col justify-center text-start font-noto normal-case "
          }
        >
          <h1 className="text-xl">Add Passkey</h1>
          <p className="mt-1 w-72 text-xs font-normal text-gray-500">
            This will be used to execute transactions
          </p>
        </div>
      </Button>

      <Button className="mt-8 w-fit bg-black">Continue</Button>
    </div>
  );
};

export default Step2;
