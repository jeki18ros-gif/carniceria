// src/components/DetalleProductoModal.jsx
import React, { useState, useEffect, useRef } from 'react';
import { useTheme } from "../Theme/ThemeContext";
import { motion, AnimatePresence } from 'framer-motion';
import { XMarkIcon } from '@heroicons/react/24/solid';
import '../styles/DetalleProductoModal.css';

// Ya no necesitamos la prop themeMode, la detectamos internamente
export function DetalleProductoModal({ producto, onClose, onAddToCart }) {
  const [cantidadValor, setCantidadValor] = useState('');
  const [cantidadUnidad, setCantidadUnidad] = useState('kg');
  const [observacion, setObservacion] = useState('');
  const [error, setError] = useState(false);
  const inputRef = useRef(null);

  const { theme } = useTheme(); // "light" o "dark"

// Enfocar el input cuando se abre el modal
useEffect(() => {
  if (producto && inputRef.current) {
    inputRef.current.focus();
  }
}, [producto]);


  // Permitir cierre con tecla Escape
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  if (!producto) return null;

  const handleAdd = () => {
    if (!cantidadValor.trim()) {
      setError(true);
      return;
    }

    const cantidadCompleta = `${cantidadValor.trim()} ${cantidadUnidad}`;
    if (producto.id) {
      onAddToCart(producto.id, cantidadCompleta, observacion);
      onClose();
    }
  };

  const cantidadInputClasses = `flex-grow transition-all ${
    error ? 'input-error' : 'input-normal'
  }`;

  return (
    <AnimatePresence>
      <motion.div
        role="dialog"
        aria-modal="true"
        aria-label={`Detalles del producto ${producto.nombre}`}
      className={`detalle-modal-overlay fixed inset-0 flex items-center justify-center z-50 p-4 ah-theme ${
  theme === 'dark' ? 'dark-mode' : 'light-mode'
}`}     
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
      >
        <motion.div
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 50, opacity: 0 }}
          onClick={(e) => e.stopPropagation()}
          className="detalle-modal relative max-w-5xl w-full overflow-hidden grid grid-cols-1 md:grid-cols-2 gap-6 p-6 md:p-8"
        >
          {/* Botón de cierre */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-gray-500 hover:text-dorado transition-colors"
            aria-label="Cerrar modal"
          >
            <XMarkIcon className="w-6 h-6" />
          </button>

          {/* Columna Izquierda: Imagen y Descripción */}
          <div className="flex flex-col items-center md:items-start text-center md:text-left space-y-4">
            <div className="w-full flex justify-center">
              <img
                src={producto.imagen}
                alt={producto.nombre}
                className="w-full max-w-sm h-auto max-h-96 object-contain rounded-2xl shadow-md"
              />
            </div>

            <div>
              <h2 className="text-3xl font-bold text-dorado tracking-wide mb-2">
                {producto.nombre}
              </h2>
              <p className="text-base leading-relaxed">
                {producto.descripcion}
              </p>
              <p className="text-xs mt-3 italic">
                La imagen es referencial.
              </p>
            </div>
          </div>

          {/* Columna Derecha: Formulario */}
          <div className="flex flex-col justify-between space-y-5">
            <div>
              <h3 className="text-xl font-semibold border-b pb-2 mb-4">
                Especificación del Pedido
              </h3>

              {/* Cantidad */}
              <label htmlFor="cantidad" className="block text-sm font-medium mb-1">
                Cantidad requerida
              </label>
              <div className="flex space-x-3">
                <input
                  ref={inputRef}
                  id="cantidad"
                  type="number"
                  placeholder="Ej: 2 o 0.5"
                  value={cantidadValor}
                  onChange={(e) => {
                    setCantidadValor(e.target.value);
                    if (e.target.value.trim()) setError(false);
                  }}
                  min="0.1"
                  step="any"
                  aria-invalid={error}
                  className={cantidadInputClasses}
                />
                <select
                  value={cantidadUnidad}
                  onChange={(e) => setCantidadUnidad(e.target.value)}
                  className="w-32"
                >
                  <option value="kg">Kilos (kg)</option>
                  <option value="lb">Libras (lb)</option>
                  <option value="unidad">Unidades</option>
                  <option value="caja">Cajas</option>
                  <option value="paquete">Paquetes</option>
                </select>
              </div>
              {error && (
                <p className="text-sm text-red-500 mt-1">
                  ⚠️ Por favor, indica una cantidad válida.
                </p>
              )}

              {/* Observaciones */}
              <label htmlFor="observacion" className="block text-sm font-medium mt-4 mb-1">
                Observaciones (opcional)
              </label>
              <textarea
                id="observacion"
                placeholder="Indica detalles de corte, empacado u otras preferencias..."
                value={observacion}
                onChange={(e) => setObservacion(e.target.value)}
                className="w-full min-h-24 resize-none"
              />
            </div>

            {/* Botón */}
            <motion.button
              onClick={handleAdd}
              whileTap={{ scale: 0.95 }}
              className="w-full py-3 text-lg boton-dorado disabled:opacity-60 disabled:cursor-not-allowed"
              disabled={error || !cantidadValor.trim()}
            >
              Añadir a la Orden
            </motion.button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}