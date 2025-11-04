// src/components/ListaProductos.jsx
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircleIcon, InformationCircleIcon } from '@heroicons/react/24/outline'; 
import clsx from 'clsx'; 
import { productos, categoriasPrincipales } from './productosData'; 
import "../styles/ListaProductos.css"; 

// --------------------------------------------------------------------------
// COMPONENTE: CATEGORÍAS PRINCIPALES
const CategoriasPrincipales = ({ onSelectCategory, activeCategory }) => {
    const categoriaVerTodo = categoriasPrincipales.find(c => c.filtro === 'Todos');
    const categoriasVisibles = categoriasPrincipales.filter(c => c.filtro !== 'Todos');

    return (
        <div className="medium-block mb-10 p-4 rounded-xl shadow-inner">
            <div className="flex justify-start sm:justify-center overflow-x-auto pb-4 space-x-4 sm:space-x-8">
                {categoriaVerTodo && (
                    <motion.div
                        whileHover={{ scale: 1.05 }}
                        onClick={() => onSelectCategory('Todos')}
                        className={clsx(
                            "flex-shrink-0 text-center cursor-pointer transition-transform duration-200",
                            activeCategory === 'Todos' ? 'opacity-100 scale-105' : 'opacity-70'
                        )}
                    >
                        <div className={clsx(
                            "w-16 h-16 sm:w-20 sm:h-20 rounded-full overflow-hidden mx-auto border-4 shadow-md",
                            activeCategory === 'Todos' ? 'border-[var(--color-dorado)]' : 'border-transparent'
                        )}>
                            <img 
                                src={categoriaVerTodo.imagen} 
                                alt={categoriaVerTodo.nombre} 
                                className="w-full h-full object-cover" 
                            />
                        </div>
                        <p className="mt-2 text-sm font-medium">Ver todo</p>
                    </motion.div>
                )}

                {categoriasVisibles.map((categoria) => (
                    <motion.div
                        key={categoria.id}
                        whileHover={{ scale: 1.05 }}
                        onClick={() => onSelectCategory(categoria.filtro)}
                        className={clsx(
                            "flex-shrink-0 text-center cursor-pointer transition-transform duration-200",
                            activeCategory === categoria.filtro ? 'opacity-100 scale-105' : 'opacity-70'
                        )}
                    >
                        <div className={clsx(
                            "w-16 h-16 sm:w-20 sm:h-20 rounded-full overflow-hidden mx-auto border-4 shadow-md",
                            activeCategory === categoria.filtro ? 'border-[var(--color-dorado)]' : 'border-transparent'
                        )}>
                            <img 
                                src={categoria.imagen} 
                                alt={categoria.nombre} 
                                className="w-full h-full object-cover" 
                            />
                        </div>
                        <p className="mt-2 text-sm font-medium">{categoria.nombre}</p>
                    </motion.div>
                ))}
            </div>
        </div>
    );
};

// --------------------------------------------------------------------------
// COMPONENTE: LISTA DE PRODUCTOS
export function ListaProductos({ onSelectProduct, selectedProducts = [] }) {
    const [categoriaSeleccionada, setCategoriaSeleccionada] = useState('Todos');
    const [hoveredProduct, setHoveredProduct] = useState(null);

    const productosFiltrados = productos.filter(producto => 
        categoriaSeleccionada === 'Todos' || producto.categoria === categoriaSeleccionada
    );

    const getDisplayCategory = (categoria) => {
        switch (categoria) {
            case 'Res': return 'CARNE DE RES';
            case 'Cerdo': return 'CARNE DE CERDO';
            case 'Pollo': return 'CARNE DE POLLO';
            case 'Embutido': return 'EMBUTIDOS';
            case 'Ahumado': return 'AHUMADOS';
            case 'Especial': return 'CARNES ESPECIALES';
            default: return 'PRODUCTO';
        }
    };

    const isProductSelected = (producto) => 
        selectedProducts.some(p => p.id === producto.id);

    return (
        <div>
            <CategoriasPrincipales 
                onSelectCategory={setCategoriaSeleccionada}
                activeCategory={categoriaSeleccionada}
            />

            <h2 className="text-2xl font-bold text-center mb-6">
                {categoriaSeleccionada === 'Todos' 
                    ? 'Todos los Productos' 
                    : getDisplayCategory(categoriaSeleccionada)}
            </h2>

            {productosFiltrados.length === 0 ? (
                <p className="text-center text-gray-500">
                    No se encontraron productos en esta categoría.
                </p>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6 mb-10">
                    {productosFiltrados.map((producto) => {
                        const isSelected = isProductSelected(producto);
                        const isHovered = hoveredProduct?.id === producto.id;

                        return (
                            <motion.div
                                key={producto.id}
                                whileHover={{ scale: 1.05, boxShadow: '0 0 20px rgba(212,175,55,0.4)' }}
                                whileTap={{ scale: 0.98 }} 
                                onClick={() => onSelectProduct(producto)}
                                onMouseEnter={() => setHoveredProduct(producto)}
                                onMouseLeave={() => setHoveredProduct(null)}
                                className={clsx(
                                    "light-block rounded-2xl shadow-lg overflow-hidden border-2 border-transparent cursor-pointer transition-all duration-300 relative",
                                    isSelected 
                                        ? "border-[var(--color-dorado)] shadow-[0_0_20px_rgba(212,175,55,0.7)]" 
                                        : "hover:border-[var(--color-dorado)] hover:shadow-xl"
                                )}
                            >
                                {/* INDICADOR DE SELECCIÓN */}
                                {isSelected && (
                                    <CheckCircleIcon className="absolute top-2 right-2 h-6 w-6 text-[var(--color-dorado)] bg-white/70 dark:bg-gray-900/70 rounded-full p-0.5 z-10" />
                                )}

                                {/* IMAGEN */}
                                <div className="relative">
                                    <img 
                                        src={producto.imagen} 
                                        alt={producto.nombre} 
                                        className="w-full h-40 object-cover" 
                                    />
                                    {/* BADGES */}
                                    <div className="absolute top-2 left-2 flex flex-col gap-1">
                                        {producto.fresco && <span className="bg-green-500 text-white text-xs px-2 py-0.5 rounded-full">Fresco</span>}
                                        {producto.conHueso && <span className="bg-red-500 text-white text-xs px-2 py-0.5 rounded-full">Con Hueso</span>}
                                        {producto.sinHueso && <span className="bg-blue-500 text-white text-xs px-2 py-0.5 rounded-full">Sin Hueso</span>}
                                    </div>
                                </div>

                                {/* INFO PRINCIPAL */}
                                <div className="p-4 text-center">
                                    <p className="text-xs text-gray-500 uppercase">
                                        {getDisplayCategory(producto.categoria)}
                                    </p>
                                    <h3 className="text-lg font-semibold mt-1 truncate">
                                        {producto.nombre}
                                    </h3>
                                </div>

                                {/* MINI RESUMEN (hover) */}
                                <AnimatePresence>
                                    {isHovered && (
                                        <motion.div
                                            initial={{ opacity: 0, y: 10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            exit={{ opacity: 0, y: 10 }}
                                            className="absolute inset-0 bg-black/70 text-white p-3 rounded-2xl flex flex-col justify-center items-start z-20"
                                        >
                                            <p className="text-sm mb-1"><strong>Corte:</strong> {producto.tipoCorte || 'N/A'}</p>
                                            <p className="text-sm mb-1"><strong>Empaque:</strong> {producto.empaque || 'N/A'}</p>
                                            <p className="text-sm mb-1"><strong>Peso aprox:</strong> {producto.peso || 'N/A'}</p>
                                            <p className="text-xs mt-2 italic">{producto.descripcion}</p>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </motion.div>
                        );
                    })}
                </div>
            )}
        </div>
    );
}
