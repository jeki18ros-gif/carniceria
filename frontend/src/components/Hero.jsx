import React from "react";
import bg from "../assets/primera.jpg";

export default function Hero() {
  return (
    <section className="relative isolate">
      {/*Fondo adaptativo con degradado suave */}
      <div
        className="absolute inset-0 -z-20 bg-gradient-to-b from-gray-100 to-gray-200 
                   dark:from-[#0a0a0a] dark:to-[#1a1a1a] transition-colors duration-500"
        aria-hidden="true"
      />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Contenedor de imagen con borde suave y sombra */}
        <div className="relative mt-8 overflow-hidden rounded-3xl shadow-2xl ring-1 ring-black/10 dark:ring-yellow-500/40">
          <img
            src={bg}
            alt="Carne de alta calidad servida en cena gourmet"
            className="h-[70vh] w-full object-cover sm:h-[75vh] lg:h-[80vh] transition-all duration-500"
            loading="eager"
          />

          {/* Capa oscura para contraste */}
          <div
            className="absolute inset-0 bg-black/55 mix-blend-multiply 
                       dark:bg-black/60 transition-all duration-500"
            aria-hidden="true"
          />

          {/* Contenido sobre la imagen */}
          <div className="absolute inset-0 flex flex-col">
            {/* Título centrado */}
            <div className="flex flex-1 items-center justify-center px-6 sm:px-12">
              <h1
                className="text-center font-extrabold tracking-tight text-yellow-400 
                           drop-shadow-[0_4px_8px_rgba(0,0,0,0.5)] 
                           text-4xl sm:text-5xl lg:text-6xl transition-colors duration-300"
                style={{ fontFamily: "ui-sans-serif, system-ui" }}
              >
                CARNE DE CALIDAD SUPERIOR
              </h1>
            </div>

            {/* CTA (Call To Action) */}
            <div className="relative">
              {/* Degradado inferior para suavizar transición */}
              <div
                className="pointer-events-none absolute inset-x-0 top-0 h-24 
                           bg-gradient-to-t from-black/60 to-transparent"
                aria-hidden="true"
              />
              <div className="flex items-end justify-start px-6 pb-6 sm:px-12 sm:pb-8">
                <a
                  href="#orden"
                  className="accent-block inline-flex items-center gap-2 rounded-2xl 
                             px-6 py-3 text-base font-bold uppercase tracking-widest 
                             shadow-xl hover:scale-105 hover:shadow-2xl active:scale-95 
                             transition-all duration-300"
                >
                  Orden de compra
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                    className="h-5 w-5"
                  >
                    <path
                      fillRule="evenodd"
                      d="M3 10a.75.75 0 0 1 .75-.75h9.638L10.22 6.28a.75.75 0 1 1 1.06-1.06l4.5 4.5a.75.75 0 0 1 0 1.06l-4.5 4.5a.75.75 0 1 1-1.06-1.06l3.168-3.168H3.75A.75.75 0 0 1 3 10Z"
                      clipRule="evenodd"
                    />
                  </svg>
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
