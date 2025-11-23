import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { setLanguage } from "../i18n"; // Asegúrate de que esta importación sea correcta si usas 'i18n, { setLanguage }'
import { Globe2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const languages = [
  { code: "es", name: "Español", flag: "🇪🇸" },
  { code: "en", name: "English", flag: "🇬🇧" },
  { code: "fr", name: "Français", flag: "🇫🇷" },
];

// Añadimos las props 'isMobileMenu' y 'closeMenu' para adaptar el comportamiento en móvil
export default function LanguageSelector({ isMobileMenu = false, closeMenu = () => {} }) {
  const { i18n } = useTranslation();
  const [open, setOpen] = useState(false);

  const changeLanguage = async (lng) => {
    // La función setLanguage debería estar definida en "../i18n"
    await setLanguage(lng);
    setOpen(false);
    if (isMobileMenu) {
      // Si estamos en el menú móvil flotante, llamamos a la función de cierre del Header
      closeMenu();
    }
  };

  const current = languages.find((l) => l.code === i18n.language) || languages[0];

  // --- MODO: Usado dentro del Menú Móvil Flotante ---
  if (isMobileMenu) {
    return (
      <ul className="flex flex-col gap-2 p-2"> {/* Estilos para la lista simple en el menú flotante */}
        {languages.map((lang) => (
          <li
            key={lang.code}
            onClick={() => changeLanguage(lang.code)}
            // APLICAMOS CLASES DARK A LAS OPCIONES DEL MENÚ MÓVIL
            className={`
              flex items-center gap-2 px-3 py-2 cursor-pointer rounded-lg transition-colors
              text-gray-800 hover:bg-gray-200
              dark:text-white dark:hover:bg-gray-700 
              ${
                i18n.language === lang.code 
                  ? "font-bold bg-gray-100 dark:bg-gray-800" // Opción seleccionada
                  : "font-normal"
              }
            `}
          >
            <span>{lang.flag}</span>
            <span>{lang.name}</span>
          </li>
        ))}
      </ul>
    );
  }

  // --- MODO: Por Defecto (Escritorio) ---
  return (
    <div className="relative">
      <button
        onClick={() => setOpen(!open)}
        // Ocultamos la bandera/texto en pantallas pequeñas (por debajo de 'sm')
         className="font-size-btn px-3 py-1 rounded-lg transition-colors text-sm"
      >
        <Globe2 className="w-4 h-4 sm:w-5 sm:h-5 text-white-700 " />
        <span className="text-sm hidden sm:inline">{current.flag}</span> 
      </button>

      <AnimatePresence>
        {open && (
          <motion.ul
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            // ESTILO PRINCIPAL DEL CONTENEDOR (ESCRITORIO)
            // CLARO: Fondo blanco, sombra estándar
            // OSCURO: Fondo muy oscuro, sombra oscura, borde más claro
            className="
              absolute right-0 mt-2 w-36 rounded-lg shadow-lg overflow-hidden z-50
              bg-white text-gray-800 dark:bg-gray-800 dark:text-white dark:shadow-2xl dark:border dark:border-gray-700
            "
          >
            {languages.map((lang) => (
              <li
                key={lang.code}
                onClick={() => changeLanguage(lang.code)}
                // APLICAMOS CLASES DARK A LAS OPCIONES DEL MENÚ ESCRITORIO
                className={`
                  flex items-center gap-2 px-4 py-2 cursor-pointer transition-colors
                  hover:bg-gray-100 dark:hover:bg-gray-700
                  ${
                    i18n.language === lang.code 
                      ? "font-semibold bg-gray-50 dark:bg-gray-700" // Opción seleccionada
                      : ""
                  }
                `}
              >
                <span>{lang.flag}</span>
                <span>{lang.name}</span>
              </li>
            ))}
          </motion.ul>
        )}
      </AnimatePresence>
    </div>
  );
}