import React from "react";

const MaskTokenGray = ({ chain }) => {
  return (
    <div
      className="w-8 h-8 rotate-12"
      style={{
        backgroundColor: "gray",
        maskImage: `url(${chain})`,
        maskSize: "contain",
        maskRepeat: "no-repeat",
        maskPosition: "center",
      }}
    />
  );
};

export default MaskTokenGray;
