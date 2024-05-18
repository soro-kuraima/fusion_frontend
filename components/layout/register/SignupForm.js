"use client";

import { Card, Typography } from "@material-tailwind/react";

import { useSelector } from "react-redux";

import Steps from "./Stepper";
import Step1 from "./steps/Step1";
import Step2 from "./steps/Step2";
import Step3 from "./steps/Step3";
import Step4 from "./steps/Step4";

const SignupForm = () => {
  const step = useSelector((state) => state.signup.step);

  return (
    <Card color="transparent" shadow={false} className="w-fit">
      <div className="p-5 bg-white rounded-xl">
        <Typography
          variant="h4"
          color="blue-gray"
          className="text-center font-outfit mb-6"
        >
          Signup to Fusion
        </Typography>

        <Steps />

        <div className="mt-8 mb-2 w-80 max-w-screen-lg sm:w-96">
          {step === 0 && <Step1 />}
          {step === 1 && <Step2 />}
          {step === 2 && <Step3 />}
          {step === 3 && <Step4 />}
        </div>
      </div>
    </Card>
  );
};

export default SignupForm;
