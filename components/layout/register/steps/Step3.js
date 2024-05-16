"use client";

import { Input, Button } from "@material-tailwind/react";

const Step3 = () => {
  return (
    <div className="flex flex-col">
      <p className="font-noto text-sm text-gray-600">Your Email Address</p>
      <div className="mt-2 flex w-full">
        <Input label="abc@gmail.com" size="lg" />
      </div>

      <Button className="mt-8 bg-black w-fit">Verify Email</Button>
    </div>
  );
};

export default Step3;
