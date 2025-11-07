// src/components/ListaProductos.jsx
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircleIcon } from '@heroicons/react/24/outline';
import clsx from 'clsx';
import { useProductosData } from './productosData'; // ✅ Importación correcta
import "../styles/ListaProductos.css";

// --------------------------------------------------------------------------
// COMPONENTE: CATEGORÍAS PRINCIPALES
const CategoriasPrincipales = ({ categoriasPrincipales, onSelectCategory, activeCategory }) => {
    const { t } = useTranslation();

    const categoriaVerTodo = categoriasPrincipales.find(c => c.filtro === 'Todos');
    const categoriasVisibles = categoriasPrincipales.filter(c => c.filtro !== 'Todos');

    const filtroToKey = {
        Res: 'res',
        Cerdo: 'cerdo',
        Pollo: 'pollo',
        Embutido: 'embutidos',
        Ahumado: 'ahumados',
        Especial: 'especiales',
    };

    return (
        <div className="medium-block mb-10 p-4 rounded-xl shadow-inner">
            <div className="flex justify-start sm:justify-center overflow-x-auto pb-4 space-x-4 sm:space-x-8">
                {/* 🔸 Botón "Ver Todo" */}
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
                        <p className="mt-2 text-sm font-medium">{t('listaProductos.filters.ver_todo')}</p>
                    </motion.div>
                )}

                {/* 🔸 Categorías individuales */}
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
                        <p className="mt-2 text-sm font-medium">
                            {t(`productosData.categories.${filtroToKey[categoria.filtro] || 'res'}`)}
                        </p>
                    </motion.div>
                ))}
            </div>
        </div>
    );
};

// --------------------------------------------------------------------------
// COMPONENTE: LISTA DE PRODUCTOS
export function ListaProductos({ onSelectProduct, selectedProducts = [], searchTerm = '' }) {
    const { t } = useTranslation();
    const [categoriaSeleccionada, setCategoriaSeleccionada] = useState('Todos');
    const [hoveredProduct, setHoveredProduct] = useState(null);

    // ✅ Obtener los datos del hook
    const { categoriasPrincipales, productos } = useProductosData();

    const normalizedSearchTerm = searchTerm.toLowerCase().trim();

    const filtroToKey = {
        Res: 'res',
        Cerdo: 'cerdo',
        Pollo: 'pollo',
        Embutido: 'embutidos',
        Ahumado: 'ahumados',
        Especial: 'especiales',
    };

    const getDisplayCategory = (categoria) => {
        const key = filtroToKey[categoria];
        return key ? t(`listaProductos.categories.${key}`) : t('listaProductos.headers.producto');
    };

    // 🔍 Filtrar productos
    const productosFiltrados = productos.filter(producto => {
        const categoriaMatch = categoriaSeleccionada === 'Todos' || producto.categoria === categoriaSeleccionada;
        const searchMatch = normalizedSearchTerm === '' || 
            producto.nombre.toLowerCase().includes(normalizedSearchTerm) ||
            producto.descripcion.toLowerCase().includes(normalizedSearchTerm) ||
            (producto.tipoCorte || '').toLowerCase().includes(normalizedSearchTerm) || 
            getDisplayCategory(producto.categoria).toLowerCase().includes(normalizedSearchTerm);
        return categoriaMatch && searchMatch;
    });

    const isProductSelected = (producto) => selectedProducts.some(p => p.id === producto.id);
    const showCategories = normalizedSearchTerm === '';

    return (
        <div>
            {/* CATEGORÍAS */}
            {showCategories && (
                <CategoriasPrincipales 
                    categoriasPrincipales={categoriasPrincipales}
                    onSelectCategory={setCategoriaSeleccionada}
                    activeCategory={categoriaSeleccionada}
                />
            )}

            {/* TÍTULO */}
            <h2 className="text-2xl font-bold text-center mb-6">
                {normalizedSearchTerm !== '' 
                    ? t('listaProductos.results_for', { term: searchTerm })
                    : categoriaSeleccionada === 'Todos' 
                        ? t('listaProductos.all_products')
                        : getDisplayCategory(categoriaSeleccionada)}
            </h2>

            {/* SIN RESULTADOS */}
            {productosFiltrados.length === 0 ? (
                <p className="text-center text-gray-500">{t('listaProductos.empty')}</p>
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
                                {/* 🔘 INDICADOR DE SELECCIÓN */}
                                {isSelected && (
                                    <CheckCircleIcon className="absolute top-2 right-2 h-6 w-6 text-[var(--color-dorado)] bg-white/70 dark:bg-gray-900/70 rounded-full p-0.5 z-10" />
                                )}

                                {/* 🖼️ IMAGEN */}
                                <div className="relative">
                                    <img 
                                        src={producto.imagen} 
                                        alt={producto.nombre} 
                                        className="w-full h-40 object-cover" 
                                    />
                                    <div className="absolute top-2 left-2 flex flex-col gap-1">
                                        {producto.fresco && <span className="bg-green-500 text-white text-xs px-2 py-0.5 rounded-full">{t('listaProductos.badges.fresco')}</span>}
                                        {producto.conHueso && <span className="bg-red-500 text-white text-xs px-2 py-0.5 rounded-full">{t('listaProductos.badges.con_hueso')}</span>}
                                        {producto.sinHueso && <span className="bg-blue-500 text-white text-xs px-2 py-0.5 rounded-full">{t('listaProductos.badges.sin_hueso')}</span>}
                                    </div>
                                </div>

                                {/* 📦 INFO PRINCIPAL */}
                                <div className="p-4 text-center">
                                    <p className="text-xs text-gray-500 uppercase">
                                        {getDisplayCategory(producto.categoria)}
                                    </p>
                                    <h3 className="text-lg font-semibold mt-1 truncate">
                                        {producto.nombre}
                                    </h3>
                                </div>

                                {/* 🧾 MINI RESUMEN (hover) */}
                                <AnimatePresence>
                                    {isHovered && (
                                        <motion.div
                                            initial={{ opacity: 0, y: 10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            exit={{ opacity: 0, y: 10 }}
                                            className="absolute inset-0 bg-black/70 text-white p-3 rounded-2xl flex flex-col justify-center items-start z-20"
                                        >
                                            <p className="text-sm mb-1"><strong>{t('listaProductos.labels.corte')}</strong> {producto.tipoCorte || t('listaProductos.na')}</p>
                                            <p className="text-sm mb-1"><strong>{t('listaProductos.labels.empaque')}</strong> {producto.empaque || t('listaProductos.na')}</p>
                                            <p className="text-sm mb-1"><strong>{t('listaProductos.labels.peso_aprox')}</strong> {producto.peso || t('listaProductos.na')}</p>
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
