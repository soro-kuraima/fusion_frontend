import React from "react";
import Link from "next/link";
import { MoveRight } from "lucide-react";

const SignUpInfo = () => {
  return (
    <section className="flex-1 flex justify-between flex-col">
      <div className="rounded-2xl p-10 text-center space-y-5">
        <h1 className="text-xl font-bold text-gray-800 uppercase">Defuse</h1>

        <h2 className="text-black mt-2 text-6xl uppercase font-medium leading-tight text-center">
          <span>ZK-Proof</span> <br />
          <div className="relative">
            <div className="absolute w-8/12 h-6 bg-red-100 bottom-1 rounded-full z-0 left-1/2 -translate-x-1/2"></div>
            <span className="relative z-10">AA Wallet</span>
          </div>
        </h2>
      </div>

      <div className="text-center mb-10">
        <p className="text-lg text-gray-600 mb-1">Already have an account?</p>

        <Link href="/login" className="text-sm underline-offset font-medium">
          Login Now
          <MoveRight size={16} className="inline-block ml-1" />
        </Link>
      </div>
    </section>
  );
};

export default SignUpInfo;
