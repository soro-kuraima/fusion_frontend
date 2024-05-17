"use client";

import { Input, Button } from "@material-tailwind/react";
import { useDispatch, useSelector } from "react-redux";
import { useState } from "react";
import { setEmail } from "@/redux/slice/signUpSlice";
import { Loader2 } from "lucide-react";
import useSignup from "@/hooks/useSignup";

const Step3 = () => {
  const [isLoading, setIsLoading] = useState(false);
  const email = useSelector((state) => state.signup.email);
  const dispatch = useDispatch();
  const { handleEmail } = useSignup();
  const re = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/g;
  return (
    <div className="flex flex-col">
      <div className="mt-2 flex w-full">
        <Input
          label="Your Email Address"
          variant="standard"
          placeholder="abc@gmail.com"
          size="lg"
          className="font-outfit"
          value={email}
          onChange={(e) => {
            dispatch(setEmail(e.target.value));
          }}
        />
      </div>

      <Button
        className="mt-8 bg-black font-outfit normal-case flex items-center justify-center"
        disabled={isLoading || (re.test(email) ? false : true)}
        onClick={() => {
          handleEmail(setIsLoading);
        }}
      >
        {isLoading ? (
          <Loader2 className="animate-spin" size={20} />
        ) : (
          "Verify Email"
        )}
      </Button>
    </div>
  );
};

export default Step3;
