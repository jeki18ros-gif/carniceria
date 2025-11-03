import React, { createContext, useState, useEffect, useContext } from "react";

const ThemeContext = createContext();

export function ThemeProvider({ children }) {
  const [theme, setTheme] = useState(null); // 👈 null hasta detectar el tema
  const [fontSize, setFontSize] = useState("normal");

  // ✅ Detectar tema inicial ANTES de renderizar la UI
  useEffect(() => {
    const savedTheme = localStorage.getItem("theme");
    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    const activeTheme = savedTheme || (prefersDark ? "dark" : "light");

    // Aplicar la clase "dark" inmediatamente
    document.documentElement.classList.toggle("dark", activeTheme === "dark");
    setTheme(activeTheme);
  }, []);

  // ✅ Aplicar cambios cuando el tema cambie manualmente
  useEffect(() => {
    if (theme) {
      document.documentElement.classList.toggle("dark", theme === "dark");
      localStorage.setItem("theme", theme);
    }
  }, [theme]);

  // ✅ Controlar tamaño de fuente global
  useEffect(() => {
    document.documentElement.classList.remove("text-sm", "text-lg");
    if (fontSize === "small") document.documentElement.classList.add("text-sm");
    if (fontSize === "large") document.documentElement.classList.add("text-lg");
    localStorage.setItem("fontSize", fontSize);
  }, [fontSize]);

  // ✅ Alternar tema fácilmente
  const toggleTheme = () => setTheme((prev) => (prev === "light" ? "dark" : "light"));

  // 🚫 Bloquear render hasta tener el tema
  if (theme === null) {
    return (
      <div className="min-h-screen bg-[#fffaf3] dark:bg-[#0d1b2a] transition-colors duration-300" />
    );
  }

  return (
    <ThemeContext.Provider value={{ theme, setTheme, toggleTheme, fontSize, setFontSize }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  return useContext(ThemeContext);
}
