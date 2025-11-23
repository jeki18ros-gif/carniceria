import React, { useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useTranslation } from "react-i18next";
import { Bars3Icon, XMarkIcon } from "@heroicons/react/24/outline";
import imgRes from "../assets/otros3.jpg";
import imgCerdo from "../assets/otros4.jpg";
import imgPollo from "../assets/otros5.jpg";
import imgCordero from "../assets/otros6.jpg";
import imgOtros from "../assets/relleno7.jpg";
import "../styles/Menu.css";

export default function MenuGrid() {
  const { t } = useTranslation();
  const [active, setActive] = useState("todos");
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // Mapeo de imágenes locales con las claves del JSON
  const IMAGES = {
    res: imgRes,
    cerdo: imgCerdo,
    pollo: imgPollo,
    cordero: imgCordero,
    otros: imgOtros,
  };
  const CATEGORIES = Object.keys(t("menu.categories", { returnObjects: true }) || {});
const handleCategoryClick = (catKey) => {
    setActive(catKey);
    setIsMenuOpen(false); // Cierra el menú al seleccionar una categoría
  };
  // Generamos los productos según el idioma
  const PRODUCTS = useMemo(() => {
    const items = t("menu.items", { returnObjects: true }) || {}; 

    // Object.entries() ahora recibe un objeto seguro
    return Object.entries(items).map(([key, value], i) => ({
      id: i + 1,
      category: key,
      title: value?.title,
      desc: value?.description,
      // Aseguramos que 'chips' sea un array (o vacío) para el map en ProductCard
      chips: value?.chips || [], 
      img: IMAGES[key],
    }));
  }, [t]);

  // Filtro por categoría activa
  const list = useMemo(() => {
    const safeProducts = PRODUCTS || []; 
    
    if (active === "todos") return safeProducts;
    return safeProducts.filter((p) => p.category === active);
  }, [active, PRODUCTS]);

return (
    <motion.section
      id="productos"
      className="menu-section py-10 transition-colors duration-700"
      initial={{ y: 40, opacity: 0 }}
      whileInView={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: "easeOut", type: "tween" }}
      viewport={{ once: true, amount: 0.2 }}
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center mt-20 relative"> {/* Añadimos 'relative' para el menú */}
        {/* Título principal */}
        <h2 className="text-3xl sm:text-5xl md:text-6xl font-extrabold mb-10 sm:mb-12 uppercase tracking-wide">
          {t("menu.title")}
        </h2>

        {/* CONTENEDOR DE CATEGORÍAS */}
        <div className="mb-12 relative">
          
          {/* 1. BOTONES EN ESCRITORIO (sm:flex) */}
          <div className="hidden sm:flex flex-wrap justify-center gap-4 px-2 sm:px-0">
            {CATEGORIES.map((catKey) => {
              const catLabel = t(`menu.categories.${catKey}`);
              const isActive = catKey === active;
              return (
<button
          key={catKey}
          onClick={() => setActive(catKey)}
          className={`min-w-[7rem] px-4 py-2 text-sm font-bold uppercase tracking-wide rounded-full transition-all duration-300 focus:outline-none border-yellow-500
            ${
              isActive
                ? "bg-gradient-to-r from-yellow-400 to-yellow-500 text-black border-yellow-888 scale-105 shadow-md"
                : "bg-white/50 text-gray-800 border-transparent hover:bg-yellow-400/80 hover:text-black dark:bg-transparent dark:text-gray-200 dark:border-yellow-500 dark:hover:bg-yellow-500 dark:hover:text-black"
            }`}
        >
          {catLabel}
        </button>

              );
            })}
          </div>
          
          {/* 2. BOTÓN HAMBURGUESA EN MÓVIL (sm:hidden) */}
          <div className="flex sm:hidden justify-center">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="inline-flex items-center gap-2 rounded-full px-5 py-2 text-sm font-bold uppercase tracking-wide transition-all duration-300 shadow-md
                bg-gradient-to-r from-yellow-400 to-yellow-500 text-black hover:scale-105"
            >
              <span>{t(`menu.categories.${active}`)}</span>
              {isMenuOpen ? (
                <XMarkIcon className="h-5 w-5" />
              ) : (
                <Bars3Icon className="h-5 w-5" />
              )}
            </button>
          </div>

          {/* 3. DROPDOWN DE CATEGORÍAS MÓVIL */}
          <AnimatePresence>
            {isMenuOpen && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="absolute top-full left-1/2 -translate-x-1/2 mt-3 w-4/5 max-w-xs p-2 rounded-xl shadow-2xl z-20 
                  bg-white dark:bg-[#1f1f1f] border border-gray-200 dark:border-gray-700"
              >
                <div className="flex flex-col gap-1">
                  {CATEGORIES.map((catKey) => {
                    const catLabel = t(`menu.categories.${catKey}`);
                    const isActive = catKey === active;
                    return (
                      <button
                        key={catKey}
                        onClick={() => handleCategoryClick(catKey)}
                        className={`text-center py-2 px-4 rounded-lg text-sm font-semibold transition-colors
                          ${
                            isActive
                              ? "bg-yellow-400 text-black"
                              : "text-gray-800 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
                          }`}
                      >
                        {catLabel}
                      </button>
                  );
                  })}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
        {/* Rejilla de productos */}
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-6 md:gap-8">
          {list.map((p) => (
            <ProductCard key={p.id} p={p} />
          ))}
        </div>
      </div>
    </motion.section>
  );
}

// Tarjeta individual de producto
function ProductCard({ p }) {
  return (
    <article className="h-full product-card">
      <div
        className="h-full flex flex-col overflow-hidden rounded-3xl ring-3 ring-black/2 
        hover:ring-yellow-400 transition-all duration-500 ease-out
        transform hover:-translate-y-1 hover:scale-[1.02] shadow-sm hover:shadow-xl"
      >
        {/* Imagen */}
        <div className="aspect-[4/3] overflow-hidden">
          <img
            src={p.img}
            alt={p.title}
            className="h-full w-full object-cover transition-transform duration-700 hover:scale-110"
            loading="lazy"
          />
        </div>

        {/* Texto */}
        <div className="p-6 space-y-4 text-left flex flex-col flex-grow">
          <h3 className="text-xl font-extrabold uppercase tracking-widest text-gray-900">
            {p.title}
          </h3>
          <p className="text-base text-gray-600">{p.desc}</p>

          {/* Chips */}
          <div className="flex flex-wrap gap-2 pt-3 mt-auto">
            {/* Protección local en caso de que PRODUCTS fallara: */}
            {(p.chips || []).map((c, i) => (
              <span
                key={i}
                className="chip inline-flex items-center rounded-full px-3 py-1 text-xs font-bold uppercase tracking-wider shadow-sm transition-transform duration-300 hover:scale-105"
              >
                {c}
              </span>
            ))}
          </div>
        </div>
      </div>
    </article>
  );
}