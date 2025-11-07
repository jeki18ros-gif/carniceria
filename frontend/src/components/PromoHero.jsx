import React from "react";
import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import bg from "../assets/relleno9.jpg";

export default function PromoHero() {
  const { t } = useTranslation();
  const data = t("promoHero", { returnObjects: true });

  return (
    <motion.section
      className="relative overflow-hidden bg-[#FFF5F0] transition-colors duration-500"
      initial={{ y: 40, opacity: 0 }}
      whileInView={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: "easeOut", type: "tween" }}
      viewport={{ once: true, amount: 0.2 }}
    >
      {/* Imagen de fondo */}
      <img
        src={bg}
        alt={data.image_alt}
        className="absolute inset-0 h-full w-full object-cover"
        loading="lazy"
      />

      {/* Capa de mezcla oscura */}
      <div
        className="absolute inset-0 bg-black/60 mix-blend-multiply transition-colors duration-500"
        aria-hidden="true"
      />

      {/* Contenido central */}
      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-20 sm:py-32 lg:py-40">
        <div className="flex flex-col items-start justify-center text-left">
          {/* Título principal */}
          <h2
            className="text-4xl sm:text-5xl lg:text-6xl font-extrabold uppercase tracking-widest 
                       text-yellow-400 drop-shadow-[0_4px_8px_rgba(0,0,0,0.5)] 
                       transition-colors duration-300 titulo-seccion"
          >
            {data.title}
          </h2>

          {/* Descripción */}
          <p
            className="mt-5 max-w-2xl text-base sm:text-lg text-gray-100 
                       dark:text-gray-300 transition-colors duration-300"
          >
            {data.description}
          </p>

          {/* Botón CTA */}
          <a
            href="#contacto"
            className="mt-8 accent-block inline-flex items-center justify-center 
                       rounded-2xl px-6 py-3 text-base font-bold uppercase tracking-widest 
                       shadow-xl hover:scale-105 hover:shadow-2xl active:scale-95 
                       transition-all duration-300"
          >
            {data.cta_contact}
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
              fill="currentColor"
              className="h-5 w-5 ml-2 motion-safe:animate-[arrowMove_1.5s_ease-in-out_infinite]"
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
    </motion.section>
  );
}
