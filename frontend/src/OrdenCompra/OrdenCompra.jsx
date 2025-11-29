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
  const [mostrarConfirmacion, setMostrarConfirmacion] = useState(false);
  const [datosDelPedido, setDatosDelPedido] = useState(null);

  const [searchTerm, setSearchTerm] = useState("");

  const [view, setView] = useState(() => {
    return localStorage.getItem("view") || "productos";
  });

  // ============================
  //   THEME DETECTION
  // ============================
  useEffect(() => {
    const root = document.documentElement;
    const storedTheme = localStorage.getItem("theme");
    const isDark = storedTheme === "dark" || root.classList.contains("dark");
    setTheme(isDark ? "dark" : "light");
  }, []);

  useEffect(() => {
    const observer = new MutationObserver(() => {
      setTheme(
        document.documentElement.classList.contains("dark")
          ? "dark"
          : "light"
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

  // ============================
  //      FUNCIONES
  // ============================
  const toggleMiniCarrito = () => setMostrarCarrito((prev) => !prev);

  const handleSelectProduct = (producto) => {
    setProductoSeleccionado(producto);
  };

const handleAddToCart = (id, cantidadValor, cantidadUnidad, especificaciones) => {
  setSeleccionados((prev) => ({
    ...prev,
    [id]: {
      id,
      cantidad_valor: cantidadValor,
      cantidad_unidad: cantidadUnidad,
      cantidad: `${cantidadValor} ${cantidadUnidad}`, // 👈 AQUI EL CAMBIO
      especificaciones,
      ...(productoSeleccionado || {}),
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

    setProductoSeleccionado(item);
  };

  const handleContinueToForm = () => {
    setMostrarCarrito(false);
    setView("formulario");
    window.scrollTo(0, 0);
  };

  // ============================
  //   DESCARGAR PDF DESDE BOTÓN
  // ============================
const generarPDFDelPedido = async (pedidoConMeta) => {
  try {
    // Si ya tenemos pdf_url (viene de handleSubmitOrder), la usamos directamente:
    if (pedidoConMeta?.pdf_url) {
      // fetch the pdf and force download (cross-browser)
      const res = await fetch(pedidoConMeta.pdf_url);
      if (!res.ok) throw new Error("No se pudo descargar el PDF");
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      // nombre con id si existe
      a.download = `pedido_${pedidoConMeta.orden_id || "pedido"}.pdf`;
      a.click();
      URL.revokeObjectURL(url);
      return;
    }

    // Si NO hay pdf_url, pedimos al function (esto puede regenerar)
    const response = await fetch(
      `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/generar-pedido-pdf`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          apikey: import.meta.env.VITE_SUPABASE_ANON_KEY,
        },
        body: JSON.stringify(pedidoConMeta),
      }
    );

    if (!response.ok) {
      const err = await response.json().catch(() => ({}));
      throw new Error(err.error || "No se pudo generar/descargar el PDF");
    }

    const data = await response.json();
    if (!data.pdf_url) throw new Error("No se devolvió la URL del PDF");

    // descargar
    const resPdf = await fetch(data.pdf_url);
    if (!resPdf.ok) throw new Error("No se pudo descargar el PDF");
    const blob = await resPdf.blob();
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `pedido_${data.orden_id || "pedido"}.pdf`;
    a.click();
    URL.revokeObjectURL(url);
  } catch (e) {
    alert("Error al generar/descargar PDF");
    console.error(e);
  }
};

  // ============================
  //   ENVIAR PEDIDO FINAL
  // ============================
 const handleSubmitOrder = async (e, datosCliente, productosSeleccionados) => {
  e.preventDefault();

  if (!productosSeleccionados || Object.keys(productosSeleccionados).length === 0) {
    alert("Debes seleccionar al menos un producto para enviar el pedido.");
    return;
  }

  // Construir array de productos en el formato que espera el backend
  const productosArray = Object.values(productosSeleccionados).map((item) => {
    // si el item viene con cantidad_valor/ unidad, usar esas; si viene con cantidad (string), intentar parsear
    const cantidad_valor = item.cantidad_valor ?? (item.cantidad?.split?.(" ")[0] ?? "");
    const cantidad_unidad = item.cantidad_unidad ?? (item.cantidad?.split?.(" ")[1] ?? "kg");

    return {
      id: item.id,
      nombre: item.nombre,
      cantidad_valor,
      cantidad_unidad,
      // pasar las especificaciones tal cual (puede ser objeto)
      tipo_corte: item.especificaciones?.tipoCorte || item.especificaciones?.tipo_corte || null,
      parte: item.especificaciones?.parte || null,
      estado: item.especificaciones?.estado || null,
      hueso: item.especificaciones?.hueso || null,
      grasa: item.especificaciones?.grasa || null,
      empaque: item.especificaciones?.empaque || null,
      coccion: item.especificaciones?.coccion || null,
      fecha_deseada: item.especificaciones?.fechaDeseada || item.especificaciones?.fecha_deseada || null,
      observacion: item.especificaciones?.observacion || null,
    };
  });

  const pedidoFinal = {
    cliente: {
      nombre: datosCliente.nombre,
      telefono: datosCliente.telefono,
      correo: datosCliente.correo,
      direccion: datosCliente.direccion,
      entrega: datosCliente.entrega,
      comentarios: datosCliente.comentarios,
    },
    fecha_entrega: datosCliente.fechaEntrega || null, // para la tabla ordenes
    productos: productosArray,
    comentarios: datosCliente.comentarios || null,
  };

  try {
    const response = await fetch(
      `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/generar-pedido-pdf`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          apikey: import.meta.env.VITE_SUPABASE_ANON_KEY,
        },
        body: JSON.stringify(pedidoFinal),
      }
    );

    if (!response.ok) {
      const err = await response.json().catch(() => ({}));
      throw new Error(err.error || "Error al procesar el pedido.");
    }

    const data = await response.json(); // { success, orden_id, pdf_url }
    // guardamos para mostrar en modal
    setDatosDelPedido({
      ...pedidoFinal,
      orden_id: data.orden_id,
      pdf_url: data.pdf_url,
    });

    setMostrarConfirmacion(true);
    setView("productos");
    setSeleccionados({});
  } catch (error) {
    console.error("Error al enviar el pedido:", error);
    alert(`Hubo un error al procesar tu pedido: ${error.message}`);
  }
};

  // ============================
  //   RENDER PRINCIPAL
  // ============================
  return (
    <div
      className={`min-h-screen flex flex-col pt-24 sm:pt-28 transition-colors duration-300 ${
        theme === "dark" ? "bg-[#0b132b] text-cream" : "bg-cream text-[#0b132b]"
      }`}
    >
      <OrdenCompraHeader />

      <main className="flex-grow py-10 px-6">
        <div className="max-w-6xl mx-auto">
          {/* ===================== VISTA PRODUCTOS ===================== */}
          {view === "productos" && (
            <>
              <h2 className="text-3xl font-extrabold mb-8">
                {t("ordenCompra.products_title")}
              </h2>

              {/* Buscador */}
              <div className="mb-8 relative medium-block rounded-xl shadow-inner p-3">
                <input
                  type="text"
                  placeholder={t("ordenCompra.search.placeholder")}
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full bg-transparent border-b-2 border-gray-300 dark:border-gray-600 
                  focus:border-[var(--color-dorado)] focus:outline-none py-2 px-1 text-lg transition-colors pr-10"
                />

                {searchTerm ? (
                  <button
                    onClick={() => setSearchTerm("")}
                    className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-500 
                    dark:text-gray-400 hover:text-red-500 transition-colors"
                  >
                    ✕
                  </button>
                ) : (
                  <svg
                    className="h-6 w-6 absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-500 
                    dark:text-gray-400 pointer-events-none"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
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

          {/* ===================== VISTA FORMULARIO ===================== */}
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

      {/* ===================== MODALES ===================== */}
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

      {/* ===================== CONFIRMACIÓN ===================== */}
      <AnimatePresence>
        {mostrarConfirmacion && datosDelPedido && (
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

              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <button
                  onClick={() => generarPDFDelPedido(datosDelPedido)}
                  className="px-4 py-2 rounded-lg font-medium bg-yellow-500 hover:bg-yellow-600 text-black shadow-md"
                >
                  {t("ordenCompra.confirmation.download_pdf") ||
                    "Descargar PDF"}
                </button>

                <button
                  onClick={() => {
                    setMostrarConfirmacion(false);
                    setDatosDelPedido(null);
                  }}
                  className="px-4 py-2 rounded-lg font-medium btn"
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
