"use client";

import { setTokenIndex, toggleTokenDrawer } from "@/redux/slice/selectorSlice";
import { Button } from "@material-tailwind/react";
import { ChevronDown } from "lucide-react";
import Image from "next/image";
import { useDispatch, useSelector } from "react-redux";

export default function TokenSelector({ index, className = "" }) {
  const token = useSelector((state) => state.selector.token);
  const selectedToken = token ? token[index] : null;
  const dispatch = useDispatch();

  return (
    <Button
      size="sm"
      className={
        "w-full flex items-center justify-between font-outfit text-sm font-normal rounded-lg py-3 " +
        className
      }
      variant="outlined"
      onClick={() => {
        dispatch(setTokenIndex(index));
        dispatch(toggleTokenDrawer());
      }}
    >
      <div className="flex gap-2 items-center">
        <Image
          src={selectedToken?.logo}
          alt="TokenLogo"
          width={17}
          height={20}
        />

        {selectedToken?.name}
      </div>
      <ChevronDown size="20" />
    </Button>
  );
}
