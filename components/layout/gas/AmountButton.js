"use client";

import { setAmount } from "@/redux/slice/gasSlice";
import { Button } from "@material-tailwind/react";
import { useDispatch, useSelector } from "react-redux";

export default function AmountButton({ amount }) {
  const selectedAmount = useSelector((state) => state.gas.amount);
  const isActive = selectedAmount === amount;
  const dispatch = useDispatch();

  return (
    <>
      <Button
        size="sm"
        className="w-full flex items-center justify-center font-outfit text-xs font-normal rounded-lg py-3 "
        style={{
          backgroundColor: isActive ? "black" : "#eeeeee",
          color: isActive ? "white" : "black",
        }}
        onClick={() => {
          dispatch(setAmount(amount));
        }}
      >
        <p>{amount} GAS</p>
        <div
          className="w-5 h-5"
          style={{
            backgroundColor: isActive ? "#FFD700" : "gray",
            maskImage: "url(/tokens/gas-logo.svg)",
            maskSize: "cover",
          }}
        ></div>
      </Button>
    </>
  );
}
