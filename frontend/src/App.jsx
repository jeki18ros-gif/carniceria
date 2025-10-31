import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import OrdenDeCompra from "./OrdenCompra/OrdenCompra";
import Header from "./components/Header";
import { useTheme } from "./Theme/ThemeContext"; // 👈 Importamos el contexto

export default function App() {
  const { theme } = useTheme(); // 👈 Tomamos el tema actual desde el contexto

  return (
    <div
      className={`min-h-screen transition-colors duration-300 ${
        theme === "dark" ? "bg-[#0d1b2a] text-white" : "bg-[#fffaf3] text-black"
      }`}
    >
      <Router>
        <Header />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/orden-de-compra" element={<OrdenDeCompra />} />
        </Routes>
      </Router>
    </div>
  );
}
