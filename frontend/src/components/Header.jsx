import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import logo from "../assets/Logo-BENITO.jpg";
// Importamos LanguageSelector sin renombrar (LanguageSwitcher no está en el código)
import LanguageSelector from "../components/LanguageSwitcher"; 
import { useTranslation } from "react-i18next";
import { Globe2 } from "lucide-react"; // Importamos Globe2 para el botón móvil de idioma

import {
  SunIcon,
  MoonIcon,
  Bars3Icon,
  MagnifyingGlassIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";
import { useTheme } from "../Theme/ThemeContext";


export default function Header() {
  const { t } = useTranslation();
  const { theme, setTheme} = useTheme();
  const [fontSize, setFontSize] = useState("normal");
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [fontMenuOpen, setFontMenuOpen] = useState(false);
  
  // --- NUEVO ESTADO para el menú de idioma en móvil ---
  const [langMenuOpen, setLangMenuOpen] = useState(false); 

  // --- Preferencias guardadas ---
  useEffect(() => {
    const savedTheme = localStorage.getItem("theme");
    const savedFont = localStorage.getItem("fontSize");
    if (savedTheme) setTheme(savedTheme);
    if (savedFont) setFontSize(savedFont);
  }, []);

  // --- Aplicar tema ---
  useEffect(() => {
    document.documentElement.classList.toggle("dark", theme === "dark");
    localStorage.setItem("theme", theme);
  }, [theme]);

  // --- Aplicar tamaño de fuente ---
  useEffect(() => {
    document.documentElement.classList.remove("text-sm", "text-lg");
    if (fontSize === "small") document.documentElement.classList.add("text-sm");
    if (fontSize === "large") document.documentElement.classList.add("text-lg");
    localStorage.setItem("fontSize", fontSize);
  }, [fontSize]);

  // --- Detectar scroll ---
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const toggleTheme = () =>
    setTheme((prev) => (prev === "light" ? "dark" : "light"));

  // Función para cerrar todos los menús flotantes
  const closeAllMenus = () => {
    setMenuOpen(false);
    setFontMenuOpen(false);
    setLangMenuOpen(false);
  };
    
  const linkBase = `
    transition-all duration-200 ease-out 
    hover:scale-110 hover:text-[var(--color-accent-light)] 
    dark:hover:text-[var(--color-accent-dark)] font-semibold
  `;

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
      className="fixed inset-x-0 top-0 z-50 w-full transition-colors duration-700"
      initial={{ y: "-100%", opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
    >
      <div className="mx-auto w-full max-w-7xl px-3 sm:px-6 lg:px-8 relative">
        <div className={floatingContainerClasses}>
          <nav className="relative flex items-center justify-between h-20 sm:h-24 px-3 sm:px-6 items-center">
            {/* --- LOGO --- */}
            <div className="flex items-center justify-start">
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

            {/* --- LINKS GRANDES --- */}
            <ul className="hidden sm:flex justify-center gap-8 text-base text-white dark:text-white flex-wrap">
              <li><a href="#productos" className={linkBase}>{t("header.nav.productos")}</a></li>
              <li><a href="#nosotros" className={linkBase}>{t("header.nav.nosotros")}</a></li>
              <li><a href="#resenas" className={linkBase}>{t("header.nav.resenas")}</a></li>
              <li><a href="#contacto" className={linkBase}>{t("header.nav.contacto")}</a></li>
            </ul>

            {/* --- CONTROLES DERECHA (ESCRITORIO) --- */}
            <div className="hidden sm:flex items-center gap-4 flex-shrink-0">
              <DarkModeToggle theme={theme} toggleTheme={toggleTheme} />
              <div className="border-l border-white/30 dark:border-white/20 h-6"></div>
              {/* Selector de idioma para ESCRITORIO */}
              <LanguageSelector /> 
              <FontSizeSelector fontSize={fontSize} setFontSize={setFontSize} />
            </div>

            {/* --- CONTROLES MÓVIL --- */}
            {/* Se quita 'overflow-hidden' para que los menús desplegables no se corten */}
            <div className="flex sm:hidden items-center gap-3 text-white"> 
              
              {/* Fuente */}
              <button
                onClick={() => {
                  setFontMenuOpen((prev) => !prev);
                  setMenuOpen(false);
                  setLangMenuOpen(false); // Aseguramos que el menú de idioma esté cerrado
                }}
                className="theme-toggle bg-transparent overflow-hidden"
                aria-label={t("header.aria.font_size")}
              >
                <MagnifyingGlassIcon className="h-6 w-6" />
              </button>
              
              {/* Tema */}
              <DarkModeToggle theme={theme} toggleTheme={toggleTheme} />
              
              {/* Idioma - Ahora es un botón simple que controla 'langMenuOpen' */}
              <button
                onClick={() => {
                  setLangMenuOpen((prev) => !prev);
                  setMenuOpen(false);
                  setFontMenuOpen(false);
                }}
                className="theme-toggle bg-transparent overflow-hidden"
                aria-label={t("header.aria.select_language")}
              >
                 <Globe2 className="h-6 w-6" /> {/* Icono de mundo */}
              </button>

              {/* Menú */}
              <button
                onClick={() => {
                  setMenuOpen((prev) => !prev);
                  setFontMenuOpen(false);
                  setLangMenuOpen(false); // Aseguramos que el menú de idioma esté cerrado
                }}
                className="theme-toggle bg-transparent overflow-hidden"
                aria-label={t("header.aria.open_menu")}
              >
                {menuOpen ? (
                  <XMarkIcon className="h-6 w-6" />
                ) : (
                  <Bars3Icon className="h-6 w-6" />
                )}
              </button>
            </div>
          </nav>
        </div>

        {/* --- MENÚ DE FUENTE MÓVIL --- */}
        <AnimatePresence>
          {fontMenuOpen && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="absolute top-full right-4 bg-black/80 text-white rounded-xl p-3 backdrop-blur-md border border-white/20 flex gap-3 z-50"
            >
              <FontSizeSelector fontSize={fontSize} setFontSize={setFontSize} />
            </motion.div>
          )}
        </AnimatePresence>

        {/* --- NUEVO: MENÚ DE IDIOMA MÓVIL (Fuera del Header, para evitar recortes) --- */}
        <AnimatePresence>
          {langMenuOpen && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              // Posicionamiento para que aparezca debajo del botón de idioma
              className="absolute top-full right-4 mt-1 bg-white rounded-xl shadow-xl border border-gray-100 z-50"
            >
              {/* Usamos el LanguageSelector adaptado con la prop 'isMobileMenu' */}
              <LanguageSelector isMobileMenu={true} closeMenu={closeAllMenus} /> 
            </motion.div>
          )}
        </AnimatePresence>

        {/* --- MENÚ PRINCIPAL MÓVIL --- */}
        <AnimatePresence>
          {menuOpen && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="absolute top-full left-0 w-full bg-black/80 text-white backdrop-blur-md border-t border-white/20 shadow-xl z-50"
            >
              <ul className="flex flex-col items-center gap-4 py-4 text-lg">
                <li><a href="#productos" onClick={closeAllMenus}>{t("header.nav.productos")}</a></li>
                <li><a href="#nosotros" onClick={closeAllMenus}>{t("header.nav.nosotros")}</a></li>
                <li><a href="#resenas" onClick={closeAllMenus}>{t("header.nav.resenas")}</a></li>
                <li><a href="#contacto" onClick={closeAllMenus}>{t("header.nav.contacto")}</a></li>
              </ul>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.header>
  );
}

/* --- BOTÓN MODO OSCURO --- */
function DarkModeToggle({ theme, toggleTheme }) {
  const { t } = useTranslation();
  const Icon = theme === "dark" ? SunIcon : MoonIcon;
  return (
    <button
      onClick={toggleTheme}
      className="theme-toggle bg-transparent overflow-hidden"
      aria-label={t("header.aria.toggle_theme")}
    >
      <Icon className="h-6 w-6" />
    </button>
  );
}

/* --- SELECTOR DE TAMAÑO DE FUENTE --- */
function FontSizeSelector({ fontSize, setFontSize }) {
  const sizes = [
    { label: "A-", value: "small" },
    { label: "A", value: "normal" },
    { label: "A+", value: "large" },
  ];

  return (
    <div className="font-size-container flex gap-2"> {/* Agregamos flex y gap para mejor espaciado */}
      {sizes.map(({ label, value }) => (
        <button
          key={value}
          onClick={() => setFontSize(value)}
          className={`font-size-btn px-3 py-1 rounded-lg transition-colors text-sm ${
            fontSize === value 
              ? "bg-white/90 text-gray-800 font-bold" 
              : "bg-transparent text-white/70 hover:text-white"
          }`}
        >
          {label}
        </button>
      ))}
    </div>
  );
}