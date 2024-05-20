"use client";

import { Button } from "@material-tailwind/react";
import { User } from "lucide-react";

import React from "react";

const Profile = () => {
  return (
    <Button
      color="white"
      className=" rounded-full p-1.5 aspect-square"
      size="sm"
    >
      <User size="20" />
    </Button>
  );
};

export default Profile;
