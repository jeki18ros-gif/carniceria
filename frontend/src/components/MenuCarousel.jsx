import React, { useMemo, useState } from "react";
import imgRes from "../assets/otros3.jpg";
import imgCerdo from "../assets/otros4.jpg";
import imgPollo from "../assets/otros5.jpg";
import imgCordero from "../assets/otros6.jpg";
import imgOtros from "../assets/relleno7.jpg";

// Paleta coherente con index.css
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
    return [...base, ...base]; // para scroll infinito
  }, [active]);

  return (
    <section className="relative light-block dark:dark-block py-16 transition-colors duration-500">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Barra de filtros */}
        <div className="mb-12 flex flex-wrap justify-center gap-3">
          {CATEGORIES.map((cat) => {
            const isActive = cat === active;
            return (
              <button
                key={cat}
                onClick={() => setActive(cat)}
                className={`px-5 py-2 text-xs sm:text-sm font-bold uppercase tracking-wide rounded-2xl 
                            transition-all duration-300 shadow-md focus:outline-none 
                            ${
                              isActive
                                ? "accent-block scale-105 shadow-xl ring-2 ring-yellow-400"
                                : "bg-gray-100 text-gray-800 ring-1 ring-gray-300 hover:bg-yellow-200 dark:bg-gray-800 dark:text-gray-100 dark:ring-gray-600 dark:hover:bg-yellow-500 dark:hover:text-black"
                            }`}
              >
                {cat}
              </button>
            );
          })}
        </div>

        {/* Carrusel infinito */}
        <div className="group relative overflow-hidden">
          <div className="flex gap-6 will-change-transform animate-[scrollX_28s_linear_infinite] group-hover:[animation-play-state:paused]">
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
    <article className="min-w-[75%] sm:min-w-[55%] md:min-w-[40%] lg:min-w-[30%] xl:min-w-[26%] transition-transform duration-300 hover:-translate-y-1">
      <div className="overflow-hidden rounded-3xl bg-white shadow-xl ring-1 ring-black/10 
                      transition-all duration-500 hover:shadow-2xl hover:ring-yellow-400 
                      dark:bg-[#1a1a1a] dark:ring-yellow-500/30 dark:hover:ring-yellow-400">
        <div className="aspect-[4/3] w-full overflow-hidden">
          <img
            src={p.img}
            alt={p.title}
            className="h-full w-full object-cover transition-transform duration-500 hover:scale-110"
            loading="lazy"
          />
        </div>

        <div className="space-y-3 p-6">
          <h3 className="text-xl font-extrabold uppercase tracking-widest text-gray-900 dark:text-white transition-colors">
            {p.title}
          </h3>
          <p className="text-base text-gray-600 dark:text-gray-300 transition-colors">
            {p.desc}
          </p>

          <div className="mt-4 flex flex-wrap gap-2 pt-2">
            {p.chips.map((c, i) => (
              <span
                key={i}
                className="inline-flex items-center rounded-full bg-yellow-400 text-black 
                           px-3 py-1 text-xs font-bold uppercase tracking-wider shadow-sm 
                           dark:bg-yellow-500 transition-all duration-300"
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
