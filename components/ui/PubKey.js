import { formatAddress } from "@/utils/FormatAddress";
import CopyButton from "./CopyButton";
import Image from "next/image";

const PubKey = ({ pubkey, logo }) => {
  return (
    <div className="flex gap-2 py-1 px-4 rounded-full w-fit text-sm mx-auto text-black font-outfit">
      <Image src={logo} alt="ChainLogo" width={20} height={20} className="" />

      <p className="font-outfit">{pubkey ? formatAddress(pubkey) : "-"}</p>

      <CopyButton text={pubkey} />
    </div>
  );
};

export default PubKey;
