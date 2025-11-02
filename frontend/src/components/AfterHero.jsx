import React from "react";
import { motion } from "framer-motion";
import leftImg from "../assets/otros2.jpg";
import rightImg from "../assets/relleno8.jpg";
import "../styles/AfterHero.css"; // Importa los keyframes

export default function AfterHero() {
  return (
    <motion.section
      className="afterhero relative min-h-[70vh] transition-colors duration-700"
      initial={{ y: 40, opacity: 0 }}
      whileInView={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: "easeOut", type: "tween" }}
      viewport={{ once: true, amount: 0.2 }}
    >
      <div className="mx-auto flex min-h-[60vh] max-w-7xl items-center px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        <div className="relative isolate mx-auto flex flex-col sm:flex-row items-center justify-center gap-6 sm:gap-10 text-center sm:text-left">
          {/* Imagen izquierda */}
          <div className="relative block shrink-0 mr-2 sm:mr-6 lg:mr-10">
            <FlowerPortrait
              src={leftImg}
              alt="Cliente satisfecho disfrutando de comida"
              accentColor="#F0B100"
            />
          </div>

          {/* Texto central */}
          <div className="relative mx-auto text-center">
            <h2 className="titulo-seccion mx-auto max-w-4xl text-pretty text-3xl sm:text-5xl lg:text-6xl font-extrabold leading-tight tracking-tight transition-colors duration-700">
              <span>OFRECEMOS PRODUCTOS DE CALIDAD, EN </span>
              <span className="text-gold drop-shadow-[0_0_8px_rgba(240,177,0,0.6)]">
                BENITO
              </span>{" "}
              <span>CONOCERÁS </span>
              <span className="text-gold drop-shadow-[0_0_8px_rgba(240,177,0,0.6)]">
                EL SABOR
              </span>{" "}
              <span>DE NUESTRA CARNE.</span>
            </h2>
          </div>

          {/* Imagen derecha */}
          <div className="relative block shrink-0 ml-2 sm:ml-6 lg:ml-10">
            <FlowerPortrait
              src={rightImg}
              alt="Persona feliz en ambiente agradable"
              accentColor="#F0B100"
            />
          </div>
        </div>
      </div>

     
      {/* Cinta inferior dorada animada */}
<div className="relative mt-20">
  <div className="absolute inset-x-0 z-10 promo-banner py-8">
    <div className="scrolling-text-wrapper">
      {/* Primera tanda */}
      <div className="scrolling-text">
        {Array.from({ length: 12 }).map((_, i) => (
          <span key={`a-${i}`}>★ ENTREGA A DOMICILIO DISPONIBLE ★</span>
        ))}
      </div>
    </div>
  </div>
</div>
    </motion.section>
  );
}

// Imagen decorativa flotante
function FlowerPortrait({ src, alt, accentColor }) {
  return (
    <div className="relative h-24 w-24 sm:h-36 sm:w-36 md:h-40 md:w-40 animate-[floatY_6s_ease-in-out_infinite]">
      <div className="relative z-10 h-full w-full overflow-hidden rounded-full border-2 border-transparent shadow-md">
        <img
          src={src}
          alt={alt}
          className="h-full w-full object-cover"
          loading="lazy"
        />
      </div>

      {/* Pétalos dorados */}
      {[
        "-top-2 left-1/2 -translate-x-1/2",
        "top-4 -left-2",
        "top-4 -right-2",
        "-bottom-2 left-1/2 -translate-x-1/2",
      ].map((pos, i) => (
        <span
          key={i}
          className={`absolute ${pos} h-7 w-7 rounded-full border-2 bg-white`}
          style={{ borderColor: accentColor }}
        />
      ))}
    </div>
  );
}
