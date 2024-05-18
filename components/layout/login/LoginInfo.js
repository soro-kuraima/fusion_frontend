import React from "react";
import Link from "next/link";
import { MoveRight } from "lucide-react";

const LoginInfo = () => {
  return (
    <section className="flex-1 flex justify-between flex-col">
      <div className="rounded-2xl p-10 text-center space-y-5">
        <h1 className="text-xl font-bold text-gray-800 uppercase">Fusion</h1>

        <h2 className="text-black mt-2 text-6xl uppercase font-medium leading-tight text-center">
          <span>ZK-POWERED</span> <br />
          <div className="relative">
            <div className="absolute w-8/12 h-6 bg-red-100 bottom-1 rounded-full z-0 left-1/2 -translate-x-1/2"></div>
            <span className="relative z-10">FORTRESS</span>
          </div>
          {/* <span>security</span> */}
        </h2>
      </div>

      <div className="text-center mb-10">
        <p className="text-lg text-gray-600 mb-1">Don't have account?</p>

        <Link href="/register" className="text-sm underline-offset font-medium">
          Create account <MoveRight size={16} className="inline-block ml-1" />
        </Link>
      </div>

      <div className="flex justify-center items-center h-20 bg-black text-white rounded-2xl">
        <p className="text-xs">ChainLink BlockMagic Hackathon</p>
      </div>
    </section>
  );
};

export default LoginInfo;
