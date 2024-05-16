"use client";

import { Input, Button } from "@material-tailwind/react";

const Step1 = () => {
  return (
    <div className="flex flex-col">
      <p className="font-noto text-sm text-gray-600">Your Fusion Domain</p>

      <div className="mt-2 flex w-full">
        <Input
          label="Choose your domain"
          size="lg"
          className={"rounded-r-none font-noto"}
          labelProps={{
            className: "after:rounded-tr-none font-noto ",
          }}
        />

        <Button
          ripple={false}
          variant="text"
          color="blue-gray"
          className={
            "flex items-center rounded-l-none border border-l-0 border-blue-gray-200 bg-blue-gray-500/10 px-3 py-0 font-noto text-sm font-normal normal-case "
          }
        >
          .fusion.id
        </Button>
      </div>

      <Button size="md" className="mt-8 w-fit bg-black">
        Select Domain
      </Button>
    </div>
  );
};

export default Step1;
