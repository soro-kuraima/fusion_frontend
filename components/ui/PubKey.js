import CopyButton from "./CopyButton";

const PubKey = ({ pubkey }) => {
  return (
    <div className="flex gap-2 bg-black py-1 px-4 rounded-full w-fit mx-auto text-gray-50">
      <p>{pubkey}</p>

      <CopyButton text={pubkey} />
    </div>
  );
};

export default PubKey;
