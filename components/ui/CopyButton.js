"use client";

import { Copy, Check } from "lucide-react";

import { toast } from "sonner";
import { useState } from "react";

const CopyButton = ({ text }) => {
  const [isCopied, setIsCopied] = useState(false);

  const handleClick = async (event) => {
    event.stopPropagation();

    if (!navigator.clipboard) {
      console.error("Clipboard API not available");
      return;
    }

    if (text === "") return;

    try {
      await navigator.clipboard.writeText(text);
      setIsCopied(true);
      toast.info("Copied to clipboard");

      setTimeout(() => {
        setIsCopied(false);
      }, 1000);
    } catch (err) {
      console.error("Failed to copy text: ", err);
    }
  };

  return (
    <button onClick={handleClick}>
      {isCopied ? <Check size={16} /> : <Copy size={13} />}
    </button>
  );
};

export default CopyButton;
