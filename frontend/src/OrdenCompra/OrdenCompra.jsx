import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { OrdenCompraHeader } from './OrdenCompraHeader';
import { ListaProductos } from './ListaProductos';
import { DetalleProductoModal } from './DetalleProductoModal';
import { MiniCarritoModal } from './MiniCarritoModal';
import { FormularioCliente } from './FormularioCliente';

export default function OrdenDeCompra() {
    const [theme, setTheme] = useState('light');
    const [seleccionados, setSeleccionados] = useState({});
    const [productoSeleccionado, setProductoSeleccionado] = useState(null);
    const [mostrarCarrito, setMostrarCarrito] = useState(false);
    const [view, setView] = useState('productos');
    const [mostrarConfirmacion, setMostrarConfirmacion] = useState(false);

    // 🌓 Detectar modo actual al montar
    useEffect(() => {
        const root = document.documentElement;
        const storedTheme = localStorage.getItem('theme');
        const isDark = storedTheme === 'dark' || root.classList.contains('dark');
        setTheme(isDark ? 'dark' : 'light');
    }, []);

    // ✨ Mantener sincronizado el cambio manual de tema (si el usuario cambia desde header)
    useEffect(() => {
        const observer = new MutationObserver(() => {
            setTheme(document.documentElement.classList.contains('dark') ? 'dark' : 'light');
        });
        observer.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });
        return () => observer.disconnect();
    }, []);

    const toggleMiniCarrito = () => setMostrarCarrito(prev => !prev);
    const handleSelectProduct = (producto) => setProductoSeleccionado(producto);
    const handleAddToCart = (id, cantidad, observacion) => {
        setSeleccionados(prev => ({ ...prev, [id]: { cantidad, observacion } }));
        setMostrarCarrito(true);
        setProductoSeleccionado(null);
    };
    const handleRemoveItem = (id) => {
        setSeleccionados(prev => {
            const nuevo = { ...prev };
            delete nuevo[id];
            if (Object.keys(nuevo).length === 0) setMostrarCarrito(false);
            return nuevo;
        });
    };
    const handleContinueToForm = () => {
        setMostrarCarrito(false);
        setView('formulario');
        window.scrollTo(0, 0);
    };
    const handleSubmitOrder = (e) => {
        e.preventDefault();
        console.log('Orden final enviada:', { seleccionados, datosCliente: '...' });
        setMostrarConfirmacion(true);
    };

    return (
        <div className={`min-h-screen flex flex-col pt-24 sm:pt-28 transition-colors duration-300 ${theme === 'dark' ? 'bg-[#0b132b] text-cream' : 'bg-cream text-[#0b132b]'}`}>
            <OrdenCompraHeader />

            <main className="flex-grow py-10 px-6">
                <div className="max-w-6xl mx-auto">
                    {view === 'productos' && (
                        <>
                            <h2 className="text-3xl font-extrabold mb-8">Elige tus Cortes</h2>
                            <ListaProductos onSelectProduct={handleSelectProduct} />
                        </>
                    )}
                    {view === 'formulario' && (
                        <>
                            <h2 className="text-3xl font-extrabold mb-8">Completa tu Orden</h2>
                            <FormularioCliente onSubmit={handleSubmitOrder} />
                        </>
                    )}
                </div>
            </main>

            <DetalleProductoModal
                producto={productoSeleccionado}
                onClose={() => setProductoSeleccionado(null)}
                onAddToCart={handleAddToCart}
            />

            <MiniCarritoModal
                seleccionados={seleccionados}
                onToggleVisibility={toggleMiniCarrito}
                onContinue={handleContinueToForm}
                onRemoveItem={handleRemoveItem}
                isVisible={mostrarCarrito}
            />

            <AnimatePresence>
                {mostrarConfirmacion && (
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
                            <h3 className="text-xl font-bold mb-2">¡Orden Enviada!</h3>
                            <p className="text-gray-600 dark:text-gray-300 mb-4">
                                Tu solicitud fue enviada con éxito. Nos pondremos en contacto pronto para confirmar tu pedido.
                            </p>
                            <button
                                onClick={() => setMostrarConfirmacion(false)}
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
