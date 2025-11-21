import React from "react";
import logo from "../assets/Logo-BENITO.jpg";
import { useTranslation } from "react-i18next";

export default function Logo() {
  const { t } = useTranslation();

  return (
    <div className="flex items-center">
      <div
        className="h-[3.8rem] w-[3.8rem] sm:h-18 sm:w-18 
        rounded-[1.6rem] sm:rounded-[1.8rem]
        overflow-hidden ring-2 ring-white/70 dark:ring-gray-700 
        shadow-md hover:scale-105 transition-transform 
        flex items-center justify-center bg-black/80"
      >
        <img
          src={logo}
          alt={t("header.logo_alt")}
          className="h-full w-full object-cover scale-[1.5]"
          loading="lazy"
        />
      </div>
    </div>
  );
}
