import React from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import bg from "../assets/relleno10.jpg";

export default function Hero() {
  const orderPath = "/orden-de-compra";

  return (
    <motion.section
      className="relative isolate min-h-screen transition-colors duration-700"
      initial={{ y: "-10%", opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
    >
      <div className="relative w-full overflow-hidden group">
        {/* Imagen de fondo */}
        <img
          src={bg}
          alt="Carne de alta calidad servida en cena gourmet"
          className="h-screen w-full object-cover transition-transform duration-[2000ms] ease-out group-hover:scale-[1.05]"
          loading="eager"
        />
        <div className="absolute inset-0 
            bg-gradient-to-b from-gray-50/10 via-gray-50/5 to-gray-50/20 
            dark:from-black/80 dark:via-black/60 dark:to-black/90 
            transition-colors duration-700" 
        />

        {/* Contenido centrado */}
        <div className="absolute inset-0 flex flex-col items-center justify-center px-6 sm:px-12 text-center">
         <motion.h1 className="titulo-seccion text-4xl sm:text-5xl lg:text-6xl leading-tight"
            style={{ fontFamily: "ui-sans-serif, system-ui" }}
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
          >
            CARNE DE CALIDAD SUPERIOR
          </motion.h1>

          <motion.p className="texto-normal mt-4 max-w-2xl text-lg sm:text-xl leading-relaxed"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.6 }}
          >
            Seleccionamos solo los mejores cortes para una experiencia gastronómica única.
          </motion.p>

          <motion.div
            className="mt-10"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.6 }}
          >
            <Link to={orderPath} className="btn">
              Orden de compra
              <motion.svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
                fill="currentColor"
                // El icono hereda el color del texto del Link (text-gray-900)
                className="h-5 w-5"
                animate={{ x: [0, 4, 0] }}
                transition={{ repeat: Infinity, duration: 1.5, ease: "easeInOut" }}
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
      </div>
    </motion.section>
  );
}