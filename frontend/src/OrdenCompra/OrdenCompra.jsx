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
  const [cargandoPedido, setCargandoPedido] = useState(false);
  const [mensajeEmail, setMensajeEmail] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  const [view, setView] = useState(() => {
    return localStorage.getItem("view") || "productos";
  });
  //   THEME DETECTION
  useEffect(() => {
    const storedTheme = localStorage.getItem("theme");
    setTheme(storedTheme === "dark" ? "dark" : "light");
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
  //      FUNCIONES

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
        cantidad: `${cantidadValor} ${cantidadUnidad}`,
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
    const [cantidadValor, cantidadUnidad = "kg"] = item.cantidad.split(" ");

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
  //   DESCARGAR PDF DESDE BACKEND
  const descargarPDF = async (url) => {
    const link = document.createElement("a");
    link.href = url;
    link.download = "pedido.pdf";
    link.target = "_blank";
    document.body.appendChild(link);
    link.click();
    link.remove();
  };

  //   ENVIAR PEDIDO FINAL
 const handleSubmitOrder = async (e, datosCliente, productosSeleccionados) => {
  e.preventDefault();

  if (!productosSeleccionados || Object.keys(productosSeleccionados).length === 0) {
    alert("Debes seleccionar al menos un producto.");
    return;
  }

  setCargandoPedido(true);

  const productosArray = Object.values(productosSeleccionados).map((item) => {
    const cantidad_valor = item.cantidad_valor ?? item.cantidad.split(" ")[0];
    const cantidad_unidad = item.cantidad_unidad ?? item.cantidad.split(" ")[1] ?? "kg";

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
      nombre_cliente: datosCliente.nombre_cliente || datosCliente.nombre,
      // Usar las claves que vienen del FormularioCliente AHORA CORREGIDAS:
      cliente_telefono: datosCliente.cliente_telefono, // ⬅️ CAMBIADO
      cliente_correo: datosCliente.cliente_correo, // ⬅️ CAMBIADO
      cliente_direccion: datosCliente.cliente_direccion, // ⬅️ CAMBIADO
      entrega: datosCliente.entrega,
      comentarios: datosCliente.comentarios,
    },
    fecha_entrega: datosCliente.fechaEntrega || null,
    productos: productosArray,
    comentarios: datosCliente.comentarios || null,
  };

  try {
    // 1️⃣ PRIMERA LLAMADA → GENERA EL PEDIDO Y EL PDF
const response = await fetch(
  `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/generar-pedido-pdf`,
  {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      apikey: import.meta.env.VITE_SUPABASE_ANON_KEY,
    },
    body: JSON.stringify({
        cliente: {
            nombre_cliente: pedidoFinal.cliente.nombre_cliente,
            telefono: pedidoFinal.cliente.cliente_telefono, // Mapear la clave del frontend a la clave esperada por el DB (en el Edge Function)
            correo: pedidoFinal.cliente.cliente_correo, // Mapear la clave del frontend a la clave esperada por el DB (en el Edge Function)
            direccion: pedidoFinal.cliente.cliente_direccion,
            entrega: pedidoFinal.cliente.entrega,
            comentarios: pedidoFinal.cliente.comentarios,
        },
        productos: productosArray
      }),
  }
);
// Archivo: OrdenDeCompra.jsx (dentro de handleSubmitOrder, después de la llamada a emailResponse)

const emailData = await emailResponse.json();

if (!emailResponse.ok) {
  console.error("Error email:", emailData);
  alert("El pedido se generó, pero hubo un error al enviar el correo.");
  setMensajeEmail("El pedido se generó, pero hubo un error al enviar el correo."); // <--- Mensaje de error (opcional)
} else {
  // Mensaje de éxito para la demostración
  setMensajeEmail(`El comprobante de pedido se envió correctamente a ${datosCliente.cliente_correo}. (NOTA: En esta versión DEMO, se ha enviado una copia de prueba al administrador jeki18ros@gmail.com).`);
}

// 3️⃣ MOSTRAR CONFIRMACIÓN (Esta sección no cambia mucho)
// ...

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || "Error al procesar el pedido");
    }
// 2️⃣ SEGUNDA LLAMADA → ENVÍA EL CORREO CON RESEND

const emailResponse = await fetch(
  `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/send-order-email`,
  {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      apikey: import.meta.env.VITE_SUPABASE_ANON_KEY,
    },
    body: JSON.stringify({
      orden_id: data.orden_id,
      pdf_url: data.pdf_url,
      nombre_cliente: pedidoFinal.cliente.nombre_cliente,
      correo: pedidoFinal.cliente.cliente_correo, // ⬅️ CAMBIADO
      pdfBase64: data.pdfBase64, // ¡Asegúrate de incluir esto para el adjunto!
    }),
  }
);

const emailData = await emailResponse.json();

if (!emailResponse.ok) {
  console.error("Error email:", emailData);
  alert("El pedido se generó, pero hubo un error al enviar el correo.");
}
    // 3️⃣ MOSTRAR CONFIRMACIÓN
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
    alert(`Hubo un error: ${error.message}`);
  } finally {
    setCargandoPedido(false);
  }
};
  //   RENDER PRINCIPAL
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

              <div className="mb-8 relative medium-block rounded-xl shadow-inner p-3">
                <input
                  type="text"
                  placeholder={t("ordenCompra.search.placeholder")}
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full bg-transparent border-b-2 border-gray-300 
                  dark:border-gray-600 focus:border-[var(--color-dorado)] focus:outline-none py-2 px-1 text-lg"
                />
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

      <AnimatePresence>
  {cargandoPedido && (
    <motion.div
      className="fixed inset-0 bg-black/60 flex items-center justify-center z-50"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <motion.div
        className="bg-white dark:bg-[#1e1e1e] rounded-xl p-6 shadow-xl text-center"
        initial={{ scale: 0.8 }}
        animate={{ scale: 1 }}
        exit={{ scale: 0.8 }}
      >
        <div className="loader mx-auto mb-4"></div>
        <h3 className="text-lg font-semibold mb-2">Procesando pedido...</h3>
        <p className="text-gray-600 dark:text-gray-300">
          Generando comprobante en PDF, por favor espera.
        </p>
      </motion.div>
    </motion.div>
  )}
</AnimatePresence>


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
              {mensajeEmail && ( // ⬅️ AÑADIR ESTE BLOQUE
                <motion.p
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  className="text-sm font-semibold text-red-500 dark:text-yellow-400 mb-4 p-2 border-2 border-red-500 dark:border-yellow-400 rounded"
                >
                  {mensajeEmail}
                </motion.p>
              )}

              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <button
                  onClick={() => descargarPDF(datosDelPedido.pdf_url)}
                  className="px-4 py-2 rounded-lg font-medium bg-yellow-500 hover:bg-yellow-600 text-black shadow-md"
                >
                  {t("ordenCompra.confirmation.download_pdf")}
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
