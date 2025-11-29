// src/components/MiniCarritoModal.jsx
import React from "react";
import { useTranslation } from "react-i18next";
import { motion, AnimatePresence } from "framer-motion";
import { useProductosData } from "./productosData";
import { XMarkIcon, ShoppingCartIcon } from "@heroicons/react/24/outline";
import clsx from "clsx";
import { useTheme } from "../Theme/ThemeContext";

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

  // Corrección 1: Asegura que 'seleccionados' sea un objeto, incluso si es undefined.
  // Convertimos seleccionados en array con datos del producto
  const itemsEnCarrito = Object.entries(seleccionados || {})
    .map(([idStr, data]) => {
      const id = parseInt(idStr);
      // Asume que 'productos' es un array o undefined. Si es undefined, .find() fallará.
      // (Se asume que useProductosData garantiza que 'productos' es un array o es tratado como tal).
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

  // Si no hay nada seleccionado ni visible, no mostrar nada
  if (!isVisible && itemsEnCarrito.length === 0) return null;

  // 🛒 Botón flotante
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

  // 🔁 Función para traducir valores según la clave JSON
  const traducirValor = (key, value) => {
    if (!value) return "";

    // Normaliza: minúsculas, sin tildes, con guiones bajos
    const normalize = (str) =>
      str
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .trim()
        .replace(/\s+/g, "_");

    let normalizedValue = normalize(value);

    // 🧩 Correcciones de excepciones más comunes
    const reemplazos = {
      "a_la_parrilla": "parrilla",
      "al_vacio": "vacuum",
      "al_horno": "horno",
      "bandeja": "tray",
      "concentrado": "concentrado", // Agregado para consistencia, aunque no estaba en la lista de reemplazos.
      "bolsa": "bag",
      "con_grasa": "con_grasa",
      "sin_grasa": "sin_grasa",
      "con_hueso": "con_hueso",
      "sin_hueso": "sin_hueso",
      "fileteado": "fileteado",
      "en_trozos": "trozos",
      "en_tiras": "tiras",
      "entero": "entero",
      "molido": "molido",
      "fresco": "fresca",
      "curado": "curada",
    };

    if (reemplazos[normalizedValue]) {
      normalizedValue = reemplazos[normalizedValue];
    }

    switch (key) {
      case "tipoCorte":
        return t(
          `detalleProductoModal.sections.presentacion.tipo_corte.options.${normalizedValue}`,
          value
        );
      case "parte":
        return t(
          `detalleProductoModal.sections.presentacion.parte_especifica.options.${normalizedValue}`,
          value
        );
      case "estado":
        return t(
          `detalleProductoModal.sections.estado_producto.estado.options.${normalizedValue}`,
          value
        );
      case "hueso":
        return t(
          `detalleProductoModal.sections.estado_producto.hueso.options.${normalizedValue}`,
          value
        );
      case "grasa":
        return t(
          `detalleProductoModal.sections.empaque_grasa.grasa.options.${normalizedValue}`,
          value
        );
      case "empaque":
        return t(
          `detalleProductoModal.sections.empaque_grasa.empaque.options.${normalizedValue}`,
          value
        );
      case "coccion":
        return t(
          `detalleProductoModal.sections.tipo_coccion.options.${normalizedValue}`,
          value
        );
      default:
        return value;
    }
  };

  // 🧾 Modal del carrito
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
          exit={{ opacity: 0, scaleY: 0, y: 50, transition: { duration: 0.3 } }}
          style={{
            transformOrigin: "bottom",
            maxHeight: "90vh",
            display: "flex",
            flexDirection: "column",
          }}
        >
          {/* Botón de cerrar */}
          <button
            onClick={onToggleVisibility}
            className={`absolute top-3 right-3 p-1 rounded-full transition-colors duration-200 ${
              isDark ? "hover:bg-gray-800" : "hover:bg-gray-100"
            }`}
            title={t("miniCart.close")}
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

          {/* Lista de items */}
          <div
            className="flex flex-col gap-4 px-4 py-4 overflow-y-auto"
            style={{ flexGrow: 1 }}
          >
            {itemsEnCarrito.map((item) => (
              <div
                key={item.id}
                className={clsx(
                  "flex items-start gap-3 border-b border-dashed pb-4 transition-colors duration-300",
                  isDark ? "border-gray-700" : "border-gray-300"
                )}
              >
                <img
                  src={item.imagen}
                  alt={item.nombre}
                  className="w-14 h-14 object-cover rounded-lg flex-shrink-0 shadow-md"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src =
                      "https://placehold.co/80x80/AAAAAA/FFFFFF?text=Item";
                  }}
                />
                <div className="flex-grow min-w-0">
                  <p className="font-semibold text-base leading-tight truncate">
                    {item.nombre}
                  </p>
                  <p className="text-sm text-yellow-500 mt-0.5">
                    {t("miniCart.quantity")}{" "}
                    <span className="font-bold">{item.cantidad}</span>
                  </p>

                  {/*Asegura que item.especificaciones sea un objeto (o vacío) antes de llamar a Object.entries() */}
                  {Object.entries(item.especificaciones || {}).map(
                    ([key, value]) =>
                      value &&
                      key !== "observacion" && (
                        <p
                          key={key}
                          className={`text-xs mt-0.5 truncate ${
                            isDark ? "text-gray-400" : "text-gray-500"
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
                        isDark ? "text-gray-400" : "text-gray-500"
                      }`}
                    >
                      {t("miniCart.obs_prefix")}{" "}
                      {item.especificaciones.observacion}
                    </p>
                  )}
                </div>

                {/* Botones de acción */}
                <div className="flex flex-col gap-1 items-center flex-shrink-0 ml-2">
                  <button
                    onClick={() => onEditItem(item)}
                    className="text-blue-500 hover:text-blue-400 text-sm font-medium transition-colors"
                  >
                    {t("miniCart.edit")}
                  </button>
                  <button
                    onClick={() => onRemoveItem(item.id)}
                    className="text-red-500 hover:text-red-400 transition-colors"
                    title={t("miniCart.delete_title")}
                  >
                    <XMarkIcon className="w-5 h-5" />
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Botón Continuar */}
          <div
            className={clsx(
              "px-4 py-3 border-t flex flex-col gap-2 transition-colors duration-300",
              isDark ? "border-gray-700" : "border-gray-200"
            )}
          >
            <button
              onClick={onContinue}
              className="py-2 rounded-lg font-semibold bg-yellow-500 hover:bg-yellow-400 text-black transition-colors shadow-md"
            >
              {t("miniCart.continue")}
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}