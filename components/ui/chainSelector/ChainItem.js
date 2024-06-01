import useWallet from "@/hooks/useWallet";
import Image from "next/image";

export default function ChainItem({ chainId, logo, name, isActive }) {
  const { switchChain } = useWallet();

  return (
    <div
      className="bg-white h-7 rounded-xl p-2 py-4 flex items-center justify-center shadow-md hover:cursor-pointer transition-all duration-200"
      onClick={() => {
        if (!isActive) switchChain(chainId);
      }}
      style={{
        width: isActive ? "120px" : "40px",
        gap: isActive ? "0.5rem" : "0",
      }}
    >
      <Image src={logo} alt="Ethereum" width={20} height={20} />
      <span
        className="text-black transition-all duration-200"
        style={{
          fontSize: isActive ? "1rem" : "0",
        }}
      >
        {name}
      </span>
    </div>
  );
}
