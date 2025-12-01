import { StrictMode, Suspense } from "react"; // 👈 Importamos Suspense
import { createRoot } from "react-dom/client";
import App from "./App.jsx";
import "./styles/index.css";
import { ThemeProvider } from "./Theme/ThemeContext.jsx";
import "./i18n.js"; // Inicializa i18n globalmente

createRoot(document.getElementById("root")).render(
  <StrictMode>
    {/*Aplicamos Suspense aquí */}
    <Suspense fallback={<div>Cargando...</div>}> 
      <ThemeProvider>
        <App />
      </ThemeProvider>
    </Suspense>
  </StrictMode>
);