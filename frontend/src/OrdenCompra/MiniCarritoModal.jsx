import React, { useMemo } from "react";
import { useTranslation } from "react-i18next";
import { motion, AnimatePresence } from "framer-motion";
import { useProductosData } from "./productosData";
import { XMarkIcon, ShoppingCartIcon } from "@heroicons/react/24/outline";
import clsx from "clsx";
import { useTheme } from "../Theme/ThemeContext";

export function MiniCarritoModal({
  seleccionados,
  onToggleVisibility = () => {},
  onContinue = () => {},
  onRemoveItem = () => {},
  onEditItem = () => {},
  isVisible,
}) {
  const { t } = useTranslation();
  const { theme } = useTheme();
  const isDark = theme === "dark";

  // Productos pueden venir undefined mientras cargan -> fallback a []
  const { productos } = useProductosData() || {};
  const productosSafe = Array.isArray(productos) ? productos : [];

  // Creamos itemsEnCarrito con useMemo para no recalcular en cada render
  const itemsEnCarrito = useMemo(() => {
    const sel = seleccionados || {};
    // Object.entries sobre {} es seguro
    return Object.entries(sel)
      .map(([idStr, data]) => {
        const id = Number.parseInt(idStr, 10);
        if (Number.isNaN(id)) return null;

        const productoInfo = productosSafe.find((p) => p?.id === id);

        return {
          id,
          nombre: productoInfo?.nombre || t("miniCart.unknown_product"),
          imagen:
            productoInfo?.imagen ||
            "https://placehold.co/80x80/AAAAAA/FFFFFF?text=Item",
          cantidad: data?.cantidad ?? 0,
          especificaciones:
            data && typeof data === "object" ? data.especificaciones : undefined,
          // mantén el resto de campos que necesites del "data" original
          _raw: data,
        };
      })
      .filter(Boolean) // quita nulls por ids inválidos
      .filter((item) => item.cantidad && item.cantidad > 0);
  }, [seleccionados, productosSafe, t]);

  // Si no hay nada seleccionado y no está visible, no renderizamos nada.
  if (!isVisible && itemsEnCarrito.length === 0) return null;

  // Botón flotante cuando hay items pero el modal no está visible
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

  const traducirValor = (key, value) => {
    if (!value) return "";

    const normalize = (str) =>
      String(str)
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .trim()
        .replace(/\s+/g, "_");

    let normalizedValue = normalize(value);

    const reemplazos = {
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
          <button
            onClick={onToggleVisibility}
            className={`absolute top-3 right-3 p-1 rounded-full transition-colors duration-200 ${
              isDark ? "hover:bg-gray-800" : "hover:bg-gray-100"
            }`}
            title={t("miniCart.close")}
          >
            <XMarkIcon className="w-5 h-5 text-gray-500" />
          </button>

          <h3
            className={clsx(
              "text-xl font-bold p-4 border-b transition-colors duration-300",
              isDark ? "border-gray-700" : "border-gray-200"
            )}
          >
            {t("miniCart.title")} ({itemsEnCarrito.length})
          </h3>

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
                    // Handler típico: si falla la carga, ponemos placeholder
                    // e.target puede ser HTMLImageElement
                    // Protegemos con try/catch por seguridad
                    try {
                      e.target.onerror = null;
                      e.target.src =
                        "https://placehold.co/80x80/AAAAAA/FFFFFF?text=Item";
                    } catch (err) {
                      /* noop */
                    }
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

                  {/* Protegemos especificaciones: solo si es objeto y no null */}
                  {item.especificaciones &&
                    typeof item.especificaciones === "object" &&
                    Object.entries(item.especificaciones).map(
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
