"use client";

import Image from "next/image";

export default function DeployAbout() {
  return (
    <div className="bg-white w-full p-8 py-4 pl-28 rounded-lg relative overflow-hidden">
      <p className="text-lg font-medium z-20">Info</p>
      <p className="text-xs z-20 relative font-light">
        Deploy your contract on other child networks. Don't worry, noone else
        can claim your domain, It is secured by zk-proofs and ChainLink
        functions.
      </p>

      <Image
        src="/SpeakerIcon.png"
        alt="Fusion Gas"
        width={150}
        height={50}
        className="absolute -top-2 -left-8 z-10 opacity-60"
      />
    </div>
  );
}
