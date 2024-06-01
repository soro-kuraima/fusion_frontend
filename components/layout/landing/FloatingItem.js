import Image from "next/image";

export default function FloatingItem({ item }) {
  const isText = item.type === "text";

  return isText ? (
    <div
      className="absolute text-black font-semibold opacity-60 text-4xl"
      style={{
        top: item.top,
        right: item.right,
        left: item.left,
        bottom: item.bottom,
      }}
    >
      {item.text}
    </div>
  ) : (
    <Image
      src={item.image}
      width={item.width}
      height={item.height}
      className="absolute opacity-60"
      style={{
        top: item.top,
        right: item.right,
        left: item.left,
        bottom: item.bottom,
      }}
    />
  );
}
