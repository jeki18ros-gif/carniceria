import React from "react";
import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
import Home from "./pages/Home";
import OrdenDeCompra from "./OrdenCompra/OrdenCompra";
import Header from "./components/Header";
import {useTheme } from "./Theme/ThemeContext";

function AppContent() {
  const { theme } = useTheme();
  const location = useLocation();

  const mostrarHeaderGlobal = location.pathname !== "/orden-de-compra";

  return (
    <div
      className={`min-h-screen transition-colors duration-300 ${
        theme === "dark" ? "bg-[#0d1b2a] text-white" : "bg-[#fffaf3] text-black"
      }`}
    >
      {mostrarHeaderGlobal && <Header />}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/orden-de-compra" element={<OrdenDeCompra />} />
      </Routes>
    </div>
  );
}

export default function App() {
  return (
      <Router>
        <AppContent />
      </Router>
  );
}
