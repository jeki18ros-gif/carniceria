import React, { useMemo, useState } from "react";
import imgRes from "../assets/otros3.jpg";
import imgCerdo from "../assets/otros4.jpg";
import imgPollo from "../assets/otros5.jpg";
import imgCordero from "../assets/otros6.jpg";
import imgOtros from "../assets/relleno7.jpg";

const DORADO = "#d4af37";
const CATEGORIES = ["TODOS", "RES", "CERDO", "POLLO", "CORDERO", "OTROS"];

const PRODUCTS = [
  { id: 1, title: "Carne de Res", category: "RES", img: imgRes, desc: "Cortes seleccionados, listos para parrilla o brasa.", chips: ["Fresco", "Corte premium"] },
  { id: 2, title: "Costillas de Cerdo", category: "CERDO", img: imgCerdo, desc: "Jugosas y tiernas, perfectas para barbecue.", chips: ["Jugoso", "BBQ"] },
  { id: 3, title: "Pechuga de Pollo", category: "POLLO", img: imgPollo, desc: "Magras y versátiles, ideal para recetas ligeras.", chips: ["Alto en proteína", "Magro"] },
  { id: 4, title: "Pierna de Cordero", category: "CORDERO", img: imgCordero, desc: "Sabor intenso con textura suave, para ocasiones especiales.", chips: ["Sabor intenso", "Hornéalo lento"] },
  { id: 5, title: "Embutidos Artesanales", category: "OTROS", img: imgOtros, desc: "Selección curada de embutidos y ahumados.", chips: ["Artesanal", "Ahumado"] },
  { id: 6, title: "Asado de Tira", category: "RES", img: imgRes, desc: "Clásico para compartir, vetas que se deshacen.", chips: ["Para asar", "Compartir"] },
  { id: 7, title: "Bondiola de Cerdo", category: "CERDO", img: imgCerdo, desc: "Corte tierno, ideal para braseados largos.", chips: ["Braseado", "Tierna"] },
];

export default function MenuCarousel() {
  const [active, setActive] = useState("TODOS");

  const list = useMemo(() => {
    const base = active === "TODOS" ? PRODUCTS : PRODUCTS.filter((p) => p.category === active);
    return [...base, ...base];
  }, [active]);

  return (
    <section id="productos" className="py-24 bg-white dark:bg-gray-900 transition-colors duration-700">
      <div className="mx-auto max-w-7xl px-6 lg:px-8 text-center">
        {/* Título principal */}
        <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900 dark:text-white mb-12 uppercase tracking-wide">
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
                    : "bg-gray-100 text-gray-800 hover:bg-yellow-200 dark:bg-gray-800 dark:text-gray-100 dark:hover:text-black dark:hover:bg-yellow-500"
                  }`}
              >
                {cat}
              </button>
            );
          })}
        </div>

        {/* Carrusel */}
        <div className="group relative overflow-hidden">
          <div className="flex gap-6 motion-safe:animate-[scrollX_28s_linear_infinite] group-hover:[animation-play-state:paused]">
            {list.map((p, idx) => (
              <ProductCard key={`${p.id}-${idx}`} p={p} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function ProductCard({ p }) {
  return (
    <article className="min-w-[75%] sm:min-w-[55%] md:min-w-[40%] lg:min-w-[30%] xl:min-w-[26%]">
      <div
        className="overflow-hidden rounded-3xl bg-white dark:bg-gray-800 shadow-xl ring-1 ring-black/10 
                    hover:shadow-2xl hover:ring-yellow-400 transition-all duration-500 ease-out
                    transform hover:-translate-y-1 hover:scale-[1.02]"
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
        <div className="p-6 space-y-4 text-left">
          <h3 className="text-xl font-extrabold uppercase tracking-widest text-gray-900 dark:text-white">
            {p.title}
          </h3>
          <p className="text-base text-gray-600 dark:text-gray-300">{p.desc}</p>

          <div className="flex flex-wrap gap-2 pt-3">
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
