import React, { useMemo, useState } from "react";
import { motion } from "framer-motion";
import imgRes from "../assets/otros3.jpg";
import imgCerdo from "../assets/otros4.jpg";
import imgPollo from "../assets/otros5.jpg";
import imgCordero from "../assets/otros6.jpg";
import imgOtros from "../assets/relleno7.jpg";


const CATEGORIES = ["TODOS", "RES", "CERDO", "POLLO", "CORDERO", "OTROS"];

const PRODUCTS = [
  { id: 1, title: "Carne de Res", category: "RES", img: imgRes, desc: "Cortes seleccionados, listos para parrilla o brasa.", chips: ["Fresco", "Corte premium"] },
  { id: 2, title: "Carne de Cerdo", category: "CERDO", img: imgCerdo, desc: "Jugosas y tiernas, perfectas para barbecue.", chips: ["Jugoso", "BBQ"] },
  { id: 3, title: "Pollo Fresco", category: "POLLO", img: imgPollo, desc: "Magras y versátiles, ideal para recetas ligeras. Esta descripción es un poco más larga para probar la altura uniforme.", chips: ["Alto en proteína", "Magro"] },
  { id: 4, title: "Carne de Cordero", category: "CORDERO", img: imgCordero, desc: "Sabor intenso con textura suave.", chips: ["Sabor intenso", "Hornéalo lento"] },
  { id: 5, title: "Embutidos Artesanales", category: "OTROS", img: imgOtros, desc: "Selección curada de embutidos y ahumados.", chips: ["Artesanal", "Ahumado"] },
];
// --- FIN DE DATOS DE EJEMPLO ---


export default function MenuGrid() {
  const [active, setActive] = useState("TODOS");

  const list = useMemo(() => {
    // Se eliminó la lógica del carrusel infinito ([...base]).
    if (active === "TODOS") {
      return PRODUCTS;
    }
    return PRODUCTS.filter((p) => p.category === active);
  }, [active]);

  return (
    <motion.section
      id="productos"
      className="modo-oscuro py-10 bg-[#FFF5F0] text-gray-900 transition-colors duration-700"
      initial={{ y: 40, opacity: 0 }}
      whileInView={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: "easeOut", type: "tween" }}
      viewport={{ once: true, amount: 0.2 }}
    >
      <div className="mx-auto max-w-7xl px-6 lg:px-8 text-center">
        {/* Título principal */}
        <h2 className="text-3xl sm:text-6xl font-extrabold mb-12 uppercase tracking-wide">
          Nuestra Selección
        </h2>

        {/* Botones de categorías */}
        <div className="mb-12 flex flex-wrap justify-center gap-4">
          {CATEGORIES.map((cat) => {
            const isActive = cat === active;
            return (
              <button
                key={cat}
                onClick={() => setActive(cat)}
                className={`px-5 py-2 text-sm font-bold uppercase tracking-wide rounded-full transition-all duration-300 focus:outline-none
                  ${isActive
                    ? "bg-gradient-to-r from-yellow-400 to-yellow-500 text-black scale-105 shadow-md"
                    : "bg-[#0a0a0a] text-white hover:bg-[#d4af37] hover:text-black"
                  }`}
              >
                {cat}
              </button>
            );
          })}
        </div>

        {/* --- INICIO: Rejilla de Productos --- */}
        {/* Se reemplazó el div del carrusel por una rejilla (grid) responsiva. */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          {list.map((p) => (
            // Se usa p.id como key, ya que la lista no se duplica.
            <ProductCard key={p.id} p={p} />
          ))}
        </div>
        {/* --- FIN: Rejilla de Productos --- */}

      </div>
    </motion.section>
  );
}

function ProductCard({ p }) {
  return (
    // CAMBIO: Se eliminaron las clases `min-w-[...]` y se añadió `h-full`
    // para que la tarjeta ocupe toda la altura de la celda de la rejilla.
    <article className="h-full">
      <div
        className="h-full flex flex-col overflow-hidden rounded-3xl bg-[#FFF5F0] text-gray-900 ring-3 ring-black/2 
                   hover:ring-yellow-400 transition-all duration-500 ease-out
                    transform hover:-translate-y-1 hover:scale-[1.02] shadow-sm hover:shadow-xl"
        // CAMBIO: Se añadió `h-full flex flex-col` para forzar la altura
        // y permitir que el contenido se expanda verticalmente.
        // Se cambió el fondo a `bg-white` para mejor contraste en las tarjetas.
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
        {/* CAMBIO: Se añadió `flex flex-col flex-grow` para que este div
            se expanda y ocupe el espacio disponible. */}
        <div className="p-6 space-y-4 text-left flex flex-col flex-grow">
          <h3 className="text-xl font-extrabold uppercase tracking-widest text-gray-900">
            {p.title}
          </h3>
          <p className="text-base text-gray-600">{p.desc}</p>

          {/* CAMBIO: Se añadió `mt-auto` (margin-top: auto) a este div
              para empujarlo siempre al fondo de la tarjeta. */}
          <div className="flex flex-wrap gap-2 pt-3 mt-auto">
            {p.chips.map((c, i) => (
              <span
                key={i}
                className="inline-flex items-center rounded-full bg-gradient-to-r from-yellow-400 to-yellow-500 text-black 
                           px-3 py-1 text-xs font-bold uppercase tracking-wider shadow-sm transition-transform duration-300 hover:scale-105"
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
