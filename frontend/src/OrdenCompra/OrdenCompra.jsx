import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// --- RUTAS CORREGIDAS ---
import { OrdenCompraHeader } from './OrdenCompraHeader'; 
import { ListaProductos } from './ListaProductos'; 
import { DetalleProductoModal } from './DetalleProductoModal'; 
import { MiniCarritoModal } from './MiniCarritoModal'; 
import { FormularioCliente } from './FormularioCliente'; 

export default function OrdenDeCompra() {
    // 1. Estado del Carrito y Producto Detalle
    const [seleccionados, setSeleccionados] = useState({});
    const [productoSeleccionado, setProductoSeleccionado] = useState(null);
    const [mostrarCarrito, setMostrarCarrito] = useState(false); // Determina si el panel lateral está visible

    // 2. Estado de la Vista Principal
    const [view, setView] = useState('productos');
    
    // 3. Estado del Modal de Confirmación de Envío
    const [mostrarConfirmacion, setMostrarConfirmacion] = useState(false);

    // --- Lógica de Toggle (Nueva Función) ---
    const toggleMiniCarrito = () => {
        setMostrarCarrito(prev => !prev);
    };

    // --- Manejo del Carrito/Selección ---
    const handleSelectProduct = (producto) => {
        setProductoSeleccionado(producto);
    };

    const handleAddToCart = (id, cantidad, observacion) => {
        setSeleccionados((prev) => ({ 
            ...prev, 
            [id]: { cantidad, observacion } 
        }));
        setMostrarCarrito(true); // Abrir el carrito después de añadir
        setProductoSeleccionado(null); // Cerrar el modal de detalle del producto
    };

    const handleRemoveItem = (id) => {
        setSeleccionados(prev => {
            const nuevo = { ...prev };
            delete nuevo[id];
            if (Object.keys(nuevo).length === 0) {
                setMostrarCarrito(false);
            }
            return nuevo;
        });
    };

    // --- Manejo del Formulario Final ---
    const handleContinueToForm = () => {
        setMostrarCarrito(false);
        setView('formulario');
        window.scrollTo(0, 0); // Ir al inicio de la página del formulario
    };

    const handleSubmitOrder = (e) => {
        e.preventDefault();
        // Aquí iría la lógica de envío FINAL
        console.log('Orden final enviada:', { seleccionados, datosCliente: '...' });
        setMostrarConfirmacion(true);
    };

    return (
        <div 
            className="min-h-screen flex flex-col pt-24 sm:pt-28"
        >
            <OrdenCompraHeader />

            <main className="flex-grow py-10 px-6">
                <div className="max-w-6xl mx-auto">
                    {/* Contenido principal según la vista */}
                    {view === 'productos' && (
                        <>
                            {/* 2. ELIMINAMOS el color de texto fijo (text-[#0b132b]) */}
                            <h2 className="text-3xl font-extrabold mb-8">Elige tus Cortes</h2>
                            <ListaProductos onSelectProduct={handleSelectProduct} />
                        </>
                    )}

                    {view === 'formulario' && (
                        <>
                            {/* 2. ELIMINAMOS el color de texto fijo (text-[#0b132b]) */}
                            <h2 className="text-3xl font-extrabold mb-8">Completa tu Orden</h2>
                            <FormularioCliente onSubmit={handleSubmitOrder} />
                        </>
                    )}
                </div>
            </main>

            {/* MODALES */}
            
            {/* 1. Modal de Detalle de Producto (No necesita cambios internos, ya se adaptó) */}
            <DetalleProductoModal
                producto={productoSeleccionado}
                onClose={() => setProductoSeleccionado(null)}
                onAddToCart={handleAddToCart}
            />

            {/* 2. Carrito Lateral/Flotante */}
            <MiniCarritoModal
                seleccionados={seleccionados}
                onToggleVisibility={toggleMiniCarrito} 
                onContinue={handleContinueToForm}
                onRemoveItem={handleRemoveItem}
                isVisible={mostrarCarrito} 
            />
            
            {/* 3. Modal de Confirmación Final (Adaptación de estilos) */}
            <AnimatePresence>
                {mostrarConfirmacion && (
                    <motion.div
                        className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                    >
                        <motion.div
                            initial={{ scale: 0.8, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.8, opacity: 0 }}
                            // 3. Reemplazamos 'bg-white' por 'light-block'
                            className="light-block rounded-2xl p-6 shadow-xl text-center max-w-sm mx-4"
                        >
                            {/* 3. Reemplazamos 'text-[#0b132b]' por herencia de color */}
                            <h3 className="text-xl font-bold mb-2">¡Orden Enviada!</h3>
                            {/* 3. Reemplazamos 'text-gray-600' por herencia de color adaptable */}
                            <p className="text-gray-600 dark:text-gray-300 mb-4">
                                Tu solicitud fue enviada con éxito. Nos pondremos en contacto pronto para confirmar tu pedido.
                            </p>
                            <button
                                onClick={() => setMostrarConfirmacion(false)}
                                // 3. Reemplazamos estilos manuales por la clase 'btn'
                                className="px-4 py-2 rounded-lg font-medium transition-all btn"
                            >
                                Cerrar
                            </button>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
