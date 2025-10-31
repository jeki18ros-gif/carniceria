// src/components/DetalleProductoModal.jsx
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// Componente funcional en JSX
export function DetalleProductoModal({ producto, onClose, onAddToCart }) {
  // Nuevo estado para el valor numérico de la cantidad
  const [cantidadValor, setCantidadValor] = useState('');
  // Nuevo estado para la unidad de medida (kilos, unidades, etc.)
  const [cantidadUnidad, setCantidadUnidad] = useState('kg');
  const [observacion, setObservacion] = useState('');

  if (!producto) return null;

  const handleAdd = () => {
    // Combinamos el valor y la unidad para pasarlo como un solo string a onAddToCart
    const cantidadCompleta = `${cantidadValor.trim()} ${cantidadUnidad}`;
    
    if (producto.id && cantidadValor.trim()) {
      onAddToCart(producto.id, cantidadCompleta, observacion);
      onClose();
    }
  };

  return (
    <AnimatePresence>
      <motion.div
        // Fondo del modal: usa el color oscuro principal con 70% de opacidad
        className="fixed inset-0 bg-[var(--color-oscuro)]/70 flex items-center justify-center z-50 p-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
      >
        <motion.div
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 50, opacity: 0 }}
          // Contenido del modal: usa el bloque de color claro adaptativo (fondo: cremita/oscuro, texto: oscuro/blanco)
          className="light-block rounded-2xl max-w-4xl w-full p-6 grid grid-cols-1 md:grid-cols-2 gap-6"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Columna de Imagen y Descripción */}
          <div>
            <img 
              src={producto.imagen} 
              alt={producto.nombre} 
              className="w-full h-auto max-h-96 object-contain rounded-xl mb-4" 
            />
            {/* Título: usa el color oscuro principal, que se adapta en dark-mode gracias a 'light-block' */}
            <h2 className="text-3xl font-bold">{producto.nombre}</h2>
            <p className="text-gray-600 mt-2">{producto.descripcion}</p>
            <p className="text-sm text-gray-400 mt-4">La imagen es referencial.</p>
          </div>

          {/* Columna de Formulario y Carrito */}
          <div className="space-y-4">
            {/* Título: usa el color oscuro principal, se adapta automáticamente. Se usa 'border-b' para la línea divisoria. */}
            <h3 className="text-xl font-semibold border-b pb-2">Especificación del Pedido</h3>
            
            {/* Campos de Cantidad y Unidad */}
            <label className="block text-sm font-medium text-gray-700">Cantidad requerida</label>
            <div className="flex space-x-2">
                <input
                    type="number"
                    placeholder="Valor (ej: 5 o 0.5)"
                    value={cantidadValor}
                    onChange={(e) => setCantidadValor(e.target.value)}
                    required
                    min="0.1"
                    step="any"
                    // Color de enfoque (focus) en dorado
                    className="flex-grow border rounded-lg px-4 py-3 text-base focus:ring-[var(--color-dorado)] focus:border-[var(--color-dorado)]"
                />
                <select
                    value={cantidadUnidad}
                    onChange={(e) => setCantidadUnidad(e.target.value)}
                    // Color de enfoque (focus) en dorado
                    className="border rounded-lg px-4 py-3 text-base focus:ring-[var(--color-dorado)] focus:border-[var(--color-dorado)] w-24 sm:w-32"
                >
                    <option value="kg">Kilos (kg)</option>
                    <option value="lb">Libras (lb)</option>
                    <option value="unidad">Unidades</option>
                    <option value="caja">Cajas</option>
                    <option value="paquete">Paquetes</option>
                </select>
            </div>

            <textarea
              placeholder="Observaciones de corte, empacado o detalles extra..."
              value={observacion}
              onChange={(e) => setObservacion(e.target.value)}
              // Color de enfoque (focus) en dorado
              className="w-full border rounded-lg px-4 py-3 text-base min-h-24 focus:ring-[var(--color-dorado)] focus:border-[var(--color-dorado)]"
            />

            <button
              onClick={handleAdd}
              disabled={!cantidadValor.trim()}
              // Se usa la clase 'btn' para aplicar los estilos de botón dorado adaptativo
              className="w-full py-3 font-bold transition-all disabled:opacity-50 btn"
            >
              Añadir a la Orden
            </button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}