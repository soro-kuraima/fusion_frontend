"use client";

import useWallet from "@/hooks/useWallet";
import Image from "next/image";

export default function ProfileMain() {
  const { getDomain } = useWallet();
  const domain = getDomain();

  function isLightColor(color) {
    const [r, g, b] = color.slice(5, -1).split(",").map(Number);
    const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
    return luminance > 0.2;
  }

  function domainToColor(domain) {
    let hash = 0;

    for (let i = 0; i < domain.length; i++) {
      hash = domain.charCodeAt(i) + ((hash << 5) + hash);
    }

    const r = (hash & 0xff0000) >> 17;
    const g = (hash & 0x00ff00) >> 8;
    const b = hash & 0x0000ff;
    const a = 1;

    return `rgba(${r}, ${g}, ${b}, ${a})`;
  }

  const color = domain ? domainToColor(domain) : "rgba(0, 0, 0, 0)";

  return (
    <div className="text-center gap-3 flex justify-between bg-white p-8 py-5 h-24 rounded-t-xl relative items-center">
      <div
        className="w-full shadow-lg flex flex-col rounded-t-xl absolute top-0 left-0 h-24 z-0"
        style={{
          filter: `contrast(170%) brightness(400%)`,
          background: `linear-gradient(302deg,${color}, rgba(0,0,0,0)),
url("data:image/svg+xml,%3Csvg viewBox='0 0 246 246' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='4.61' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
        }}
      ></div>

      <div className="z-10 flex flex-col">
        <p className="text-black font-bold text-3xl z-10 text-left">
          {domain ? domain : "-"}
        </p>
        <p className="text-left text-gray-700 text-sm">.fusion.id</p>
      </div>

      <div
        className="rounded-full z-10 -mr-3"
        style={{
          width: 60,
          height: 60,
          backgroundColor: isLightColor(color) ? "black" : "white",
          maskImage: "url(/logoBlack.svg)",
          maskSize: "cover",
        }}
      ></div>
    </div>
  );
}
