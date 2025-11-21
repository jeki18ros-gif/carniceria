import { useState, useEffect } from "react";
import { useTheme } from "../Theme/ThemeContext";

export function useHeaderState() {
  const { theme, setTheme } = useTheme();

  const [fontSize, setFontSize] = useState("normal");
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [fontMenuOpen, setFontMenuOpen] = useState(false);

  // cargar localStorage
  useEffect(() => {
    const savedTheme = localStorage.getItem("theme");
    const savedFont = localStorage.getItem("fontSize");

    if (savedTheme) setTheme(savedTheme);
    if (savedFont) setFontSize(savedFont);
  }, []);

  // aplicar tema
  useEffect(() => {
    document.documentElement.classList.toggle("dark", theme === "dark");
    localStorage.setItem("theme", theme);
  }, [theme]);

  // aplicar tamaño de fuente
  useEffect(() => {
    document.documentElement.classList.remove("text-sm", "text-lg");

    if (fontSize === "small") document.documentElement.classList.add("text-sm");
    if (fontSize === "large") document.documentElement.classList.add("text-lg");

    localStorage.setItem("fontSize", fontSize);
  }, [fontSize]);

  // detectar scroll
  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 10);

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const toggleTheme = () =>
    setTheme((prev) => (prev === "light" ? "dark" : "light"));

  return {
    theme,
    fontSize,
    scrolled,
    menuOpen,
    fontMenuOpen,
    setFontSize,
    setMenuOpen,
    setFontMenuOpen,
    toggleTheme,
  };
}
