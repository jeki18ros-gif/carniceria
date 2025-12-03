// src/components/MiniCarritoModal.jsx
import React from "react";
import { useTranslation } from "react-i18next";
import { motion, AnimatePresence } from "framer-motion";
import { useProductosData } from "./productosData";
import { XMarkIcon, ShoppingCartIcon } from "@heroicons/react/24/outline";
import clsx from "clsx";
import { useTheme } from "../Theme/ThemeContext";

/* =============================================================
   🔧 Función utilitaria para normalización de cadenas
   ============================================================= */
const normalizeKey = (str) =>
  str
    ?.toString()
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .trim()
    .replace(/\s+/g, "_");

export function MiniCarritoModal({
  seleccionados,
  onToggleVisibility,
  onContinue,
  onRemoveItem,
  onEditItem,
  isVisible,
}) {
  const { t } = useTranslation();
  const { theme } = useTheme();
  const isDark = theme === "dark";

  const { productos } = useProductosData();

  /* =============================================================
     🧾 Armamos el array del carrito (productos + selección)
     ============================================================= */
  const itemsEnCarrito = Object.entries(seleccionados || {})
    .map(([idStr, data]) => {
      const id = parseInt(idStr);
      const productoInfo = productos.find((p) => p.id === id);

      return {
        id,
        nombre: productoInfo?.nombre || t("miniCart.unknown_product"),
        imagen:
          productoInfo?.imagen ||
          "https://placehold.co/80x80/AAAAAA/FFFFFF?text=Item",
        ...data,
      };
    })
    .filter((item) => item.cantidad);

  /* =============================================================
     ⛔ Si está oculto y vacío → no mostrar nada
     ============================================================= */
  if (!isVisible && itemsEnCarrito.length === 0) return null;

  /* =============================================================
     🟡 Botón flotante mini carrito (cuando está oculto)
     ============================================================= */
  if (!isVisible && itemsEnCarrito.length > 0) {
    return (
      <motion.button
        onClick={onToggleVisibility}
        className="fixed bottom-6 right-6 p-4 rounded-full shadow-xl z-50 flex items-center space-x-2 bg-yellow-500 hover:bg-yellow-400 text-black transition-colors"
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: "spring", stiffness: 300, damping: 20 }}
      >
        <ShoppingCartIcon className="w-6 h-6" />
        <span className="font-bold hidden sm:inline">
          {t("miniCart.title")}
        </span>
        <span className="inline-flex items-center justify-center ml-2 px-2 py-1 bg-black text-yellow-400 rounded-full text-xs font-bold">
          {itemsEnCarrito.length}
        </span>
      </motion.button>
    );
  }

  /* =============================================================
     🌎 Función para traducir especificaciones dinámicas
     ============================================================= */
  const traducirValor = (key, value) => {
    if (!value) return "";

    let normalized = normalizeKey(value);

    const EXCEPTION_MAP = {
      a_la_parrilla: "parrilla",
      al_vacio: "vacuum",
      al_horno: "horno",
      bandeja: "tray",
      bolsa: "bag",
      con_grasa: "con_grasa",
      sin_grasa: "sin_grasa",
      con_hueso: "con_hueso",
      sin_hueso: "sin_hueso",
      fileteado: "fileteado",
      en_trozos: "trozos",
      en_tiras: "tiras",
      entero: "entero",
      molido: "molido",
      fresco: "fresca",
      curado: "curada",
    };

    if (EXCEPTION_MAP[normalized]) {
      normalized = EXCEPTION_MAP[normalized];
    }

    const PATHS = {
      tipoCorte:
        "detalleProductoModal.sections.presentacion.tipo_corte.options.",
      parte:
        "detalleProductoModal.sections.presentacion.parte_especifica.options.",
      estado:
        "detalleProductoModal.sections.estado_producto.estado.options.",
      hueso:
        "detalleProductoModal.sections.estado_producto.hueso.options.",
      grasa:
        "detalleProductoModal.sections.empaque_grasa.grasa.options.",
      empaque:
        "detalleProductoModal.sections.empaque_grasa.empaque.options.",
      coccion:
        "detalleProductoModal.sections.tipo_coccion.options.",
    };

    // Si existe key en PATHS → usar traducción
    if (PATHS[key]) {
      return t(PATHS[key] + normalized, value);
    }

    return value;
  };

  /* =============================================================
     🧾 Render del modal
     ============================================================= */
  return (
    <AnimatePresence>
      {isVisible && itemsEnCarrito.length > 0 && (
        <motion.div
          className={clsx(
            "fixed bottom-6 right-6 w-80 max-w-[90%] sm:w-96 rounded-xl shadow-2xl flex flex-col z-50 transition-colors duration-300",
            isDark
              ? "bg-gray-900 text-gray-100 border border-gray-700"
              : "bg-white text-gray-900 border border-gray-200"
          )}
          initial={{ opacity: 0, scaleY: 0, y: 50 }}
          animate={{
            opacity: 1,
            scaleY: 1,
            y: 0,
            transition: { duration: 0.4 },
          }}
          exit={{
            opacity: 0,
            scaleY: 0,
            y: 50,
            transition: { duration: 0.3 },
          }}
          style={{
            transformOrigin: "bottom",
            maxHeight: "90vh",
            display: "flex",
            flexDirection: "column",
          }}
        >
          {/* Cerrar */}
          <button
            onClick={onToggleVisibility}
            className={`absolute top-3 right-3 p-1 rounded-full transition-colors duration-200 ${
              isDark ? "hover:bg-gray-800" : "hover:bg-gray-100"
            }`}
          >
            <XMarkIcon className="w-5 h-5 text-gray-500" />
          </button>

          {/* Título */}
          <h3
            className={clsx(
              "text-xl font-bold p-4 border-b transition-colors duration-300",
              isDark ? "border-gray-700" : "border-gray-200"
            )}
          >
            {t("miniCart.title")} ({itemsEnCarrito.length})
          </h3>

          {/* Items */}
          <div
            className="flex flex-col gap-4 px-4 py-4 overflow-y-auto"
            style={{ flexGrow: 1 }}
          >
            {itemsEnCarrito.map((item) => (
              <div
                key={item.id}
                className={clsx(
                  "flex items-start gap-3 border-b border-dashed pb-4",
                  isDark ? "border-gray-700" : "border-gray-300"
                )}
              >
                <img
                  src={item.imagen}
                  alt={item.nombre}
                  className="w-14 h-14 object-cover rounded-lg flex-shrink-0 shadow-md"
                  onError={(e) => {
                    e.target.src =
                      "https://placehold.co/80x80/AAAAAA/FFFFFF?text=Item";
                  }}
                />

                <div className="flex-grow min-w-0">
                  <p className="font-semibold text-base truncate">
                    {item.nombre}
                  </p>

                  {/* Cantidad + unidad traducida */}
                  <p className="text-sm text-yellow-500 mt-0.5">
                    {t("miniCart.quantity")}{" "}
                    <span className="font-bold">
                      {item.cantidad}{" "}
                      {t(
                    `detalleProductoModal.quantity.units.${normalizeKey(item.cantidadUnidad)}`,
                    { 
                        defaultValue: item.cantidadUnidad || "" 
                    }
                )}
                    </span>
                  </p>

                  {/* Especificaciones */}
                  {Object.entries(item.especificaciones || {}).map(
                    ([key, value]) =>
                      key !== "observacion" &&
                      value && (
                        <p
                          key={key}
                          className={`text-xs mt-0.5 truncate ${
                            isDark ? "text-gray-400" : "text-gray-600"
                          }`}
                        >
                          {t(`miniCart.fields.${key}`, key)}:{" "}
                          <span className="font-medium">
                            {traducirValor(key, value)}
                          </span>
                        </p>
                      )
                  )}

                  {item.especificaciones?.observacion && (
                    <p
                      className={`text-xs italic mt-0.5 truncate ${
                        isDark ? "text-gray-400" : "text-gray-600"
                      }`}
                    >
                      {t("miniCart.obs_prefix")}{" "}
                      {item.especificaciones.observacion}
                    </p>
                  )}
                </div>

                {/* Acciones */}
                <div className="flex flex-col gap-1 items-center ml-2">
                  <button
                    onClick={() => onEditItem(item)}
                    className="text-blue-500 hover:text-blue-400 text-sm font-medium"
                  >
                    {t("miniCart.edit")}
                  </button>

                  <button
                    onClick={() => onRemoveItem(item.id)}
                    className="text-red-500 hover:text-red-400"
                  >
                    <XMarkIcon className="w-5 h-5" />
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Continuar */}
          <div
            className={clsx(
              "px-4 py-3 border-t",
              isDark ? "border-gray-700" : "border-gray-200"
            )}
          >
            <button
              onClick={onContinue}
              className="w-full py-2 rounded-lg font-semibold bg-yellow-500 hover:bg-yellow-400 text-black shadow-md"
            >
              {t("miniCart.continue")}
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
