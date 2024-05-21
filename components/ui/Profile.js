"use client";

import { User } from "lucide-react";
import { Button } from "@material-tailwind/react";

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
