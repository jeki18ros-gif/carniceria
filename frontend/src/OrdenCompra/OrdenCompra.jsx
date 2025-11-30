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
      cantidad: `${cantidadValor} ${cantidadUnidad}`, //AQUI EL CAMBIO
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
const generarPDFDelPedido = async (pedido) => {
  try {
    // =============================
    //  ARMAR HTML PROFESIONAL
    // =============================
    const productosHTML = pedido.productos
      .map(
        (p) => `
      <tr>
        <td style="padding:8px; border:1px solid #ddd;">${p.nombre}</td>
        <td style="padding:8px; border:1px solid #ddd;">${p.cantidad_valor} ${p.cantidad_unidad}</td>
        <td style="padding:8px; border:1px solid #ddd;">
          ${p.tipo_corte || ""} 
          ${p.parte || ""} 
          ${p.estado || ""} 
          ${p.grasa || ""} 
          ${p.hueso || ""} 
          ${p.coccion || ""} 
          ${p.empaque || ""} 
          ${p.observacion || ""}
        </td>
      </tr>
    `
      )
      .join("");

    const html = `
      <div style="font-family: Arial, sans-serif; padding: 40px;">
        <h1 style="text-align:center; color:#b8860b;">Orden de Compra</h1>

        <h2>Datos del Cliente</h2>
        <p><strong>Nombre:</strong> ${pedido.cliente.nombre}</p>
        <p><strong>Teléfono:</strong> ${pedido.cliente.telefono}</p>
        <p><strong>Correo:</strong> ${pedido.cliente.correo}</p>
        <p><strong>Dirección:</strong> ${pedido.cliente.direccion}</p>
        <p><strong>Entrega:</strong> ${pedido.cliente.entrega}</p>

        <h2 style="margin-top:30px;">Productos solicitados</h2>
        <table style="width:100%; border-collapse: collapse;">
          <thead>
            <tr style="background:#eee;">
              <th style="padding:10px; border:1px solid #ccc;">Producto</th>
              <th style="padding:10px; border:1px solid #ccc;">Cantidad</th>
              <th style="padding:10px; border:1px solid #ccc;">Detalles</th>
            </tr>
          </thead>
          <tbody>
            ${productosHTML}
          </tbody>
        </table>

        <h2 style="margin-top:30px;">Comentarios</h2>
        <p>${pedido.cliente.comentarios || "Sin comentarios"}</p>

        <p style="margin-top:40px; text-align:center; color:gray; font-size:14px;">
          Les Aliments Benito – Gracias por su compra.
        </p>
      </div>
    `;

    // =============================
    //  ENVIAR HTML A API PDF
    // =============================
    const response = await fetch("/api/pdf", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        html,
        fileName: `pedido_${pedido.orden_id || "cliente"}.pdf`,
      }),
    });

    if (!response.ok) throw new Error("Error generando PDF");

    // =============================
    //  DESCARGAR PDF
    // =============================
    const blob = await response.blob();
    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = `pedido_${pedido.orden_id || "cliente"}.pdf`;
    a.click();

    URL.revokeObjectURL(url);
  } catch (e) {
    console.error(e);
    alert("Error al generar PDF");
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

  // Convertir productos al formato final
  const productosArray = Object.values(productosSeleccionados).map((item) => {
    const cantidad_valor = item.cantidad_valor ?? (item.cantidad?.split?.(" ")[0] ?? "");
    const cantidad_unidad = item.cantidad_unidad ?? (item.cantidad?.split?.(" ")[1] ?? "kg");

    return {
      id: item.id,
      nombre: item.nombre,
      cantidad_valor,
      cantidad_unidad,
      tipo_corte: item.especificaciones?.tipoCorte || null,
      parte: item.especificaciones?.parte || null,
      estado: item.especificaciones?.estado || null,
      hueso: item.especificaciones?.hueso || null,
      grasa: item.especificaciones?.grasa || null,
      empaque: item.especificaciones?.empaque || null,
      coccion: item.especificaciones?.coccion || null,
      fecha_deseada: item.especificaciones?.fechaDeseada || null,
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
    productos: productosArray,
    comentarios: datosCliente.comentarios || null,
  };

  try {
    // Enviar el pedido al backend de Vercel para generar PDF
    const response = await fetch("/api/pdf", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(pedidoFinal),
    });

    if (!response.ok) throw new Error("Error generando PDF");

    const blob = await response.blob();
    const url = URL.createObjectURL(blob);

    // Descargar PDF
    const a = document.createElement("a");
    a.href = url;
    a.download = `pedido_${Date.now()}.pdf`;
    a.click();

    URL.revokeObjectURL(url);

    // Mostrar modal de confirmación
    setDatosDelPedido(pedidoFinal);
    setMostrarConfirmacion(true);

    // Limpiar vista
    setView("productos");
    setSeleccionados({});
  } catch (error) {
    console.error("Error al enviar el pedido:", error);
    alert("Error al procesar tu pedido.");
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
                <button onClick={() => generarPDFDelPedido(datosDelPedido)}
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
