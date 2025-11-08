import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";

// Idiomas soportados
const supportedLngs = ["es", "en", "fr"];

// Función para cargar recursos dinámicamente desde /public/locales
async function loadLanguageResources(lng) {
  const lang = supportedLngs.includes(lng) ? lng : "es";

  // Evitar recargar si ya existe
  if (i18n.hasResourceBundle(lang, "translation")) return;

  try {
    const response = await fetch(`/locales/${lang}/translation.json`);
    if (!response.ok) throw new Error("Archivo no encontrado");
    const data = await response.json();

    i18n.addResourceBundle(lang, "translation", data, true, true);
  } catch (err) {
    console.error(`❌ Error cargando idioma ${lang}:`, err);
  }
}

// Inicializar i18next
i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources: {}, // los cargaremos dinámicamente
    supportedLngs,
    fallbackLng: "es",
    load: "currentOnly",
    interpolation: { escapeValue: false },
    detection: {
      order: ["localStorage", "navigator", "htmlTag"],
      caches: ["localStorage"],
    },
    react: { useSuspense: false },
  });

// Precargar el idioma por defecto y el detectado
void loadLanguageResources("es");
void loadLanguageResources(i18n.language || "es");

// Actualizar <html lang> y guardar idioma actual
i18n.on("languageChanged", (lng) => {
  document.documentElement.setAttribute("lang", lng);
  localStorage.setItem("i18nextLng", lng);
});

// API para cambiar idioma
export async function setLanguage(lng) {
  await loadLanguageResources(lng);
  await i18n.changeLanguage(lng);
}

export default i18n;
