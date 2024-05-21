import { QRCodeSVG } from "qrcode.react";

const QRCodeGenerator = ({
  value,
  size = 175,
  level = "H",
  bgColor = "transparent",
  fgColor = "url(#gradient)",
}) => {
  return (
    <svg width={size} height={size}>
      <defs>
        <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style={{ stopColor: "#000", stopOpacity: 1 }} />
          <stop offset="100%" style={{ stopColor: "#000", stopOpacity: 1 }} />
        </linearGradient>
      </defs>

      <QRCodeSVG
        value={value}
        level={level}
        size={size}
        bgColor={bgColor}
        fgColor={fgColor}
        imageSettings={{
          src: "logoBlack.svg",
          height: 38,
          width: 38,
          excavate: true,
        }}
      />
    </svg>
  );
};

export default QRCodeGenerator;
