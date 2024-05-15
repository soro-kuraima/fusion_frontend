"use client";

import {
  Card,
  Input,
  Checkbox,
  Button,
  Typography,
} from "@material-tailwind/react";

const SignupForm = () => {
  return (
    <Card color="transparent" shadow={false} className="w-fit mx-auto">
      <div className="p-5 bg-white rounded-t-xl">
        <Typography variant="h4" color="blue-gray" className="text-center">
          Signup to Fusion
        </Typography>

        <form className="mt-8 mb-2 w-80 max-w-screen-lg sm:w-96">
          <div className="mb-1 flex flex-col gap-6">
            <Input
              variant="standard"
              label="Your Fusion Domain"
              placeholder="hello@fusion.id"
            />
          </div>

          <Checkbox
            label={
              <Typography
                variant="small"
                color="gray"
                className="flex items-center font-normal"
              >
                Remember me
              </Typography>
            }
            containerProps={{ className: "-ml-2.5" }}
          />

          <Button className="mt-6" fullWidth>
            sign up
          </Button>
        </form>
      </div>

      <div className="border-[20px] border-white rounded-2xl p-8 -translate-y-5"></div>
    </Card>
  );
};

export default SignupForm;
