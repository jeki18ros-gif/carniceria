import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";
import HttpBackend from "i18next-http-backend"; // 👈 Nuevo import

// Idiomas soportados
const supportedLngs = ["es", "en", "fr"];

// ❌ Se ELIMINA la función loadLanguageResources manual

// Inicializar i18next
i18n
  .use(HttpBackend) // 👈 Usa el backend para cargar los archivos JSON
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    // Configuración del backend para apuntar a la carpeta /public/locales
    backend: {
      loadPath: '/locales/{{lng}}/translation.json', 
    },
    
    // Ya no necesitamos definir 'resources' manualmente, el backend los trae
    supportedLngs,
    fallbackLng: "es", 
    load: "currentOnly",
    interpolation: { escapeValue: false },
    detection: {
      order: ["localStorage", "navigator", "htmlTag"],
      caches: ["localStorage"],
    },
    react: { useSuspense: true }, // ✅ Habilitado para usar <Suspense>
  });

// Se ELIMINAN las llamadas precarga no controladas (void loadLanguageResources(...))

// Actualizar <html lang> y guardar idioma actual
i18n.on("languageChanged", (lng) => {
  document.documentElement.setAttribute("lang", lng);
  localStorage.setItem("i18nextLng", lng);
});

// API para cambiar idioma (simplificada)
export async function setLanguage(lng) {
  // changeLanguage automáticamente usará el HttpBackend para cargar el recurso
  await i18n.changeLanguage(lng);
}

export default i18n;