import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { motion, AnimatePresence } from "framer-motion";
import { OrdenCompraHeader } from "./OrdenCompraHeader";
import { ListaProductos } from "./ListaProductos";
import { DetalleProductoModal } from "./DetalleProductoModal";
import { MiniCarritoModal } from "./MiniCarritoModal";
import { FormularioCliente } from "./FormularioCliente";

export default function OrdenDeCompra() {
  const { t } = useTranslation();
  const [theme, setTheme] = useState("light");
  const [seleccionados, setSeleccionados] = useState({});
  const [productoSeleccionado, setProductoSeleccionado] = useState(null);
  const [productoEditar, setProductoEditar] = useState(null);
  const [mostrarCarrito, setMostrarCarrito] = useState(false);
  const [datosDelPedido, setDatosDelPedido] = useState(null);
 const [view, setView] = useState(() => {
  return localStorage.getItem("view") || "productos";
});
const FUNCTION_URL = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/generar-pedido-pdf`;
  const [mostrarConfirmacion, setMostrarConfirmacion] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const root = document.documentElement;
    const storedTheme = localStorage.getItem("theme");
    const isDark = storedTheme === "dark" || root.classList.contains("dark");
    setTheme(isDark ? "dark" : "light");
  }, []);

  useEffect(() => {
    const observer = new MutationObserver(() => {
      setTheme(
        document.documentElement.classList.contains("dark") ? "dark" : "light"
      );
    });
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class"],
    });
    return () => observer.disconnect();
  }, []);
useEffect(() => {
  localStorage.setItem("view", view);
}, [view]);

  const toggleMiniCarrito = () => setMostrarCarrito((prev) => !prev);

  const handleSelectProduct = (producto) => setProductoSeleccionado(producto);

  // Añadir o actualizar producto en el carrito
  const handleAddToCart = (id, cantidad, especificaciones) => {
    setSeleccionados((prev) => ({
  ...prev,
  [id]: {
    id,
    cantidad,
    especificaciones,
    ...productoSeleccionado, // 👉 AGREGA TODOS LOS DATOS DEL PRODUCTO
  },
}));

    setMostrarCarrito(true);
    setProductoSeleccionado(null);
    setProductoEditar(null);
  };

  const handleRemoveItem = (id) => {
    setSeleccionados((prev) => {
      const nuevo = { ...prev };
      delete nuevo[id];
      if (Object.keys(nuevo).length === 0) setMostrarCarrito(false);
      return nuevo;
    });
  };

  const handleEditItem = (item) => {
    const cantidadSplit = item.cantidad.split(" ");
    const cantidadValor = cantidadSplit[0];
    const cantidadUnidad = cantidadSplit[1] || "kg";
    setProductoEditar({
      id: item.id,
      cantidadValor,
      cantidadUnidad,
      especificaciones: item.especificaciones,
    });
    setProductoSeleccionado(item); // Abrir modal
  };

  const handleContinueToForm = () => {
    setMostrarCarrito(false);
    setView("formulario");
    window.scrollTo(0, 0);
  };
// Define la función `generarPDFDelPedido` (simulada)
const generarPDFDelPedido = (pedido) => {
  alert("El PDF se ha generado y enviado a tu correo.");
};

// FUNCIÓN CORREGIDA: Recibe los productos seleccionados para el envío
const handleSubmitOrder = async (e, datosCliente, productosSeleccionados) => { 
  e.preventDefault();

  if (Object.keys(productosSeleccionados).length === 0) {
    alert("Debes seleccionar al menos un producto para enviar el pedido.");
    return;
  }

  const pedidoFinal = {
    cliente: datosCliente,
    // Utilizamos los productos recibidos como argumento
    productos: Object.values(productosSeleccionados),
    fechaPedido: new Date().toLocaleDateString("es-ES"),
  };

  try {
    const response = await fetch(
  `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/generar-pedido-pdf`,
  {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      apikey: import.meta.env.VITE_SUPABASE_ANON_KEY,
      Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
    },
    body: JSON.stringify(pedidoFinal),
  }
);




    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || "Error al procesar el pedido."); // Corregido: errorData.error
    }

    const result = await response.json();

    // 1. Mostrar confirmación
    setDatosDelPedido(pedidoFinal);
    setMostrarConfirmacion(true);

    // 2. Limpiar estados y regresar a la vista de productos
    setView("productos");
    setSeleccionados({});
    
  } catch (error) {
    console.error("Error al enviar el pedido:", error);
    alert(`Hubo un error al procesar tu pedido: ${error.message}. Por favor, inténtalo de nuevo.`);
  }
};


  return (
    <div
      className={`min-h-screen flex flex-col pt-24 sm:pt-28 transition-colors duration-300 ${
        theme === "dark" ? "bg-[#0b132b] text-cream" : "bg-cream text-[#0b132b]"
      }`}
    >
      <OrdenCompraHeader />

      <main className="flex-grow py-10 px-6">
        <div className="max-w-6xl mx-auto">
          {view === "productos" && (
            <>
              <h2 className="text-3xl font-extrabold mb-8">
                {t("ordenCompra.products_title")}
              </h2>
              {/* Componente de Búsqueda (Input) */}
              <div className="mb-8 relative medium-block rounded-xl shadow-inner p-3">
                <input
                  type="text"
                  placeholder={t("ordenCompra.search.placeholder")}
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full bg-transparent border-b-2 border-gray-300 dark:border-gray-600 focus:border-[var(--color-dorado)] focus:outline-none py-2 px-1 text-lg transition-colors pr-10" // Añadir pr-10 para dejar espacio al icono
                />

                {searchTerm ? (
                  // Botón/Icono para limpiar
                  <button
                    onClick={() => setSearchTerm("")}
                    className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-500 dark:text-gray-400 hover:text-red-500 transition-colors"
                    aria-label={t("ordenCompra.search.clear_label")}
                  >
                    {/* Icono de cerrar (X) de Heroicons */}
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-6 w-6"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M6 18L18 6M6 6l12 12"
                      />
                    </svg>
                  </button>
                ) : (
                  // Icono de Lupa (solo visible si no hay texto)
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6 absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-500 dark:text-gray-400 pointer-events-none"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                    />
                  </svg>
                )}
              </div>
              <ListaProductos
                onSelectProduct={handleSelectProduct}
                searchTerm={searchTerm}
              />
            </>
          )}
          {view === "formulario" && (
            <>
              <h2 className="text-3xl font-extrabold mb-8">
                {t("ordenCompra.form_title")}
              </h2>
              <FormularioCliente
                onSubmit={handleSubmitOrder}
                seleccionados={seleccionados}
                onEditItem={handleEditItem}
                onRemoveItem={handleRemoveItem}
                onGoBack={() => {
                  setView("productos");
                  window.scrollTo(0, 0);
                }}
              />

            </>
          )}
        </div>
      </main>

      <DetalleProductoModal
        producto={productoSeleccionado}
        productoEditar={productoEditar}
        onClose={() => {
          setProductoSeleccionado(null);
          setProductoEditar(null);
        }}
        onAddToCart={handleAddToCart}
      />

      <MiniCarritoModal
        seleccionados={seleccionados}
        onToggleVisibility={toggleMiniCarrito}
        onContinue={handleContinueToForm}
        onRemoveItem={handleRemoveItem}
        onEditItem={handleEditItem}
        isVisible={mostrarCarrito}
      />

      <AnimatePresence>
        {mostrarConfirmacion && datosDelPedido && ( // <--- Verifica que datosDelPedido exista
          <motion.div
            className="fixed inset-0 bg-black/60 flex items-center justify-center z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              className="light-block rounded-2xl p-6 shadow-xl text-center max-w-sm mx-4"
            >
              <h3 className="text-xl font-bold mb-2">
                {t("ordenCompra.confirmation.title")}
              </h3>
              <p className="text-gray-600 dark:text-gray-300 mb-4">
                {t("ordenCompra.confirmation.message")}
              </p>

              {/* BOTÓN DE DESCARGAR PDF */}
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <button
                  onClick={() => generarPDFDelPedido(datosDelPedido)} // <--- NUEVO BOTÓN
                  className="px-4 py-2 rounded-lg font-medium transition-all bg-yellow-500 hover:bg-yellow-600 text-black shadow-md"
                >
                  {t("ordenCompra.confirmation.download_pdf") || "Descargar PDF"}
                </button>
                <button
                  onClick={() => {
                    setMostrarConfirmacion(false);
                    setDatosDelPedido(null); // Limpiar datos después de cerrar
                  }}
                  className="px-4 py-2 rounded-lg font-medium transition-all btn"
                >
                  {t("ordenCompra.confirmation.close")}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}