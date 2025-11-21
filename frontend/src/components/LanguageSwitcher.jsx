import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import i18n, { setLanguage } from "../i18n";
import { Globe2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const languages = [
  { code: "es", name: "Español", flag: "🇪🇸" },
  { code: "en", name: "English", flag: "🇬🇧" },
  { code: "fr", name: "Français", flag: "🇫🇷" },
];

export default function LanguageSelector() {
  const { i18n } = useTranslation();
  const [open, setOpen] = useState(false);

  const changeLanguage = async (lng) => {
    await setLanguage(lng);
    setOpen(false);
  };

  const current = languages.find((l) => l.code === i18n.language) || languages[0];

  return (
    <div className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-1 bg-white/80 px-2 py-1 sm:px-3 sm:py-2 rounded-xl shadow-md hover:shadow-lg transition"
      >
        <Globe2 className="w-4 h-4 sm:w-5 sm:h-5 text-gray-700 " />
        <span className="text-sm">{current.flag}</span>
      </button>

      <AnimatePresence>
        {open && (
          <motion.ul
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="absolute right-0 mt-2 w-36 bg-white rounded-lg shadow-lg overflow-hidden z-50"
          >
            {languages.map((lang) => (
              <li
                key={lang.code}
                onClick={() => changeLanguage(lang.code)}
                className={`flex items-center gap-2 px-4 py-2 cursor-pointer hover:bg-gray-100 ${
                  i18n.language === lang.code ? "font-semibold" : ""
                }`}
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
