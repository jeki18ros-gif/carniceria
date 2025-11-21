import React from "react";
import { SunIcon, MoonIcon } from "@heroicons/react/24/outline";
import { useTranslation } from "react-i18next";

export default function DarkModeToggle({ theme, toggleTheme }) {
  const { t } = useTranslation();
  const Icon = theme === "dark" ? SunIcon : MoonIcon;

  return (
    <button
      onClick={toggleTheme}
      aria-label={t("header.aria.toggle_theme")}
      className="
        p-1 sm:p-2
        hover:scale-110
        transition-transform
        rounded-full
      "
    >
      <Icon
        className="
          w-4 h-4 sm:w-5 sm:h-5
        "
      />
    </button>
  );
}
