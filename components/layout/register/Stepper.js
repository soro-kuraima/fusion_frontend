"use client";

import { setStep } from "@/redux/slice/signUpSlice";
import { Step, Stepper } from "@material-tailwind/react";
import { Lock, Mail, UserRound } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";

export default function Steps() {
  const dispatch = useDispatch();
  const step = useSelector((state) => state.signup.step);

  return (
    <div className="relative flex items-center justify-center">
      <div className=" w-64">
        <Stepper
          activeStep={step}
          lineClassName="bg-transparent"
          activeLineClassName="bg-transparent"
        >
          <Step
            className="relative h-2 w-20 bg-gray-400 cursor-pointer"
            onClick={() => dispatch(setStep(0))}
          >
            {/* <UserRound className="h-4 w-4" /> */}
          </Step>

          <Step
            className="relative h-2 w-20 bg-gray-400 cursor-pointer"
            onClick={() => dispatch(setStep(1))}
          >
            {/* <Lock className="h-4 w-4" /> */}
          </Step>

          <Step
            className="relative h-2 w-20 bg-gray-400 cursor-pointer"
            onClick={() => dispatch(setStep(2))}
          >
            {/* <Mail className="h-4 w-4" /> */}
          </Step>
        </Stepper>
      </div>
    </div>
  );
}
