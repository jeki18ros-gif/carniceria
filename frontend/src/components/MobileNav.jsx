import React from "react";
import { Bars3Icon, MagnifyingGlassIcon, XMarkIcon } from "@heroicons/react/24/outline";
import DarkModeToggle from "./DarkModeToggle";
import LanguageSelector from "./LanguageSwitcher";

export default function MobileNav({
  theme,
  toggleTheme,
  menuOpen,
  setMenuOpen,
  fontMenuOpen,
  setFontMenuOpen,
}) {
  return (
    <div className="flex sm:hidden items-center gap-3 text-white">

      {/* Fuente */}
      <button
        onClick={() => {
          setFontMenuOpen(!fontMenuOpen);
          setMenuOpen(false);
        }}
        className="p-1 rounded-lg hover:scale-110 transition-transform"
      >
        <MagnifyingGlassIcon className="h-6 w-6" />
      </button>

      {/* Tema */}
      <DarkModeToggle theme={theme} toggleTheme={toggleTheme} />

      {/* Idioma */}
      <LanguageSelector />

      {/* Menú */}
      <button
        onClick={() => {
          setMenuOpen(!menuOpen);
          setFontMenuOpen(false);
        }}
        className="p-1 rounded-lg hover:scale-110 transition-transform"
      >
        {menuOpen ? (
          <XMarkIcon className="h-4 w-4" />
        ) : (
          <Bars3Icon className="h-4 w-4" />
        )}
      </button>
    </div>
  );
}
