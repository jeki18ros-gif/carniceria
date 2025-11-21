import React from "react";

export default function FontSizeSelector({ fontSize, setFontSize }) {
  const sizes = [
    { label: "A-", value: "small" },
    { label: "A", value: "normal" },
    { label: "A+", value: "large" },
  ];

  return (
    <div className="flex gap-1.5 sm:gap-2">
      {sizes.map(({ label, value }) => (
        <button
          key={value}
          onClick={() => setFontSize(value)}
          className={`
            border rounded-md
            text-xs sm:text-sm             /* tamaño de texto responsive */
            px-1.5 py-0.5 sm:px-2 sm:py-1   /* padding responsive */
            transition-all duration-200
            ${
              fontSize === value
                ? "bg-white text-black font-bold"
                : "text-white dark:text-white bg-transparent"
            }
          `}
        >
          {label}
        </button>
      ))}
    </div>
  );
}
