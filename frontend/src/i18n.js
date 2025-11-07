import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";

// Idiomas soportados
const supportedLngs = ["es", "en", "fr"];

// Carga dinámica de recursos por idioma
async function loadLanguageResources(lng) {
  const lang = supportedLngs.includes(lng) ? lng : "es";
  // Evitar re-importar si el bundle ya existe
  if (i18n.hasResourceBundle(lang, "translation")) return;

  // Nota: Vite soporta import dinámico de JSON dentro de src
  const mod = await import(/* @vite-ignore */ `./locales/${lang}/translation.json`);
  i18n.addResourceBundle(lang, "translation", mod.default, true, true);
}

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    // Recursos cargados dinámicamente, arrancamos vacío
    resources: {},
    supportedLngs,
    fallbackLng: "es",
    load: "currentOnly", // evita variantes regionales (es-ES vs es)
    interpolation: { escapeValue: false },
    detection: {
      order: ["localStorage", "navigator", "htmlTag"],
      caches: ["localStorage"],
    },
    react: { useSuspense: false }, // evita Suspense para cambios de idioma
    returnEmptyString: false,
  });

// Pre-carga español como fallback y el idioma inicial detectado
void loadLanguageResources("es");
void loadLanguageResources(i18n.language || "es");

// Mantener sincronizado <html lang> y asegurar persistencia
i18n.on("languageChanged", (lng) => {
  try {
    document.documentElement.setAttribute("lang", lng);
    localStorage.setItem("i18nextLng", lng);
  } catch {}
});

// API global: cambiar idioma con carga dinámica previa
export async function setLanguage(lng) {
  await loadLanguageResources(lng);
  await i18n.changeLanguage(lng);
}

export default i18n;
