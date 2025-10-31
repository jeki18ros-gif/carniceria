import React, { useEffect, useState } from "react";
import { ArrowLeftIcon } from "@heroicons/react/24/solid";
import { SunIcon, MoonIcon } from "@heroicons/react/24/outline";
import logo from "../assets/Logo-BENITO.jpg";
import clsx from "clsx";
import { useTheme } from "../Theme/ThemeContext";

export function OrdenCompraHeader() {
  const { theme, setTheme, fontSize, setFontSize } = useTheme();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const toggleTheme = () => setTheme((prev) => (prev === "light" ? "dark" : "light"));

  const scrolledHeaderClass = scrolled
    ? "relative bg-white/60 dark:bg-gray-900/50 backdrop-blur-xl border border-white/20 dark:border-gray-700/40 shadow-lg"
    : "relative bg-gradient-to-b from-black/20 to-black/0 dark:from-gray-800/30 dark:to-gray-900/10 backdrop-blur-xl border border-white/10 dark:border-gray-700/20";

  const titleTextColor = scrolled ? "text-gray-900 dark:text-gray-100" : "text-white";

  return (
    <header className="fixed inset-x-0 top-0 z-50">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className={clsx("mt-3 mb-2 rounded-2xl overflow-hidden transition-all duration-300", scrolledHeaderClass)}>
          <nav className="relative grid grid-cols-3 items-center h-16 sm:h-20 px-4 sm:px-6">
            <div className="flex items-center">
              <img src={logo} alt="Benito Logo" className="h-16 w-16 sm:h-20 sm:w-20 rounded-full object-cover ring-2 ring-white/80 dark:ring-yellow-500/60 shadow-md hover:scale-105 transition-transform" />
            </div>

            <h1 className={`text-center text-xl sm:text-2xl font-extrabold ${titleTextColor}`}>ORDEN DE COMPRA</h1>

            <div className="flex items-center justify-end gap-3">
              <div className="hidden md:flex items-center gap-2 border-l border-white/30 dark:border-white/20 pl-4">
                <DarkModeToggle theme={theme} toggleTheme={toggleTheme} scrolled={scrolled} />
                <FontSizeSelector fontSize={fontSize} setFontSize={setFontSize} scrolled={scrolled} />
              </div>

              <button onClick={() => window.history.back()} className="flex items-center gap-2 px-3 py-2 rounded-xl bg-yellow-500 hover:bg-yellow-600 text-gray-900 shadow-md">
                <ArrowLeftIcon className="w-5 h-5" />
                <span className="hidden sm:inline">Volver</span>
              </button>
            </div>
          </nav>
        </div>
      </div>
    </header>
  );
}

function DarkModeToggle({ theme, toggleTheme, scrolled }) {
  const Icon = theme === "dark" ? SunIcon : MoonIcon;
  const iconColor = scrolled ? "text-gray-900 dark:text-gray-100" : "text-white";
  return (
    <button onClick={toggleTheme} className={clsx("p-2.5 hover:scale-110 transition", iconColor)}>
      <Icon className="h-6 w-6" />
    </button>
  );
}

function FontSizeSelector({ fontSize, setFontSize, scrolled }) {
  const base = scrolled ? "text-gray-600 dark:text-gray-300" : "text-white/90";
  const active = "text-yellow-500";
  const sizes = [
    { label: "A-", value: "small" },
    { label: "A", value: "normal" },
    { label: "A+", value: "large" },
  ];
  return (
    <div className="flex rounded-xl p-1.5">
      {sizes.map(({ label, value }) => (
        <button
          key={value}
          onClick={() => setFontSize(value)}
          className={`px-2 py-1 text-base font-bold uppercase ${fontSize === value ? active : base}`}
        >
          {label}
        </button>
      ))}
    </div>
  );
}
