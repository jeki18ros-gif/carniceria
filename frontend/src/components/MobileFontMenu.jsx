import React from "react";
import { motion } from "framer-motion";
import FontSizeSelector from "./FontSizeSelector";

export default function MobileFontMenu({ fontSize, setFontSize }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      className="absolute top-full right-4 bg-black/80 text-white 
      rounded-xl p-3 backdrop-blur-md border border-white/20 
      flex gap-3 z-50"
    >
      <FontSizeSelector fontSize={fontSize} setFontSize={setFontSize} />
    </motion.div>
  );
}
