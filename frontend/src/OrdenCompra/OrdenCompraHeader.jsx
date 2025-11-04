import React, { useEffect, useState } from "react";
import { ArrowLeftIcon, MagnifyingGlassIcon } from "@heroicons/react/24/solid";
import { SunIcon, MoonIcon } from "@heroicons/react/24/outline";
import logo from "../assets/Logo-BENITO.jpg";
import clsx from "clsx";
import { useTheme } from "../Theme/ThemeContext";
import "../styles/OrdenCompraHeader.css";

export function OrdenCompraHeader() {
  const { theme, setTheme, fontSize, setFontSize } = useTheme();
  const [scrolled, setScrolled] = useState(false);
  const [showFontOptions, setShowFontOptions] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 640);

  // 🔍 Detecta scroll + tamaño de pantalla
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    const onResize = () => setIsMobile(window.innerWidth <= 640);

    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onResize);

    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onResize);
    };
  }, []);

  const toggleTheme = () => setTheme((prev) => (prev === "light" ? "dark" : "light"));

  const scrolledHeaderClass = clsx(
    "transition-all duration-500 rounded-3xl shadow-lg",
    scrolled
      ? "bg-white/80 dark:bg-gray-900/80 backdrop-blur-2xl border border-gray-300/20 dark:border-gray-800/20"
      : "bg-white/50 dark:bg-gray-800/60 backdrop-blur-2xl border border-gray-200/10 dark:border-gray-700/20"
  );

  const titleTextColor = scrolled
    ? "text-gray-900 dark:text-gray-100"
    : "text-white dark:text-gray-100";

  return (
    <>
      {/* 🌟 HEADER PRINCIPAL */}
      <header className="fixed inset-x-0 top-2 z-50 flex justify-center">
        <div className="max-w-6xl w-[92%] sm:w-[90%] md:w-[80%]">
          <div className={clsx("overflow-hidden", scrolledHeaderClass)}>
            <nav className="orden-nav">
  {/* (1) LOGO */}
  <div className="header-logo flex items-center justify-start">
    <img
      src={logo}
      alt="Benito Logo"
      className="h-14 w-14 sm:h-16 sm:w-16 rounded-full object-cover ring-2 ring-white/70 dark:ring-gray-700 shadow-md hover:scale-105 transition-transform"
    />
  </div>

  {/* (2) TÍTULO */}
  <h1
    className={`header-title text-center font-extrabold ${titleTextColor} 
      text-lg sm:text-2xl break-words leading-tight`}
  >
    ORDEN DE COMPRA
  </h1>

  {/* (3) BOTONES AGRUPADOS */}
  <div className="header-actions">
    {/* Tema */}
    <button
      onClick={toggleTheme}
      className="header-button"
      aria-label="Cambiar tema"
    >
      {theme === "dark" ? (
        <SunIcon className="h-5 w-5" />
      ) : (
        <MoonIcon className="h-5 w-5" />
      )}
    </button>

    {/* Fuente o lupa */}
    {!isMobile && (
      <FontSizeSelector fontSize={fontSize} setFontSize={setFontSize} />
    )}
    {isMobile && (
      <button
        onClick={() => setShowFontOptions(!showFontOptions)}
        className="header-button search-btn"
        aria-label="Opciones de fuente"
      >
        <MagnifyingGlassIcon className="h-5 w-5" />
      </button>
    )}

    {/* Volver */}
    <button
      onClick={() => window.history.back()}
      className="header-button back-btn flex items-center gap-2"
    >
      <ArrowLeftIcon className="h-5 w-5" />
      <span className="hidden sm:inline">Volver</span>
    </button>
  </div>
</nav>
          </div>
        </div>
      </header>

      {/*Menú de fuentes flotante fuera del header */}
      {showFontOptions && isMobile && (
        <div
          className="fixed top-[5.5rem] right-4 bg-white/95 dark:bg-gray-900/95 p-4 rounded-2xl 
                     border border-gray-300/30 dark:border-gray-700/40 shadow-xl z-[60]"
        >
          <FontSizeSelector fontSize={fontSize} setFontSize={setFontSize} />
        </div>
      )}
    </>
  );
}

// 🔠 Selector de tamaño de fuente
function FontSizeSelector({ fontSize, setFontSize }) {
  const sizes = [
    { label: "A-", value: "small" },
    { label: "A", value: "normal" },
    { label: "A+", value: "large" },
  ];

  return (
    <div className="flex gap-1">
      {sizes.map(({ label, value }) => (
        <button
          key={value}
          onClick={() => setFontSize(value)}
          className="header-button text-xs px-2 py-1"
          style={{
            background: fontSize === value ? "var(--gold-color)" : "transparent",
            color: fontSize === value ? "var(--dark-bg)" : "var(--gold-color)",
          }}
        >
          {label}
        </button>
      ))}
    </div>
  );
}
