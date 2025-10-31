import React from "react";
import { SunIcon, MoonIcon } from "@heroicons/react/24/outline";
import { useTheme } from "./ThemeContext";

export default function ThemeToggle() {
  const { theme, setTheme } = useTheme();

  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark");
  };

  return (
    <button
      onClick={toggleTheme}
      className="theme-toggle fixed bottom-6 right-6 shadow-lg border border-transparent hover:scale-105 transition-all"
      title={`Cambiar a modo ${theme === "dark" ? "claro" : "oscuro"}`}
    >
      {theme === "dark" ? (
        <SunIcon className="h-6 w-6 text-[var(--color-dorado)]" />
      ) : (
        <MoonIcon className="h-6 w-6 text-[var(--color-dorado)]" />
      )}
    </button>
  );
}
