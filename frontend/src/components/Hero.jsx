import React from "react";
<<<<<<< HEAD
import { Link } from "react-router-dom";
=======
import { motion } from "framer-motion";
>>>>>>> 01237090e53e7608a34e2923bb70ee44b90235e4
import bg from "../assets/relleno10.jpg";

export default function Hero() {
  return (
<<<<<<< HEAD
    <section className="relative isolate min-h-screen">
      <div
        className="absolute inset-0 -z-20 bg-gradient-to-b from-gray-100 to-gray-200 
                   dark:from-[#0a0a0a] dark:to-[#1a1a1a]"
      />
=======
    <motion.section
      className="relative isolate min-h-screen transition-colors duration-700"
      initial={{ y: "-10%", opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}      
      transition={{ duration: 0.6, ease: "easeOut"}}
    >
>>>>>>> 01237090e53e7608a34e2923bb70ee44b90235e4

      <div className="relative w-full">
        <div className="relative mt-0 overflow-hidden group">
          <img
            src={bg}
            alt="Carne de alta calidad servida en cena gourmet"
            className="h-screen w-full object-cover transition-transform duration-500 ease-out group-hover:scale-[1.03]"
          />

          <div
            className="absolute inset-0 bg-black/55 mix-blend-multiply 
<<<<<<< HEAD
                         dark:bg-black/60"
=======
                       transition-all duration-500"
            aria-hidden="true"
>>>>>>> 01237090e53e7608a34e2923bb70ee44b90235e4
          />

          {/* Contenido principal */}
          <div className="absolute inset-0 flex flex-col items-center justify-center px-6 sm:px-12 text-center">
            <h1
<<<<<<< HEAD
              className="font-extrabold tracking-tight text-dorado 
                           drop-shadow-[0_4px_8px_rgba(0,0,0,0.5)] 
                           text-4xl sm:text-5xl lg:text-6xl"
              style={{ fontFamily: 'ui-sans-serif, system-ui' }}
=======
              className="font-extrabold tracking-tight text-yellow-400 
                         drop-shadow-[0_4px_8px_rgba(0,0,0,0.5)] 
                         text-4xl sm:text-5xl lg:text-6xl transition-colors duration-300 titulo-seccion"
              style={{ fontFamily: "ui-sans-serif, system-ui" }}
>>>>>>> 01237090e53e7608a34e2923bb70ee44b90235e4
            >
              CARNE DE CALIDAD SUPERIOR
            </h1>

            <div className="mt-8">
<<<<<<< HEAD
              <Link
                to="/orden-de-compra"
                className="accent-block inline-flex items-center gap-2 rounded-2xl 
                            px-6 py-3 text-base font-bold uppercase tracking-widest no-underline
                            shadow-xl transition-transform duration-300 ease-out"
=======
              <a
                href="https://lesalimentsbenito.onrender.com/"
                target="_blank"
                className="accent-block inline-flex items-center gap-2 rounded-2xl  
                           px-6 py-3 text-base font-bold uppercase tracking-widest no-underline
                           shadow-2xl hover:scale-110 hover:shadow-2xl active:scale-95 
                           transition-transform duration-300 ease-out"
>>>>>>> 01237090e53e7608a34e2923bb70ee44b90235e4
              >
                Orden de compra
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                  className="h-5 w-5 motion-safe:animate-[arrowMove_1.5s_ease-in-out_infinite]"
                >
                  <path
                    fillRule="evenodd"
                    d="M3 10a.75.75 0 0 1 .75-.75h9.638L10.22 6.28a.75.75 0 1 1 1.06-1.06l4.5 4.5a.75.75 0 0 1 0 1.06l-4.5 4.5a.75.75 0 1 1-1.06-1.06l3.168-3.168H3.75A.75.75 0 0 1 3 10Z"
                    clipRule="evenodd"
                  />
                </svg>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </motion.section>
  );
}