"use client";

import { Button } from "@material-tailwind/react";

const RoundedGrayButton = ({ children, label }) => {
  return (
    <div className="space-y-2 text-gray-600">
      <Button
        className="rounded-full p-4 bg-gray-300 shadow-none"
        color="white"
      >
        {children}
      </Button>

      <p className="text-center text-sm">{label}</p>
    </div>
  );
};

export default RoundedGrayButton;
