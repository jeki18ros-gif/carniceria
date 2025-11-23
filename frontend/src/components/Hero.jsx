import React from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import bg from "../assets/relleno10.jpg";
import { useTranslation } from "react-i18next";

export default function Hero() {
  const orderPath = "/orden-de-compra";
  const { t } = useTranslation();

  return (
    <motion.section
      className="relative h-screen overflow-hidden transition-colors duration-700"
      initial={{ y: "-10%", opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
    >
      {/* Imagen de fondo */}
      {/* Imagen de fondo (solo visible en pantallas medianas hacia arriba) */}
<img
  src={bg}
  alt={t("hero.image_alt")}
  className="hidden md:block absolute inset-0 h-full w-full object-cover transition-transform duration-500 ease-out will-change-transform group-hover:scale-[1.03]"
  loading="eager"
/>

{/* Capa de degradado */}
<div
  className="
    absolute inset-0
    /* Desktop - degradado original */
    md:bg-gradient-to-b md:from-white-100/10 md:via-white-50/5 md:to-white-50/20
    md:dark:from-black/80 md:dark:via-black/60 md:dark:to-black/90

    /* Mobile - fondo rojizo tipo carne */
    bg-gradient-to-b from-[#8b1e1e]/80 via-[#b83232]/60 to-[#330000]/90
    dark:from-[#400000]/80 dark:via-[#7a0f0f]/60 dark:to-[#330000]/70

    transition-colors duration-700
  "
/>


      {/* Contenido centrado */}
      <div className="relative z-10 flex flex-col items-center justify-center h-full px-6 sm:px-12 text-center">
        <motion.h1
          className="titulo-seccion text-4xl sm:text-5xl lg:text-6xl leading-tight"
          style={{ fontFamily: "ui-sans-serif, system-ui" }}
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
        >
          {t("hero.title")}
        </motion.h1>

        <motion.p
          className="texto-normal mt-4 max-w-2xl text-lg sm:text-xl leading-relaxed"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.6 }}
        >
          {t("hero.description")}
        </motion.p>

        <motion.div
          className="mt-10"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.6 }}
        >
          <Link to={orderPath} className="btn">
            {t("hero.cta_order")}
            <motion.svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
              fill="currentColor"
              className="h-5 w-5"
              animate={{ x: [0, 4, 0] }}
              transition={{
                repeat: Infinity,
                duration: 1.5,
                ease: "easeInOut",
              }}
            >
              <path
                fillRule="evenodd"
                d="M3 10a.75.75 0 0 1 .75-.75h9.638L10.22 6.28a.75.75 0 1 1 1.06-1.06l4.5 4.5a.75.75 0 0 1 0 1.06l-4.5 4.5a.75.75 0 1 1-1.06-1.06l3.168-3.168H3.75A.75.75 0 0 1 3 10Z"
                clipRule="evenodd"
              />
            </motion.svg>
          </Link>
        </motion.div>
      </div>
    </motion.section>
  );
}
