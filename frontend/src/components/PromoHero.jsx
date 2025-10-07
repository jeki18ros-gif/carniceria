import React from "react";
import bg from "../assets/relleno10.jpg";

export default function PromoHero() {
  return (
    <section className="relative bg-[#FFF5F0] py-16 transition-colors duration-500">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Contenedor principal con sombra y borde dorado en modo oscuro */}
        <div className="relative overflow-hidden rounded-3xl shadow-2xl ring-1 ring-black/10 dark:ring-yellow-500/40 transition-all duration-500">
          {/* Imagen de fondo*/}
          <img
            src={bg}
            alt="Presentación de comida profesional con enfoque al centro"
            className="h-[60vh] w-full object-cover sm:h-[65vh] lg:h-[70vh] transition-transform duration-500 hover:scale-105"
            loading="lazy"
          />

          {/* Capa de mezcla para contraste visual */}
          <div
            className="absolute inset-0 bg-black/60 mix-blend-multiply dark:bg-black/70 transition-colors duration-500"
            aria-hidden="true"
          />

          {/* Contenido centrado */}
          <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-6 sm:px-12">
            <h2
              className="text-4xl sm:text-5xl lg:text-6xl font-extrabold uppercase tracking-widest 
                         text-yellow-400 drop-shadow-[0_4px_8px_rgba(0,0,0,0.5)] 
                         transition-colors duration-300"
            >
              PERFECT FOOD, PROFESSIONAL SERVICE
            </h2>

            <p
              className="mt-5 max-w-2xl text-base sm:text-lg text-gray-100 
                         dark:text-gray-300 transition-colors duration-300"
            >
              Experiencia inmersiva en alimentos al por mayor con estándares altos de calidad
              y procesos limpios.
            </p>

            {/* Botón CTA opcional */}
            <a
              href="#contacto"
              className="mt-8 accent-block inline-flex items-center justify-center 
                         rounded-2xl px-6 py-3 text-base font-bold uppercase tracking-widest 
                         shadow-xl hover:scale-105 hover:shadow-2xl active:scale-95 
                         transition-all duration-300"
            >
              Contáctanos
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
