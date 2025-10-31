import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
// Asegúrate que las rutas para Seleccion y productos sean correctas en tu proyecto
import { productos } from './ListaProductos';// Asume que Seleccion y productos están disponibles
import { XMarkIcon, ShoppingCartIcon } from '@heroicons/react/24/outline';


// NOTA: Se ha renombrado 'onClose' a 'onToggleVisibility' para reflejar
// que esta función se usa para abrir O cerrar el sidebar, dependiendo del contexto.
export function MiniCarritoModal({ seleccionados, onToggleVisibility, onContinue, onRemoveItem, isVisible }) {
    // La lógica para obtener los ítems sigue siendo la misma
    const itemsEnCarrito = Object.entries(seleccionados).map(([idStr, data]) => {
        const id = parseInt(idStr);
        // Usamos la función find en el array de productos importado
        const productoInfo = productos.find(p => p.id === id); 
        return {
            id,
            nombre: productoInfo?.nombre || 'Producto Desconocido',
            imagen: productoInfo?.imagen || '',
            ...data, // Esto incluye 'cantidad' y 'observacion'
        };
    }).filter(item => item.cantidad); // Filtra los items que no tienen cantidad especificada

    // Si no hay ítems, no renderizamos nada, ni siquiera el botón flotante.
    if (itemsEnCarrito.length === 0) return null;

    // ----------------------------------------------------------------------
    // 1. Botón Flotante para REABRIR (Siempre visible si hay productos y está oculto)
    // ----------------------------------------------------------------------
    if (!isVisible) {
        return (
            <motion.button
                // Usamos la clase 'btn' para el estilo dorado adaptativo
                onClick={onToggleVisibility} 
                className="fixed bottom-6 right-6 p-4 rounded-full shadow-xl z-50 flex items-center space-x-2 btn"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
            >
                <ShoppingCartIcon className="w-6 h-6" />
                <span className="font-bold hidden sm:inline">Tu Orden</span>
                <span className="inline-flex items-center justify-center ml-1 w-6 h-6 text-xs font-bold text-white bg-red-500 rounded-full">
                    {itemsEnCarrito.length}
                </span>
            </motion.button>
        );
    }

    // ----------------------------------------------------------------------
    // 2. Panel Lateral (Mini Carrito)
    // ----------------------------------------------------------------------
    return (
        <AnimatePresence>
            <motion.div
                className="fixed inset-y-0 right-0 z-50 flex justify-end pointer-events-none" 
            >
                {/* Modal del Carrito (Ahora un Sidebar) */}
                <motion.div
                    // Usa 'light-block' para el fondo adaptable (cremita/oscuro) y el color de texto
                    className="light-block h-full w-full max-w-xs shadow-2xl p-6 flex flex-col pointer-events-auto"
                    initial={{ x: '100%' }}
                    animate={{ x: 0 }}
                    exit={{ x: '100%' }}
                    transition={{ type: "tween", duration: 0.3 }}
                >
                    <div className="flex justify-between items-center border-b pb-4">
                        {/* El color del texto se adapta gracias a 'light-block' */}
                        <h3 className="text-xl font-bold">Tu Orden ({itemsEnCarrito.length})</h3>
                        <button 
                            onClick={onToggleVisibility} 
                            // Usa 'hover:medium-block' para el fondo del botón de cerrar y 'text-gray-700' para el ícono
                            className="flex items-center space-x-1 p-1 rounded-lg text-sm text-gray-500 hover:medium-block transition-colors" 
                            aria-label="Ocultar carrito para seguir comprando"
                        >
                            <span>Ocultar</span>
                            <XMarkIcon className="w-5 h-5" />
                        </button>
                    </div>

                    <div className="flex-grow overflow-y-auto py-4 space-y-4">
                        {itemsEnCarrito.map((item) => (
                            <div key={item.id} className="flex items-start gap-3 border-b pb-3">
                                <img 
                                    src={item.imagen} 
                                    alt={item.nombre} 
                                    className="w-12 h-12 object-cover rounded-md flex-shrink-0" 
                                />
                                <div className="flex-grow">
                                    {/* El color del texto se adapta gracias a 'light-block' */}
                                    <p className="font-semibold text-sm leading-tight">{item.nombre}</p>
                                    {/* Usa la variable CSS para el color dorado en la cantidad */}
                                    <p className="text-xs text-gray-500 mt-0.5">
                                        Cantidad: <span className="font-medium text-[var(--color-dorado)]">{item.cantidad}</span>
                                    </p>
                                    {item.observacion && <p className="text-xs text-gray-400 italic mt-0.5 max-w-full overflow-hidden whitespace-nowrap text-ellipsis">Obs: {item.observacion}</p>}
                                </div>
                                <button 
                                    onClick={() => onRemoveItem(item.id)} 
                                    className="text-red-500 hover:text-red-700 p-1 flex-shrink-0"
                                    aria-label={`Eliminar ${item.nombre} de la orden`}
                                >
                                    <XMarkIcon className="w-4 h-4" />
                                </button>
                            </div>
                        ))}
                    </div>

                    <div className="pt-4 border-t">
                        {/* El color del texto se adapta gracias a 'light-block' */}
                        <p className="text-sm text-gray-700 mb-4">
                            *El precio final se calculará y confirmará por nuestros asesores.
                        </p>
                        <button
                            onClick={onContinue}
                            // Estilo de botón oscuro, usando la variable de color principal oscuro
                            className="w-full bg-[var(--color-dark-blue)] hover:opacity-90 text-white py-3 rounded-lg font-bold transition-all"
                        >
                            <span className="text-lg">Finalizar Orden</span>
                        </button>
                    </div>
                </motion.div>
            </motion.div>
        </AnimatePresence>
    );
}
