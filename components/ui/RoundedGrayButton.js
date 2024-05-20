"use client";

import { Button } from "@material-tailwind/react";

const RoundedGrayButton = ({ children, label }) => {
  return (
    <div className="space-y-2 text-gray-600">
      <Button
        className="rounded-full p-5 bg-gray-300 shadow-none"
        color="white"
      >
        {children}
      </Button>

      <p>{label}</p>
    </div>
  );
};

export default RoundedGrayButton;
