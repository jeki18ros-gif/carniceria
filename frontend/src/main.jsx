import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.jsx";
import "./index.css";
import { ThemeProvider } from "./Theme/ThemeContext.jsx";
import ThemeToggle from "./Theme/ThemeToggle.jsx";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <ThemeProvider>
      <ThemeToggle />
      <App />
    </ThemeProvider>
  </StrictMode>
);
