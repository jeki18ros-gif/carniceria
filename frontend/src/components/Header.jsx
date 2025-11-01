<<<<<<< HEAD
import React, { useEffect, useState } from "react";
import { SunIcon, MoonIcon } from "@heroicons/react/24/outline";
import { useTheme } from "../Theme/ThemeContext";
import logo from "../assets/Logo-BENITO.jpg";
=======
import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import logo from '../assets/Logo-BENITO.jpg'
import { SunIcon, MoonIcon } from '@heroicons/react/24/outline'
>>>>>>> 01237090e53e7608a34e2923bb70ee44b90235e4

export default function Header() {
  const { theme, setTheme, fontSize, setFontSize } = useTheme();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    onScroll();
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const toggleTheme = () =>
    setTheme((prev) => (prev === "light" ? "dark" : "light"));

  const linkBase = `transition-colors transition-transform duration-200 ease-out hover:scale-110 hover:text-yellow-400 ${
    scrolled ? "text-gray-900 dark:text-gray-100" : "text-white"
  }`;

  return (
    <motion.header
      className="fixed inset-x-0 top-0 z-50 transition-colors duration-700"
      initial={{ y: '-100%', opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div
          className={`mt-3 mb-2 rounded-2xl border backdrop-blur-md transition-colors duration-300 ${
            scrolled
              ? "bg-white/95 dark:bg-[#222222]/90 border-black/10 dark:border-white/10 shadow-lg"
              : "bg-black/25 dark:bg-white/10 border-white/20"
          }`}
        >
          <nav className="relative grid grid-cols-3 items-center h-16 sm:h-20 px-4 sm:px-6">
            {/* Logo */}
            <div className="flex items-center">
              <div className="h-16 w-16 sm:h-20 sm:w-20 overflow-hidden rounded-full ring-2 ring-white/90 dark:ring-yellow-500/60 shadow-lg">
                <img src={logo} alt="Benito Logo" className="h-full w-full object-cover" />
              </div>
            </div>

            {/* Enlaces */}
            <ul className="hidden sm:flex justify-center gap-8 text-base font-semibold">
              <li><a href="#productos" className={linkBase}>PRODUCTOS</a></li>
              <li><a href="#nosotros" className={linkBase}>NOSOTROS</a></li>
              <li><a href="#resenas" className={linkBase}>RESEÑAS</a></li>
              <li><a href="#contacto" className={linkBase}>CONTACTO</a></li>
            </ul>

            {/* Controles */}
            <div className="flex items-center justify-end gap-4">
              <div className="flex items-center gap-2 border-l border-white/30 dark:border-white/20 pl-4">
                <DarkModeToggle theme={theme} toggleTheme={toggleTheme} />
                <FontSizeSelector fontSize={fontSize} setFontSize={setFontSize} />
              </div>
              <button className="sm:hidden inline-flex items-center rounded-xl px-3 py-2 text-sm shadow-sm accent-block">
                Menú
              </button>
            </div>
          </nav>
        </div>
      </div>
<<<<<<< HEAD
    </header>
  );
=======
    </div>
    </motion.header>
  )
>>>>>>> 01237090e53e7608a34e2923bb70ee44b90235e4
}

function DarkModeToggle({ theme, toggleTheme }) {
  const Icon = theme === "dark" ? SunIcon : MoonIcon;
  return (
    <button
      onClick={toggleTheme}
      className="p-2.5 md:p-3 text-white transition-transform duration-200 ease-out hover:scale-110"
    >
      <Icon className="h-6 w-6" />
    </button>
  );
}

function FontSizeSelector({ fontSize, setFontSize }) {
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
          className={`px-3 py-2 text-base font-bold uppercase rounded-lg ${
            fontSize === value
              ? "text-yellow-400"
              : "text-white/90 hover:text-yellow-400"
          }`}
        >
          {label}
        </button>
      ))}
    </div>
  );
}
