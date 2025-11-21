import React from "react";
import { motion, AnimatePresence } from "framer-motion";

import { useHeaderState } from "./useHeaderState";

import Logo from "./Logo";
import DesktopNav from "./DesktopNav";
import MobileNav from "./MobileNav";
import MobileFontMenu from "./MobileFontMenu";

import DarkModeToggle from "./DarkModeToggle";
import FontSizeSelector from "./FontSizeSelector";
import LanguageSelector from "./LanguageSwitcher";

export default function Header() {
  const {
    theme,
    fontSize,
    scrolled,
    menuOpen,
    fontMenuOpen,
    toggleTheme,
    setFontSize,
    setMenuOpen,
    setFontMenuOpen,
  } = useHeaderState();

  const floatingContainerClasses = `
    mt-3 mb-2 rounded-2xl border backdrop-blur-md transition-colors duration-300
    ${
      scrolled
        ? "bg-white/95 dark:bg-[#222222]/90 border-black/10 dark:border-white/10 shadow-lg"
        : "bg-black/25 dark:bg-white/10 border-white/20"
    }
  `;

  return (
    <motion.header
      className="fixed inset-x-0 top-0 z-50 w-full"
      initial={{ y: "-100%", opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
    >
      <div className="mx-auto max-w-7xl px-3 sm:px-6 relative">

        <div className={floatingContainerClasses}>
          <nav className="flex items-center justify-between h-18 sm:h-24">

            <Logo />

            <DesktopNav />

            <div className="hidden sm:flex items-center gap-4">
              <DarkModeToggle theme={theme} toggleTheme={toggleTheme} />
              <LanguageSelector />
              <FontSizeSelector fontSize={fontSize} setFontSize={setFontSize} />
            </div>

            <MobileNav
              theme={theme}
              toggleTheme={toggleTheme}
              menuOpen={menuOpen}
              setMenuOpen={setMenuOpen}
              fontMenuOpen={fontMenuOpen}
              setFontMenuOpen={setFontMenuOpen}
            />
          </nav>
        </div>

        <AnimatePresence>
          {fontMenuOpen && (
            <MobileFontMenu fontSize={fontSize} setFontSize={setFontSize} />
          )}
        </AnimatePresence>
      </div>
    </motion.header>
  );
}
