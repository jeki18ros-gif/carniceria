import React, { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { 
    AppWindow, 
    Beef,       
    PiggyBank,  
    Drumstick,  
    Feather,    
    Utensils, 
    Star,       
    Sparkles,   
    Search,     
} from "lucide-react";
// ASUMIMOS QUE ESTAS RUTAS SON CORRECTAS
import imgCerdo from "../assets/otros4.jpg";
import imgPollo from "../assets/otros5.jpg";
import imgCordero from "../assets/otros6.jpg";
import imgOtros from "../assets/relleno7.jpg";
import imgRes from "../assets/otros3.jpg";

// Eliminamos la constante DORADO, usaremos variables CSS
const CATEGORIES = ["TODOS", "RES", "CERDO", "POLLO", "CORDERO", "OTROS"];

const CATEGORY_ICONS = {
    TODOS: AppWindow, 
    RES: Beef,        
    CERDO: PiggyBank, 
    POLLO: Drumstick, 
    CORDERO: Feather, 
    OTROS: Utensils,
};

const PRODUCTS = [
    { id: 1, title: "Lomo Fino", category: "RES", img: imgRes, desc: "Cortes seleccionados, listos para parrilla o brasa.", chips: ["Fresco", "Corte premium"], isFeatured: true },
    { id: 2, title: "Costillas BBQ", category: "CERDO", img: imgCerdo, desc: "Jugosas y tiernas, perfectas para barbecue.", chips: ["Jugoso", "BBQ"], isFeatured: true },
    { id: 3, title: "Pechuga de Pollo", category: "POLLO", img: imgPollo, desc: "Magras y versátiles, ideal para recetas ligeras.", chips: ["Alto en proteína", "Magro"], isFeatured: true },
    { id: 4, title: "Pierna de Cordero", category: "CORDERO", img: imgCordero, desc: "Sabor intenso con textura suave, para ocasiones especiales.", chips: ["Sabor intenso", "Hornéalo lento"] },
    { id: 5, title: "Embutidos", category: "OTROS", img: imgOtros, desc: "Selección curada de embutidos y ahumados.", chips: ["Artesanal", "Ahumado"], isFeatured: true },
    { id: 6, title: "Asado de Tira", category: "RES", img: imgRes, desc: "Clásico para compartir, vetas que se deshacen.", chips: ["Para asar", "Compartir"] },
    { id: 7, title: "Bondiola de Cerdo", category: "CERDO", img: imgCerdo, desc: "Corte tierno, ideal para braseados largos.", chips: ["Braseado", "Tierna"] },
    { id: 8, title: "Alitas de Pollo", category: "POLLO", img: imgPollo, desc: "Ideales para freír o hacer a la parrilla.", chips: ["Rápido", "Snack"] },
];

export default function MenuCarousel() {
    const [active, setActive] = useState("TODOS");
    const doradoVar = "var(--color-dorado)"; // Variable CSS para interpolación en Tailwind

    const list = useMemo(() => {
        let filteredProducts = active === "TODOS" 
            ? PRODUCTS 
            : PRODUCTS.filter((p) => p.category === active);

        const featured = filteredProducts.filter(p => p.isFeatured);
        const others = filteredProducts.filter(p => !p.isFeatured);
        
        // Duplicar la lista para crear un efecto de carrusel infinito suave.
        return [...featured, ...others, ...featured, ...others];
    }, [active]);

    return (
        <section id="productos" className="relative py-24 light-block transition-all duration-700"> 
            <div className="mx-auto max-w-7xl px-6 lg:px-8 text-center">
                <h2 className="text-4xl sm:text-5xl font-extrabold text-gray-900 dark:text-white mb-14 uppercase tracking-widest">
                    Nuestra Selección Destacada 
                    {/* Reemplazado text-yellow-500 con text-dorado */}
                    <Star className="inline-block w-8 h-8 ml-2 text-dorado align-text-bottom" />
                </h2>

                {/* Categorías con iconos */}
                <div className="mb-14 flex flex-wrap justify-center gap-4">
                    {CATEGORIES.map((cat) => {
                        const isActive = cat === active;
                        const Icon = CATEGORY_ICONS[cat]; 
                        return (
                            <motion.button
                                key={cat}
                                onClick={() => setActive(cat)}
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.95 }}
                                className={`px-6 py-2 text-sm font-semibold uppercase tracking-wide rounded-full shadow-sm transition-all duration-300 border
                                    ${isActive
                                        ? `bg-[${doradoVar}] text-black border-[${doradoVar}]` // Botón activo: Fondo dorado, texto negro
                                        : "bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-100 border-gray-200 dark:border-gray-700 hover:border-[var(--color-dorado)] hover:text-[var(--color-dorado)]" // Botón inactivo: Borde y texto dorado al hover
                                    }`}
                            >
                                <div className="flex items-center gap-2 justify-center">
                                    {Icon && <Icon className="w-5 h-5" />} 
                                    <span>{cat}</span>
                                </div>
                            </motion.button>
                        );
                    })}
                </div>

                {/* Carrusel */}
                <div className="group relative overflow-hidden">
                    <style>{`
                        @keyframes scrollX {
                            from { transform: translateX(0); }
                            to { transform: translateX(-50%); }
                        }
                    `}</style>
                    <div className="flex gap-8 motion-safe:animate-[scrollX_30s_linear_infinite] group-hover:[animation-play-state:paused] pb-4">
                        {list.map((p, idx) => (
                            <ProductCard key={`${p.id}-${idx}`} p={p} doradoVar={doradoVar} />
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
}

// Componente ProductCard MEJORADO
function ProductCard({ p, doradoVar }) {
    return (
        <motion.a
            href={`/productos/${p.id}`} 
            className="min-w-[75%] sm:min-w-[55%] md:min-w-[40%] lg:min-w-[28%] xl:min-w-[25%] block group"
            whileHover={{ y: -8, scale: 1.03 }} 
            transition={{ type: "spring", stiffness: 200, damping: 20 }}
            aria-label={`Ver detalles de ${p.title}`}
        >
            <div className={`overflow-hidden rounded-3xl bg-white dark:bg-gray-800 
                            shadow-xl dark:shadow-2xl 
                            ring-2 ring-gray-100 dark:ring-gray-700 
                            hover:ring-4 hover:ring-offset-2 hover:ring-[${doradoVar}] 
                            hover:ring-offset-white dark:hover:ring-offset-gray-800 
                            transition-all duration-300 ease-in-out`}>
                
                {/* Sección de la Imagen */}
                <div className="aspect-[4/3] overflow-hidden relative">
                    <img
                        src={p.img}
                        alt={p.title}
                        className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110" 
                        loading="lazy"
                    />
                    
                    {/* Overlay y efecto de Zoom/Lupa MEJORADO */}
                    <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-all duration-300"></div> 

                    {/* Icono destacado MEJORADO */}
                    {p.isFeatured && (
                        <span className={`absolute top-4 right-4 flex items-center gap-1 
                                        bg-[${doradoVar}] text-black 
                                        text-sm font-black px-4 py-1 rounded-full shadow-lg 
                                        uppercase tracking-wider rotate-[3deg] border border-[${doradoVar}]/50`}>
                            {/* Reemplazado text-amber-900 con text-black o un color oscuro fijo */}
                            <Star className="w-4 h-4 text-black" /> 
                            DESTACADO
                        </span>
                    )}

                    {/* Icono lupa al hover con efecto de cristal (backdrop-blur) */}
                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                        <div className="p-3 bg-white/30 backdrop-blur-sm rounded-full border-2 border-white/50">
                            <Search className="w-8 h-8 text-white" /> 
                        </div>
                    </div>
                </div>

                {/* Sección de Contenido */}
                <div className="p-6 space-y-3 text-left">
                    {/* El color de texto se hereda de light-block */}
                    <h3 className="text-3xl font-extrabold uppercase tracking-widest text-gray-900 dark:text-white leading-tight">
                        {p.title}
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-300 line-clamp-2">{p.desc}</p>

                    {/* Chips MEJORADOS */}
                    <div className="flex flex-wrap gap-2 pt-2">
                        {p.chips.map((c, i) => (
                            <span
                                key={i}
                                className={`inline-flex items-center gap-1 rounded-full 
                                            bg-[${doradoVar}]/20 dark:bg-[${doradoVar}]/30 text-dorado 
                                            px-3 py-1 text-xs font-semibold uppercase tracking-wider 
                                            shadow-inner hover:scale-105 transition-transform`}
                            >
                                {/* Reemplazado text-yellow-600 dark:text-yellow-300 con text-dorado */}
                                <Sparkles className="w-3 h-3 text-dorado" /> 
                                {c}
                            </span>
                        ))}
                    </div>
                </div>
            </div>
        </motion.a>
    );
}