// src/context/ThemeContext.jsx
import React, { createContext, useState, useEffect, useContext } from "react";

const ThemeContext = createContext();

export function ThemeProvider({ children }) {
  const [theme, setTheme] = useState("light");
  const [fontSize, setFontSize] = useState("normal");

  // --- Cargar preferencias ---
  useEffect(() => {
    const savedTheme = localStorage.getItem("theme");
    const savedFont = localStorage.getItem("fontSize");
    if (savedTheme === "dark" || savedTheme === "light") setTheme(savedTheme);
    if (["small", "normal", "large"].includes(savedFont)) setFontSize(savedFont);
  }, []);

  // --- Aplicar tema global ---
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

  return (
    <ThemeContext.Provider value={{ theme, setTheme, fontSize, setFontSize }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  return useContext(ThemeContext);
}
